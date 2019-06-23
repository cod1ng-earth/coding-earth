<?php
namespace App\Sources;

use App\Model\Event;
use DateTime;
use Exception;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerAwareTrait;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function array_filter;
use function array_merge;
use function json_decode;
use function property_exists;
use function str_replace;

class TechConferences implements EventSourceInterface, LoggerAwareInterface
{
    use LoggerAwareTrait;

    /**
     * @var \Symfony\Contracts\Cache\TagAwareCacheInterface
     */
    private $appCache;
    /**
     * @var \Symfony\Contracts\HttpClient\HttpClientInterface
     */
    private $httpClient;

    private const ONE_MONTH = 60 * 60 * 24 * 30;

    private const ALLOWED_COUNTRIES = [
        'Germany',
        'Deutschland',
        'U.K.',
        'UK',
        'France',
        'Spain',
        'Netherlands',
        'Belgium',
        'Portugal',
        'Poland',
        'Greece',
        'Switzerland',
        'Austria',
        'Italy',
        'Ukraine',
        'Belarus',
        'Croatia',
        'Cyprus',
        'Czech',
        'Ireland',
        'Sweden',
        'Denmark',
        'Norway',
        'Finland',
        'Estonia',
        'Lithuania',
        'Latvia',
        'Serbia',
        'Slovenia',
        'Slovakia',
        'Hungary',
        'Romania',
        'Bulgaria'
    ];

    public function __construct(TagAwareCacheInterface $taggedPoolCache, HttpClientInterface $httpClient)
    {
        $this->appCache = $taggedPoolCache;
        $this->httpClient = $httpClient;
    }

    protected function readConferenceIndex($year) {
        $index = $this->appCache->get(
            "tech-conferences.$year",
            function(ItemInterface $item) use ($year) {
                $item->expiresAfter(3600);
                $item->tag(['tech-conferences']);
                $response = $this->httpClient->request('GET', "https://api.github.com/repos/tech-conferences/conference-data/contents/conferences/$year");
                $index = json_decode($response->getContent(), false);
                return $index;
            }
        );
        return $index;
    }

    protected function readAllEvents($year): array {

        $index = $this->readConferenceIndex($year);
        $events = [[]];
        foreach($index as $tech) {
            $name = str_replace('.json', '', $tech->name);

            $content = $this->appCache->get(
                "tech-conferences.$year.$name.{$tech->sha}",
                function(ItemInterface $item) use ($tech, $name) {
                    $item->expiresAfter(self::ONE_MONTH);

                    $response = $this->httpClient->request('GET', $tech->download_url, [
                        'user_data' => $name
                    ]);

                    return $response->getContent();
                }
            );

            $content = json_decode($content, false);
            $events[] = $this->makeEvents($content, [$name]);
        }

        $allEvents = array_merge(...$events);
        return $allEvents;
    }

    protected function makeEvents(array $ghEvents, array $tags = []): array {
        $result = [];
        foreach($ghEvents as $ghEvent) {
            try {
                if (!in_array($ghEvent->country, self::ALLOWED_COUNTRIES)) {
                    continue;
                }

                $event = new Event();
                $event->setType('conference')
                    ->setSummary($ghEvent->name)
                    ->setStart(new DateTime($ghEvent->startDate))
                    ->setLocation("{$ghEvent->city}, {$ghEvent->country}")
                    ->setUrl($ghEvent->url)
                    ->setTags($tags);

                if (property_exists($ghEvent, 'endDate')) {
                    $event->setEnd(new DateTime($ghEvent->endDate));
                } else {
                    $event->setEnd($event->getStart());
                }

                $description = '';
                if (property_exists($ghEvent, 'cfpUrl')) {
                    $description .= "Call for Papers: {$ghEvent->cfpUrl}";
                }
                if (property_exists($ghEvent, 'cfpEndDate')) {
                    $description .= " CfP ends: {$ghEvent->cfpEndDate}";
                }

                $event->setDescription($description);
                $result[] = $event;
            } catch(Exception $e) {
                $this->logger->info($e->getMessage());
            }

        }
        return $result;
    }

    public function getEvents(DateTime $from, DateTime $to)
    {
        $year = $from->format('Y');
        $allEvents = $this->readAllEvents($year);

        $respondEvents = array_filter($allEvents, function(Event $event) use ($from, $to) {
            return $event->getStart()->getTimestamp() >= $from->getTimestamp() &&
                   $event->getStart()->getTimestamp() <= $to->getTimestamp();
        });

        return $respondEvents;
    }
}
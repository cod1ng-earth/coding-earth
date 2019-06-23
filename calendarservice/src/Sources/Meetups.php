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
use function array_slice;
use function json_decode;
use function property_exists;

class Meetups implements EventSourceInterface, LoggerAwareInterface
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

    private const ONE_DAY = 60 * 60 * 24;

    public const GROUPS = [
        'CODING-BERLIN',
        'coding-leipzig',
        'coding-stuttgart',
        'CODING-PORTUGAL',
        'Berlin-JS',
        'jug-bb',
        'Vue-js-Berlin',
        'sfugberlin',
        'Women-Who-Code-Berlin-Germany',
        'Women-Techmakers-Berlin',
        'Berlin-Hack-and-Tell',
        'Berlin-PHP-Usergroup',
        'JAMStack_berlin',
        'PyBerlin',
        'Software-Craftsmanship-Berlin',
        'GOTO-Nights-Berlin',
        'Python-Users-Berlin-PUB',
        'aws-berlin',
        'ReactJS-and-React-Native-Berlin',
        'Berlin-Ethereum-Meetup',
        'Node-js-Meetup-Berlin',
        'graphql-berlin',
        'React-Open-Source',
        'fullstack-berlin',
        'kotlin-berlin',
        'Elixir-Berlin',
        'Rust-Berlin',
        'Big-Data-Developers-in-Berlin',
        'Elasticsearch-Berlin',
        'Cocoaheads-Berlin',
        'gatsbyjs',
        'Berlin-Spring-User-Group',
        'AHODBerlin',
        'IOTA-Engineer-Meetup',
        'MUGBerlin',
        'Berlin-CI-CD-Meetup',
        'GitHub-Events-Berlin',
    ];

    public function __construct(TagAwareCacheInterface $taggedPoolCache, HttpClientInterface $httpClient)
    {
        $this->appCache = $taggedPoolCache;
        $this->httpClient = $httpClient;
    }

    protected function readAllEvents(): array {
        $mostPopularGroups = array_slice(self::GROUPS, 0,12);

        foreach($mostPopularGroups as $groupName) {
            $content = $this->appCache->get(
                "meetups.$groupName",
                function(ItemInterface $item) use ($groupName) {
                    $item->expiresAfter(self::ONE_DAY);
                    $eventUrl = "https://api.meetup.com/$groupName/events";
                    $response = $this->httpClient->request('GET', $eventUrl, [
                        'query' => [
                            'scroll' => 'recent_past'
                        ]
                    ]);
                    return $response->getContent();
                }
            );

            $content = json_decode($content, false);
            $events[] = $this->makeEvents($content);
        }

        $allEvents = array_merge(...$events);
        return $allEvents;
    }


    protected function makeEvents(array $meetupEvents): array {
        $result = [];
        foreach($meetupEvents as $meetupEvent) {
            try {
                $event = new Event();
                $event->setType('meetup')
                    ->setSummary($meetupEvent->group->name . ': ' . $meetupEvent->name)
                    ->setUrl($meetupEvent->link);

                $start = new DateTime();
                $start->setTimestamp($meetupEvent->time / 1000);
                $event->setStart($start);

                if (property_exists($meetupEvent, 'duration')) {
                    $durationS = $meetupEvent->duration / 1000;

                    $end = new DateTime();
                    $end->setTimestamp($start->getTimestamp() + $durationS);
                    $event->setEnd($end);
                } else {
                    $event->setEnd($event->getStart());
                }
                if (property_exists($meetupEvent, 'venue')) {
                    $venue = $meetupEvent->venue;
                    $location = "{$venue->name} {$venue->address_1} {$venue->city}";
                    $event->setLocation($location);
                    $event->setGeo([
                        'lat' => $venue->lat,
                        'lon' => $venue->lon
                    ]);
                }

                if (property_exists($meetupEvent, 'description')) {
                    $event->setDescription($meetupEvent->description);
                }

                $result[] = $event;
            } catch(Exception $e) {
                $this->logger->warning($e->getMessage());
            }
        }
        return $result;
    }

    public function getEvents(DateTime $from, DateTime $to)
    {
        $allEvents = $this->readAllEvents();
        $respondEvents = array_filter($allEvents, function(Event $event) use ($from, $to) {
            return $event->getStart()->getTimestamp() >= $from->getTimestamp() &&
                   $event->getStart()->getTimestamp() <= $to->getTimestamp();
        });
        return $respondEvents;
    }
}
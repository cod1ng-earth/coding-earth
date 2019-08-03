<?php
namespace App\Sources;

use App\Model\Event;
use App\Util\Location;
use DateTime;
use ICal\ICal;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use function array_merge;

class Ics implements EventSourceInterface
{

    /**
     * @var array
     */
    private $calendars;
    /**
     * @var string
     */
    private $config;
    /**
     * @var \Symfony\Contracts\Cache\TagAwareCacheInterface
     */
    private $appCache;

    public function __construct(TagAwareCacheInterface $taggedPoolCache, string $config)
    {
        $this->config = $config;
        $this->appCache = $taggedPoolCache;
    }

    /**
     * @required
     */
    public function initialize() {
        $this->calendars = Yaml::parse(file_get_contents($this->config))['calendars'];
    }

    public function getEvents(DateTime $from, DateTime $to)
    {
        $events = [[]];

        foreach($this->calendars as $name => $calendar) {

            $iCalEvents = $this->appCache->get(
                "{$calendar['cachekey']}.{$from->format('Ymd')}.{$to->format('Ymd')}",
                function(ItemInterface $item) use ($from, $to, $calendar, $name) {
                    $item->expiresAfter(3600);
                    $item->tag(['calendar', $name]);

                    $iCal = new ICal();
                    $iCal->initUrl($calendar['url']);

                    $events = $iCal->eventsFromRange($from->format(DateTime::ATOM), $to->format(DateTime::ATOM));
                    return $events;
                }
            );
            $events[] = $this->makeEvents($calendar, $iCalEvents);
        }

        $allEvents = array_merge(...$events);
        return $allEvents;
    }

    /**
     * @param $from DateTime
     * @param $to DateTime
     * @param $remote string
     *
     * @return array
     * @throws \Exception
     */
    protected function makeEvents(array $calendar, array $iCalEvents): array {

        $result = [];
        foreach ($iCalEvents as $iCalEvent) {
            /** @var \ICal\Event $iCalEvent */
            $event = new Event();

            $event->setType($calendar['eventtype'])
                  ->setDescription($iCalEvent->description)
                  ->setSummary($iCalEvent->summary)
                  ->setStart(new DateTime($iCalEvent->dtstart))
                  ->setEnd(new DateTime($iCalEvent->dtend))
                  ->setLocation($iCalEvent->location)
                  ->setUrl($iCalEvent->url ?? null);

            if (property_exists($iCalEvent, 'x_apple_structured_location')) {
                $event->setGeo(
                    Location::extractAppleStructuredLocation($iCalEvent->x_apple_structured_location)
                );
            }

            $result[] = $event;
        }
        return $result;
    }
}
<?php
namespace App\Controller;

use App\Util\Location;
use DateTime;
use Exception;
use ICal\ICal;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;
use function property_exists;

class DefaultController extends AbstractController
{
    /**
     * @var \Symfony\Contracts\Cache\CacheInterface
     */
    private $cache;

    /**
     * @param CacheInterface $appCache
     */
    public function __construct(CacheInterface $appCache)
    {
        $this->cache = $appCache;
    }

    /**
     * @param $from DateTime
     * @param $to DateTime
     * @param $remote string
     *
     * @return array
     * @throws \Exception
     */
    protected function readCalendarMonth($from, $to, $remote): array {
        $iCal = new ICal();
        $iCal->initUrl($remote);

        $events = $iCal->eventsFromRange($from->format(DateTime::ATOM), $to->format(DateTime::ATOM));
        $result = [];
        foreach ($events as $event) {
            /** @var \ICal\Event $event */
            $details = [
                'summary' => $event->summary,
                'start' => (new DateTime($event->dtstart))->format(DateTime::ATOM),
                'end' => (new DateTime($event->dtend))->format(DateTime::ATOM),
                'description' => $event->description,
                'location' => $event->location,
            ];

            $details['url'] = $event->url ?? null;

            if (property_exists($event, 'x_apple_structured_location')) {
                $details['geo'] = Location::extractAppleStructuredLocation($event->x_apple_structured_location);
            }
            $details['type'] = 'conference';
            $result[] = $details;
        }
        return $result;
    }

    /**
     * @Route("/", name="index")
     * @param Request $request
     *
     * @return Response
     * @throws \Psr\Cache\InvalidArgumentException|\Exception
     */
    public function index(Request $request) : Response {
        try {

            $from = new DateTime($request->get('from', 'first day of this month'));
            $to = new DateTime($request->get('to', 'last day of this month'));

            $result = $this->cache->get("calendar.turbine.{$from->format('Ymd')}.{$to->format('Ymd')}",
                function(ItemInterface $item) use ($from, $to) {
                    $item->expiresAfter(3600);
                    $results = $this->readCalendarMonth($from, $to, 'https://hermes.turbinekreuzberg.com/ical/turbinekreuzberg.com/public/events4devs');
                    return $results;
            });

            return new JsonResponse($result);
        } catch(Exception $e) {
            throw $e;
        }
    }
}
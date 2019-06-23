<?php
namespace App\Controller;

use App\Model\Event;
use App\Sources\EventSourceCollection;
use DateTime;
use Exception;
use function strlen;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;
use function array_merge;


class DefaultController extends AbstractController
{
    /**
     * @var \App\Sources\EventSourceInterface[]
     */
    private $eventSources;
    /**
     * @var \Symfony\Component\Serializer\SerializerInterface
     */
    private $serializer;
    /**
     * @var \Symfony\Contracts\Cache\TagAwareCacheInterface
     */
    private $appCache;


    /**
     * DefaultController constructor.
     *
     * @param \App\Sources\EventSourceCollection $eventSources
     * @param \Symfony\Contracts\Cache\TagAwareCacheInterface $taggedPoolCache
     * @param \Symfony\Component\Serializer\SerializerInterface $serializer
     */
    public function __construct(EventSourceCollection $eventSources, TagAwareCacheInterface $taggedPoolCache, SerializerInterface $serializer)
    {
        $this->eventSources= $eventSources->getEventSources();
        $this->serializer = $serializer;
        $this->appCache = $taggedPoolCache;
    }

    /**
     * @Route("/", name="index", methods={"GET","HEAD", "POST"})
     * @param Request $request
     *
     * @return Response
     * @throws \Psr\Cache\InvalidArgumentException|\Exception
     */
    public function index(Request $request) : Response {
        try {

            if (Request::METHOD_POST === $request->getMethod()) {
                $purge = (boolean)$request->get('purge', false);
                if ($purge) {
                    $this->appCache->invalidateTags(['calendar']);
                    return new Response('purged calendars',Response::HTTP_ACCEPTED);
                }
                return new Response('',Response::HTTP_NO_CONTENT);
            }

            $from = new DateTime($request->get('from', 'first day of this month'));
            $to = new DateTime($request->get('to', 'last day of this month'));
            $search = $request->get('search', '');

            $events = [[]];

            foreach($this->eventSources as $eventSource) {
                $events[] = $eventSource->getEvents($from, $to);
            }
            $events = array_merge(...$events);
            if (strlen($search) > 2) {
                $events = array_values(array_filter($events, function(Event $event) use ($search) {
                    return in_array($search, $event->getTags());
                }));
            }
            return new JsonResponse($this->serializer->serialize($events, "json"), Response::HTTP_OK,  [], true);
        } catch(Exception $e) {
            throw $e;
        }
    }
}
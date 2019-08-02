<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function json_decode;
use function preg_match;


class AcceptController extends AbstractController
{
    /**
     * @var \Symfony\Component\Serializer\SerializerInterface
     */
    private $serializer;
    /**
     * @var \Symfony\Contracts\HttpClient\HttpClientInterface
     */
    private $httpClient;

    /**
     * @param \Symfony\Component\Serializer\SerializerInterface $serializer
     */
    public function __construct( SerializerInterface $serializer, HttpClientInterface $httpClient)
    {
        $this->serializer = $serializer;
        $this->httpClient = $httpClient;
    }

    /**
     * @Route("/url", name="url", methods={"POST"})
     * @param Request $request
     *
     * @return Response
     * @throws \Psr\Cache\InvalidArgumentException|\Exception
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function index(Request $request) : Response {

        $json = $request->getContent();
        $body = json_decode($json);
        $url = $body->url;
        $matches = [];

        $res = preg_match('/(.*)\.meetup\.com\/(.*)\/events\/(.*)\//', $url, $matches);
        if ($res === 0)
            return new Response("$url is not for me");

        $groupName = $matches[2];
        $eventId = $matches[3];

        $apiUrl = "https://api.meetup.com/$groupName/events/$eventId";
        $response = $this->httpClient->request("GET", $apiUrl);
        $content = json_decode($response->getContent());
        return new JsonResponse($content);

    }
}
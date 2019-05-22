<?php
namespace App\Controller;

use DateInterval;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route("/", name="index")
     */
    public function index(Request $request) {

        $d = new DateTime();
        $d->modify("first day of this month");

        $result = [];

        $result[] = [
            "d" => $d->format("d"),
            "m" => $d->format("m"),
            "y" => $d->format("Y")
        ];

        $oneDay = new DateInterval("P1D");
        for ($i = 0; $i < 30; $i++) {
            $d->add($oneDay);
            $result[] = [
                "d" => $d->format("d"),
                "m" => $d->format("m"),
                "y" => $d->format("Y")
            ];
        }

        return new JsonResponse($result);
    }
}
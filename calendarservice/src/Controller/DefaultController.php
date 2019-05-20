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

        $result = [$d->format("Y-m-d")];

        $oneDay = new DateInterval("P1D");
        for ($i = 0; $i < 30; $i++) {
            $result[] = $d->add($oneDay)->format("Y-m-d");
        }

        return new JsonResponse($result);
    }
}
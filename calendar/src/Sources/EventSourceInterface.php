<?php

namespace App\Sources;

use DateTime;

interface EventSourceInterface
{
    public function getEvents(DateTime $from, DateTime $to);

}
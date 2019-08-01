<?php
namespace App\Sources;

class EventSourceCollection
{
    /**
     * @var iterable|EventSourceInterface[]
     */
    private $eventSources;

    public function __construct(iterable $eventSources)
    {
        $this->eventSources = $eventSources;
    }

    /**
     * @return EventSourceInterface[]|iterable
     */
    public function getEventSources()
    {
        return $this->eventSources;
    }

}
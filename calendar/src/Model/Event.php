<?php
namespace App\Model;


use function array_unique;

class Event
{
    /**
     * @var string
     */
    private $summary;

    /**
     * @var \DateTime
     */
    private $start;

    /**
     * @var \DateTime
     */
    private $end;

    /**
     * @var string|null
     */
    private $description;

    /**
     * @var string|null
     */
    private $location;

    /**
     * @var string|null
     */
    private $url;

    /**
     * @var array|null
     */
    private $geo;

    /**
     * @var string
     */
    private $type;

    /**
     * @var array
     */
    private $tags;

    /**
     * Event constructor.
     */
    public function __construct()
    {
        $this->tags = [];
    }

    /**
     * @return string
     */
    public function getSummary(): string
    {
        return $this->summary;
    }

    /**
     * @param string $summary
     *
     * @return Event
     */
    public function setSummary(string $summary): Event
    {
        $this->summary = $summary;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getStart(): \DateTime
    {
        return $this->start;
    }

    /**
     * @param \DateTime $start
     *
     * @return Event
     */
    public function setStart(\DateTime $start): Event
    {
        $this->start = $start;
        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getEnd(): \DateTime
    {
        return $this->end;
    }

    /**
     * @param \DateTime $end
     *
     * @return Event
     */
    public function setEnd(\DateTime $end): Event
    {
        $this->end = $end;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     *
     * @return Event
     */
    public function setDescription(?string $description): Event
    {
        $this->description = $description;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getLocation(): ?string
    {
        return $this->location;
    }

    /**
     * @param string|null $location
     *
     * @return Event
     */
    public function setLocation(?string $location): Event
    {
        $this->location = $location;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getUrl(): ?string
    {
        return $this->url;
    }

    /**
     * @param string|null $url
     *
     * @return Event
     */
    public function setUrl(?string $url): Event
    {
        $this->url = $url;
        return $this;
    }

    /**
     * @return array|null
     */
    public function getGeo(): ?array
    {
        return $this->geo;
    }

    /**
     * @param array|null $geo
     *
     * @return Event
     */
    public function setGeo(?array $geo): Event
    {
        $this->geo = $geo;
        return $this;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     *
     * @return Event
     */
    public function setType(string $type): Event
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @return array
     */
    public function getTags(): array
    {
        return $this->tags;
    }

    /**
     * @param array $tags
     *
     * @return Event
     */
    public function setTags(array $tags): Event
    {
        $this->tags = $tags;
        return $this;
    }

    /**
     * @param string $tag
     *
     * @return Event
     */
    public function addTag(string $tag): Event {
        $this->tags[] = $tag;
        $this->tags = array_unique($this->tags);
        return $this;
    }

}
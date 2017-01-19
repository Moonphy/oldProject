<?php
namespace Url;

trait UrlDataTrait
{
    public $uriData = [];

    public function parseUrl($url)
    {
        $this->url = $url;
        $this->uriData = parse_url($this->url);

        $this->scheme = isset($this->uriData['scheme']) ? $this->uriData['scheme'] : '';
        $this->host   = isset($this->uriData['host']) ? $this->uriData['host'] : '';
        $this->path   = isset($this->uriData['path']) ? strtolower($this->uriData['path']) : '';
        $this->fragment = isset($this->uriData["fragment"]) ? '#'.$this->uriData["fragment"] : '';
        $this->query = array();
        isset($this->uriData['query']) ? parse_str($this->uriData['query'], $this->query) : '';
    }
}

<?php
use ORM\CZ\Feed;
use ORM\CZ\Follow;
use ORM\CZ\School;

class Api_Cz_FeedModel extends Api_School_FeedModel
{
    public function __construct(Follow $orm)
    {
        parent::__construct($orm);
    }
}
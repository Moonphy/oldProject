<?php
use ORM\GZ\Feed;
use ORM\GZ\Follow;
use ORM\GZ\School;

class Api_Gz_FeedModel extends Api_School_FeedModel
{
    public function __construct(Follow $orm)
    {
        parent::__construct($orm);
    }
}

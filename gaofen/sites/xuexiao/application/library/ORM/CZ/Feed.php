<?php
namespace ORM\CZ;

use ORM\Base as ORMBase;

/**
 * 学校动态ORM
 */
class Feed extends ORMBase
{
    protected $table = 'cz_feeds';

    public $timestamps = true;

    /**
     * 动态属于一个学校
     * @return
     */
    public function schools()
    {
        return $this->belongsTo('ORM\CZ\School');
    }
}
<?php
namespace ORM\CZ;

use ORM\Base as ORMBase;

/**
 * 学校动态ORM
 */
class Follow extends ORMBase
{
    protected $table = 'cz_follows';

    public $timestamps = true;

    /**
     * 动态属于一个学校
     * @return
     */
    public function school()
    {
        return $this->belongsTo('ORM\CZ\School');
    }
}
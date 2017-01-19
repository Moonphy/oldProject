<?php
namespace ORM\GZ;

use ORM\Base as ORMBase;

/**
 * 学校动态ORM
 */
class Follow extends ORMBase
{
    protected $table = 'gz_follows';

    public $timestamps = true;

    /**
     * 动态属于一个学校
     * @return
     */
    public function schools()
    {
        return $this->belongsTo('ORM\GZ\School');
    }
}
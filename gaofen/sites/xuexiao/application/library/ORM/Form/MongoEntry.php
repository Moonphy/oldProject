<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/2
 * Time: 下午3:52
 */

namespace ORM\Form;


use ORM\MongoBase;

class MongoEntry extends MongoBase
{
    protected $connection = 'mongo_form';

    protected $collection = 'entries_collection';

}
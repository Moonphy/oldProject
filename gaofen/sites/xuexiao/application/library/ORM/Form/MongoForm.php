<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 上午11:21
 */

namespace ORM\Form;


use ORM\MongoBase;

class MongoForm extends MongoBase
{
    protected $connection = 'mongo_form';

    protected $collection = 'forms_collection';

}
<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/8
 * Time: 上午10:48
 */

namespace Modules\Baike;


use ORM\Baike\Category;
use Repositories\BaseDBRepo;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepo extends BaseDBRepo
{
    public function __construct(Category $entry)
    {
        parent::__construct($entry);
    }

    public function findBy(array $conditions, array $columns = ['*'])
    {
        $categories = \F::api('baike:/category/listByCond', $conditions);


        if ($categories['list']) {
            $categories['list'] = sub_array_to_orm($categories['list'], get_class($this->entry));
        }

        return new Collection($categories['list']);
    }

}
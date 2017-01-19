<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/7
 * Time: 上午10:50
 */

namespace Modules\Cms;

use ORM\CMS\Huodong;
use Repositories\BaseDBRepo;
use Illuminate\Database\Eloquent\Collection;

class HuodongRepo extends BaseDBRepo
{

    public function __construct(Huodong $entry)
    {
        parent::__construct($entry);
    }

    public function find($uuid, array $columns = ['*'])
    {
        $huodong = \F::api('cms:/lectures/get', ['id' => $uuid]);

        return new Huodong($huodong);
    }


    public function findBy(array $conditions, array $columns = ['*'])
    {
        $huodongs = \F::api('cms:/lectures/list', $conditions);

        if ($huodongs['list']) {
            $huodongs['list'] = new Collection(sub_array_to_orm($huodongs['list'], get_class($this->entry)));
        }else{
            $huodongs['list'] = [];
        }

        return $huodongs;
    }

}
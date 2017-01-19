<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/16
 * Time: 下午2:13
 */

namespace Modules\Form\Backend;

use F;

class EntryRepo extends \Modules\Form\EntryRepo
{
    /**
     * 和findBy一样,不过会带上总记录条数
     * @param int $page
     * @param int $limit
     * @param array $conditions
     * @param array $columns
     * @return mixed
     */
    public function paginate($page = 1, $limit = 1, array $conditions, array $columns = ['*'])
    {
        return F::api('/form/entry/listByCond', ['page' => $page, 'limit' => $limit] + $conditions);
    }

}
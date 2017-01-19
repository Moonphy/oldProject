<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/7/6
 * Time: 下午2:29
 */

namespace Modules\Form;

use F;
use Repositories\Contracts\Repository;

class FormRepo implements Repository
{
    /**
     * 查找所有记录
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'])
    {
        // TODO: Implement all() method.
    }

    /**
     * 根据唯一标示符返回一条记录
     * @param $uuid          唯一标示符, 譬如id
     * @param array $columns 需要返回的字段
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function find($uuid, array $columns = ['*'])
    {
        return F::api('/form/form/get', ['id' => $uuid]);
    }

    /**
     * 根据条件返回一个记录集合
     * @param array $conditions
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findBy(array $conditions, array $columns = ['*'])
    {
        return F::api('/form/form/get', $conditions);
    }

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
        return F::api('/form/form/listByCond', ['page' => $page, 'limit' => $limit] + $conditions);
    }

    /**
     * 创建一条新记录, 如果创建成功,返回这个对象
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function create(array $data)
    {
        // TODO: Implement create() method.
    }

    /**
     * 更新记录
     * @param array $data
     * @param $uuid
     * @param string $attribute
     */
    public function update(array $data, $uuid, $attribute = 'id')
    {
        // TODO: Implement update() method.
    }

    /**
     * 删除记录
     * @param $uuid
     * @return int
     */
    public function delete($uuid)
    {
        // TODO: Implement delete() method.
    }
}
<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 下午5:43
 */

namespace Modules\Form\Backend;

use F;
use Repositories\Contracts\Repository;

class FormRepo extends \Modules\Form\FormRepo implements Repository
{
    /**
     * 创建一条新记录, 如果创建成功,返回这个对象
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Model|bool
     */
    public function create(array $data)
    {
        return F::api('/form/form/create', $data);
    }

    /**
     * 更新表单
     * @param array $data
     * @param $uuid
     * @param string $attribute
     * @return array|mixed
     */
    public function update(array $data, $uuid, $attribute = 'id')
    {
        return F::api('/form/form/update', [$attribute => $uuid] + $data);
    }

    /**
     * 删除表单
     * @param $uuid
     * @return int
     */
    public function delete($uuid)
    {
        return F::api('/form/form/create', ['id' => $uuid]);
    }
}
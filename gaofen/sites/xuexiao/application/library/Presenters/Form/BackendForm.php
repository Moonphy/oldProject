<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/9
 * Time: 下午2:20
 */

namespace Presenters\Form;


use Presenters\AbstractModelPresenter;

class BackendForm extends AbstractModelPresenter
{
    public function fields()
    {
        $fields = $this->_model->fields;

        $fields = json_decode($fields);

        return $fields->data;
    }

}
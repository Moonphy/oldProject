<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/9
 * Time: 上午10:49
 */

namespace Presenters\Form;


use Presenters\AbstractModelPresenter;

class BackendEntries extends AbstractModelPresenter
{

    public function __get($property)
    {
        return parent::__get($property);
    }

    public function fields($field_id)
    {
        $fields = $this->_model->fields;

        $fields = json_decode($fields);

        if (!isset($fields->data->$field_id)) {
            return null;
        }
        $value = $fields->data->$field_id;

        if (is_array($value)) {

            $value = implode(' ', $value);
        }

        return urldecode($value);
    }

}
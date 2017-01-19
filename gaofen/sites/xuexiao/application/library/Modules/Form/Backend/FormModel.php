<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 下午5:38
 */

namespace Modules\Form\Backend;


class FormModel extends \Modules\Form\FormModel
{
    public function __construct(FormRepo $repo, $formId)
    {
        parent::__construct($repo, $formId);
    }

    public function update(array $data)
    {
        return $this->repo->update($data, $this->formId);
    }

    public function destory()
    {

    }

}
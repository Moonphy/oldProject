<?php
/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/7/6
 * Time: 下午2:26
 */

namespace Modules\Form;


use ORM\Form\Form;

class FormModel
{
    /**
     * @var FormRepo
     */
    protected $repo;
    protected $formId;

    public function __construct(FormRepo $repo, $formId)
    {
        $this->repo = $repo;
        $this->formId = $formId;
    }

    public function getTheForm()
    {
        return $this->repo->find($this->formId);
    }

    public function needToValidCaptcha(Form $form)
    {
        $fields = json_decode($form->fields);

        if (isset($fields->extData)) {

            foreach ($fields->extData as $extData) {

                $extData->type == 'code_text';

                return true;
            }

        }

        return false;
    }

}
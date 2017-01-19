<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/2
 * Time: 上午10:58
 */
class FormController extends Yaf_Controller_Abstract
{
    use \Filters\ControllerFilterTrait;

    public function init()
    {
//        $this->filters(['AuthAjaxRequest', 'DisableView'], ['only' => ['store']]);
    }


    /**
     * 表单页面
     */
    public function showAction()
    {
        $this->setPath();

        $id = V('g:id', null);
        $model = DIBuilder::make('Modules\Form\Backend\FormModel', ['formId' => $id]);

        $form = $model->getTheForm();

        $this->getView()->assign(compact('form'));
    }

    public function embeddedAction()
    {
        $userAgent = DIBuilder::make('UserAgent');
        $this->getView()->assign('id', V('r:id', null));
        $this->getView()->assign('mobile', $userAgent->is_mobile());
        $this->getView()->assign('height', V('r:height', 500));
    }

    /**
     * 预览
     */
    public function previewAction()
    {
        $this->setPath();
        $form = new ORM\Form\Form(V('P'));
        $this->getView()->assign(compact('form'));
    }

    /**
     * 问卷提交
     * @return bool
     */
    public function storeAction()
    {
        $id = V('g:id', null);
        $model = DIBuilder::make('Modules\Form\Backend\FormModel', ['formId' => $id]);
        $form = $model->getTheForm();

        if ($model->needToValidCaptcha($form)) {
            $this->filters(['AuthCaptcha']);
        }

        $model = DIBuilder::make('Modules\Form\EntryModel', ['formId' => $id]);

        try {
            $form = $model->create(array_except(V('P'), ['id']));
        } catch (InvalidArgumentException $exception) {

            if (is_ajax()) {

                $message = F::ajaxRst([], $exception->getCode(), $exception->getMessage());

            } else {

                throw $exception;
            }
        }

        if (isset($form)) {

            $message = F::ajaxRst($form->toArray());
        }

        if (is_ajax()) {

            echo $message;

        } else {

            var_dump($form->toArray());
        }

    }

    public function finishAction()
    {
        $this->setPath();

    }

    protected function setPath()
    {
        if (V('g:mobile', 0)) {
            $path = $this->getViewPath();
            $this->getView()->setScriptPath($path . '/mobile');
        }
    }
}
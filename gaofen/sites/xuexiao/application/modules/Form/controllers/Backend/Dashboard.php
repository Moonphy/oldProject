<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/6/1
 * Time: 下午3:27
 */
class Backend_DashboardController extends Yaf_Controller_Abstract
{
    protected $model;
    use \Filters\ControllerFilterTrait;

    public function init()
    {
        $this->filters(['GaofenAdmin']);
        $this->filters(['AuthAjaxRequest', 'DisableView'], ['only' => ['store']]);

        $this->model = DIBuilder::make('Modules\Form\Backend\DashboardModel');
    }

    /**
     * 后台首页,显示当前用户的表单
     */
    public function indexAction()
    {
        $forms = $this->model->getMyForms();

        $this->getView()->assign(compact('forms'));

    }

    /**
     * 新建表单前端页面
     */
    public function createAction()
    {

    }

    /**
     * 保存新建表单的操作
     */
    public function storeAction()
    {
        try {
            $form = $this->model->create(V('P'));
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

}
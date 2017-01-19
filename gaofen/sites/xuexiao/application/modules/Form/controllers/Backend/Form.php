<?php

/**
 * Created by PhpStorm.
 * User: timsims
 * Date: 15/5/28
 * Time: 下午4:09
 */
class Backend_FormController extends Yaf_Controller_Abstract
{
    use \Filters\ControllerFilterTrait;
    protected $model;
    protected $id;

    public function init()
    {
        $this->filters(['GaofenAdmin']);
        $this->filters(['AuthAjaxRequest', 'DisableView'], ['only' => ['update']]);

        $this->id = V('r:id', null);

        if (!$this->id) {
            $this->redirect('/form/backend_dashboard/index');

            return false;
        }

        $this->model = DIBuilder::make('Modules\Form\Backend\FormModel', ['formId' => $this->id]);

        $form = $this->model->getTheForm();
        $this->getView()->assign(compact('form'));
    }

    /**
     * 概述
     */
    public function showAction()
    {

    }

    /**
     * 编辑表单
     */
    public function editAction()
    {

    }

    public function updateAction()
    {
        $form = $this->model->update(V('P'));

        if ($form) {

            echo F::ajaxRst([], 0);
        }
    }

    /**
     * 发布
     */
    public function publishAction()
    {

    }

    /**
     * 数据显示
     */
    public function entriesAction()
    {

        $model = DIBuilder::make('Modules\Form\Backend\EntryModel', ['formId' => $this->id]);

        $entries = $model->getEntries(V('g:page', 1));

        $this->getView()->assign(compact('entries'));
    }

    /**
     * 报告分析
     */
    public function reportAction()
    {

    }

}
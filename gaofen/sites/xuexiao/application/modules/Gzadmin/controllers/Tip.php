<?php

/**
 * 经验分享
 */
class TipController extends AdminCommonController
{
    /**
     * @var Admin_Cz_TipModel
     */
    protected $_model;

    public function init()
    {
        parent::init();

        $this->_model = NY('Admin_Cz_TipModel');
    }

    public function indexAction($school_id)
    {
        $limit = 50;
        $page = V('G:page', 1);

        $model = $this->_model->getTips($school_id, $limit, $page);

        $tips = $model->items;

        $pager = new PagerInit();

        $page_html = $pager->pager($model->totalItems, $limit, $page);

        $action = 'tips';

        $this->getView()->assign(compact('tips', 'school_id', 'page_html', 'action'));
    }

    public function doAction($school_id)
    {
        $inputs = $_POST;

        $inputs['school_id'] = $school_id;

        $rst = isset($inputs['id']) && $inputs['id'] ? $this->_model->update($inputs) : $this->_model->create($inputs);

        if ($this->getRequest()->isXmlHttpRequest()) {

            if (isset($rst['err'])) {

                F::ajaxRst(null, $rst['errno'], $rst['err']);
            }

            F::ajaxRst($rst);
        }

        return false;

    }

    public function deleteAction($school_id)
    {
        $ids = V('R:ids', false);
        $rst = $this->_model->delete($ids, $school_id);

        if ($this->getRequest()->isXmlHttpRequest()) {

            if (isset($rst['err'])) {

                F::ajaxRst(null, $rst['errno'], $rst['err']);
            }

            F::ajaxRst($rst);
        }

        return false;
    }
}
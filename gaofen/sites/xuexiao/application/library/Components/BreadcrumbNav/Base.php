<?php
namespace Components\BreadcrumbNav;

/**
 * 面包屑
 */
class Base
{
    private $_reqObj  = NULL; //获取Yaf_Request对像
    private $_navData = array(); //nav数据数组
    private $_tplname = ''; //导航模板名

    function __construct(array $params=array(), $tplname=''){
        $this->_reqObj = \Yaf_Dispatcher::getInstance()->getRequest();        

        $this->_params = $params;
        $this->setTplName($tplname);

        //调用方法
        $callname = 'call'.$this->_reqObj->getControllerName().$this->_reqObj->getActionName();
        if(is_callable(array($this, $callname))){
            $this->$callname($params);
        }
    }

    function __toString() {
        return $this->render();
    }

    function addNavData($name, $link, $target='_blank', $class='') {
        $this->_navData[] = array('name'=>$name, 'link'=>$link, 'target'=>$target, 'class'=>$class);
    }

    //
    public function setTplName($name) {
        $this->_tplname = $name;
        return $this;
    }

    public function render() {
        $_tplname = $this->_tplname;
        if(!$_tplname) {
            $_tplname = 'common';
        }

        return (new \Yaf_View_Simple(BASEPATH. '/application/views'))
                ->render('Components/breadcrumbNav/'.$_tplname.'.html', array('navData'=>$this->_navData));
    }

/////------------------------------------------------------------------->

    public function callEntryview(array $params=array()) {
        foreach($params as $name=>$data) {
            if(is_callable(array($this, $name))){

                $this->$callname($data);
            }
        }
    }
}
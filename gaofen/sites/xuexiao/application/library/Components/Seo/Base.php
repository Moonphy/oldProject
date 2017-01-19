<?php

namespace Components\Seo;

class Base {

	private $__controller 	= NULL;
	private $__action		= NULL;

	public $__tpls = array(); //seo文本模板

	static $_renderData = []; //额外render变量值

	final function __construct() {
		$this->initController();
		$this->initAction();

		if(method_exists($this, '_init')) {
			$this->_init(); //代替__construct()
		}
	}

	protected function addRenderData($field, $value) {
		static::$_renderData[$field] = $value;
	}

	//获取 seo数据
	public function __call($name, $args=array()) {
		$_serveMethod = array(
				'getTitle'=>'title',
				'echoTitle' => 'title',
				'getKeyword'=>'keyword',
				'echoKeyword' => 'keyword',
				'getDesc' =>'desc',
				'echoDesc' => 'desc',
				);

		if(isset($_serveMethod[$name])) {
			$tpl = $this->getTpl();

			$text = NULL;
			$data = array_shift($args);
			$data = is_array($data)?array_merge($data, static::$_renderData):static::$_renderData;
			if(isset($tpl[$_serveMethod[$name]])) {

				if(is_array($tpl[$_serveMethod[$name]])) {
					if(isset($data['__pindex'])) {
						$text = $this->textRender($tpl[$_serveMethod[$name]][$data['__pindex']], $data);
					}
				}else{
					$text = $this->textRender($tpl[$_serveMethod[$name]], $data);
				}
			}

			if(strpos($name, 'echo')!==false) {
				\F::O($text);
			} else{
				return $text;
			}			
		}
	}


	//获得相应页面的seo数据模板
	protected function getTpl($controller='', $action='') {
		$_idxName = strtolower(($controller?:$this->getController()).'.'.($action?:$this->getAction()));

		if(isset($this->__tpls[$_idxName])) {
			return $this->__tpls[$_idxName];
		}

		return '';
	}

	//seo内容变量宣染
	protected function textRender($tpl, $data) {
		preg_match_all('#{(.*?)}#sim', $tpl, $result);
//var_dump($result);
		//模板值替换
		$finalText = $tpl;
		if(!empty($result[1])){
			$result[1] = array_unique($result[1]);
			foreach($result[1] as $_k=>$field) {
				if(isset($data[$field])) {
					$_preText = $finalText;
					$finalText = str_replace('{'.$field.'}', $data[$field], $finalText);
					if($_preText!==$finalText) unset($result[1][$_k]);
				}
			}
			//特殊数据回调处理
			if(!empty($result[1])) {
				if(isset($data['__callback'])) {
					$__callback = $data['__callback'];
					unset($data['__callback']); //子类也用可以继承此方法，为避免死循环，只能unset掉
					$finalText = $this->$__callback($finalText, $data);
				}
			}
		}

		return $finalText;
	}

	protected function initController($controller=NULL) {
		$this->__controller = $controller?:\Yaf_Dispatcher::getInstance()->getRequest()->getControllerName();
		return $this->__controller;
	}

	protected function getController() {
		return $this->__controller;
	}

	protected function initAction($action=NULL) {
		$this->__action = $action?:\Yaf_Dispatcher::getInstance()->getRequest()->getActionName();
		return $this;
	}

	protected function getAction() {
		return $this->__action;
	}
}
<?php
namespace Html;

use \DIBuilder;

class Form
{
    /**
     * @var \DIBuilder
     */
    protected $_builder;

    /**
     *
     * @var Access|Array
     */
    protected $_model;

    /**
     * 表单的提交方法，默认是POST
     * @var string
     */
    protected $_method = 'POST';

    /**
     * 表单提交的url
     * @var string
     */
    protected $_action;

    /**
     * 表单能否提交文件
     * @var boolean
     */
    protected $_isFile = false;

    /**
     * 表单的标签属性
     * @var array
     */
    protected $_attributes;

    /**
     * 表单的名字
     * @var string
     */
    protected $_name;

    /**
     * 表单是否已闭合
     * @var boolean
     */
    protected $_isOpen = false;

    /**
     *
     * @param DIBuilder $builder
     * @param array||ArrayAccess    $model
     */
    public function __construct(DIBuilder $builder, $model = array())
    {
        $this->_checkAccessable($model);

        $this->_model = $model;

        $this->_builder = $builder;
    }

    public function __call($method, $params)
    {
        if (!$this->_isOpen) {
            throw new \Exception("请先执行form->open()", 1);
        }

        $prefix = 'Html\Form\\';

        $className = $prefix.ucfirst($method);

        $instance = $this->_builder->make($className, ['model' => $this->_model]);

        return call_user_func_array(array($instance, $method), $params);
    }

    public function __get($name)
    {
        return isset($this->_model[$name]) ? $this->_model[$name] : null;
    }

    public function model(array $model, $name, $action, array $options = array(), array $attributes = array())
    {
        $this->_checkAccessable($model);

        $this->_model = $model;

        return $this->open($name, $action, $options, $attributes);
    }

    public function open($name, $action, array $options = array(), array $attributes = array())
    {
        $this->_action = $action;

        $this->_options = $options;

        $this->_name = $name;

        $this->_attributes = $attributes;

        return $this->output();
    }

    protected function _checkAccessable($model)
    {
        if (!$this->_isAccessable($model)) {
            throw new \Exception("model不是数据或没有实现ArrayAcess接口", 1);
        }
    }

    protected function _isAccessable($model)
    {
        return is_array($model) || ($model instanceof \ArrayAccess);
    }

    public function output()
    {
        $this->_isOpen = true;

        $form = '<form ';

        $form .= ' name='.$this->_name;

        $form .= ' action='.$this->_action;

        $method = isset($this->_options['method']) ? $this->_options['method'] : $this->_method;

        $form .= ' method='.$method;

        $this->_isFile = isset($this->_options['file']) &&  $this->_options['file'] ? true : false;

        $form .= $this->_isFile ? ' enctype="multipart/form-data"' : '';

        $form .= $this->_getAttributes();

        return $form.' />';
    }

    /**
     * 闭合表单，并且重置所有
     * @return string
     */
    public function close()
    {
        $this->_action = null;

        $this->_options = [];

        $this->_name = null;

        $this->_attributes = [];

        $this->_isOpen = false;

        return '</form>';
    }

    /**
     * 获取默认值
     */
    protected function _getDefault($default)
    {
        $name = $this->_name;

        if ($this->_model && isset($this->_model[$name])) {
            return $this->_model[$name];
        }

        return $default;
    }

    /**
     * 获取属性
     * @return string
     */
    protected function _getAttributes()
    {
        $attrs = null;

        foreach ($this->_attributes as $attrKey => $attrValues) {
            $attrs .= " $attrKey= '$attrValues' ";
        }

        return $attrs;
    }
}

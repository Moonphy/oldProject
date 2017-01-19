<?php
namespace Html\Form;

use Html\Form;

class Select extends Form
{
    protected $_name;

    protected $_default;

    protected $_options;

    protected $_attributes;


    public function select($name, array $options, $default = null, array $attributes = array())
    {
        $this->_name = $name;

        $this->_options = $options;

        $this->_default = $this->_getDefault($default);

        $this->_attributes = $attributes;

        return $this->output();
    }

    public function output()
    {
        $tag = '<select ';

        $tag .= ' name='.$this->_name;

        foreach ($this->_attributes as $attrName => $attrValues) {
            $tag .= " $attrName='$attrValues' ";
        }

        $tag .= '>'.$options = $this->_getOptions();


        return $tag.'</select>';
    }

    /**
     * 生成option部分的内容
     * @return string
     */
    protected function _getOptions()
    {
        $options = $this->_isOptionPrefixAble() ? (array) $this->_options[0] + $this->_options[1] : $this->_options;
        $option = null;
        foreach ($options as $name => $value) {
            // 假如存在默认值，并且option中的值相同，会添加selected属性

            $select = $this->_default && $name == $this->_default ? " selected " : "";

            $option .= "<option value='$name' $select >$value</option>";
        }
        return $option;
    }

    protected function _isOptionPrefixAble()
    {
        $options = $this->_options;
        return count($options) == 2 && is_string($options[0]) && is_array($options[1]);
    }
}

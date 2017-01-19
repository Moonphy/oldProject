<?php
namespace Html\Form;

class Input
{
    /**
     * 样式属性
     * @var array
     */
    protected $_attributes;

    protected $_name;

    protected $_value;

    protected $_type;

    public function __construct($type = 'text', $name = null, $value = '', array $attributes = array())
    {
        $this->_type = $type;
        $this->_name = $name;
        $this->_value = $value;
        $this->_attribute = $attributes;
    }

    public function output()
    {

        $tag = "<input ";

        $tag .=  " type = ".$this->_type;
        $tag .=  " name = ".$this->_name;
        $tag .=  " value = '".$this->_value."'";

        foreach ($this->_attribute as $attrName => $attrValues) {
            $tag.= " $attrName='$attrValues' ";
        }

        $tag .= '>';

        return $tag;
    }
}
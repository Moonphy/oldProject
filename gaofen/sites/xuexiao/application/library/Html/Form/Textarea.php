<?php
namespace Html\Form;
use Html\Form;

class Textarea extends Form
{
    public function textarea($name, $value = null, array $attributes = [])
    {
        $this->_name = $name;

        $this->_default = $this->_getDefault($value);


        $tag = "<textarea name=".$name;

        foreach ($attributes as $attrName => $attrValues) {

            $tag .= " $attrName='$attrValues' ";
        }

        $tag .= '>';

        $tag .= $this->_default;

        return $tag .= "</textarea>";
    }


}
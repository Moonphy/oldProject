<?php
namespace Html\Form;

use Html\Form;

class Radio extends Form
{
    protected $_check;

    public function radio($name, $value, $default = null, array $attributes = array())
    {

        $this->_name = $name;

        $default = $this->_getDefault($value);

        if (isset($this->_model[$name]) && $value == $default) {

            $attributes['checked'] = 1;

        }

        $input = $this->_builder->make('Html\Form\Input', array(
            'type' => 'radio',
            'name' => $name,
            'value' => $value,
            'attributes' => $attributes,
        ));

        return $input->output();

    }
}

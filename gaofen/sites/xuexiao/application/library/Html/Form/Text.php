<?php
namespace Html\Form;
use Html\Form;

class Text extends Form
{
	public function text($name, $value = null, array $attributes = null)
	{
		$this->_name = $name;

		$this->_default = $this->_getDefault($value);

		$input = $this->_builder->make('Html\Form\Input',
			array('name' => $name, 'value' => $this->_default, 'attributes' => $attributes)
			);

		return $input->output();
	}

}
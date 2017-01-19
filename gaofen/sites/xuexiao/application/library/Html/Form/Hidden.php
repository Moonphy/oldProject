<?php
namespace Html\Form;
use Html\Form;

class Hidden extends Form
{
	public function hidden($name, $value = null, array $attributes = null)
	{
		$this->_name = $name;

		$this->_default = $this->_getDefault($value);

		$input = $this->_builder->make('Html\Form\Input',
			array('type' => 'hidden', 'name' => $name, 'value' => $this->_default, 'attributes' => $attributes)
			);

		return $input->output();
	}

}
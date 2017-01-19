<?php
namespace Html\Form;
use Html\Form;

class Checkbox extends Form
{

	public function checkbox($name, $value, $checked = false)
	{
		$this->_name = $name;

		$default = $this->_getDefault($value);

		$default = $default ? $default : array();

		$default = is_array($default) ? $default : array($default);

		$attr = array();

		if (preg_match('/(.+)\[(.+)]/', $name, $matchs)) {

			 if ($this->_model[$matchs[1]][$matchs[2]] && in_array($value, $default) ) {

			 	$attr['checked'] = 1;

			 }

		}else if (isset($this->_model[$name]) && in_array($value, $default)) {

			$attr['checked'] = 1;

		}

		$input = $this->_builder->make('Html\Form\Input', array(
			'type' => 'checkbox',
			'name' => $name.'[]',
			'value' => $value,
			'attributes' => $attr,
			));

		return $input->output();

	}
}
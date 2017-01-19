<?php
namespace Presenters;

use Illuminate\Database\Eloquent\Model as Eloquent;

abstract class AbstractModelPresenter
{
	protected $_model;

	public function __construct(Eloquent $model)
	{
		$this->_model = $model;
	}

	public function __get($property)
	{
		if (method_exists($this, $property)) {
			return $this->$property();
		}
		return $this->_model->$property;
	}
}

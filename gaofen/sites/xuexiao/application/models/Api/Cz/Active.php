<?php

class Api_Cz_ActiveModel extends Api_School_ActiveModel
{
	public function getCacheListName(array $params)
	{
		$listName = 'cz:user:active:list';
		return $listName;
	}
}
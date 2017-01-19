<?php

class Api_Gz_ActiveModel extends Api_School_ActiveModel
{
	public function getCacheListName(array $params)
	{
		$listName = 'gz:user:active:list';
		return $listName;
	}
}
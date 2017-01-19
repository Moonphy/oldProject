<?php
/**
 * 微信端评论
 */

class Weixin_CommentController extends Yaf_Controller_Abstract {
	
	private $_prefix = '';

	private function projectId($proejct) {

	}


	public function createAction() {


	}


	public function listAction() {
		$project 	= V('project');
		$limit 	= (int)V('g:limit', 20);
		$page	= max((int)V('g:page'), 1);


		//限制分页上限值
		$maxLimit = 100;
		if($limit > $maxLimit) {
			$limit = $maxLimit;
		}

		$projectId = $this->projectId($project);



	}
}
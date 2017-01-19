<?php
namespace Modules\School;

class Post{
	
	/**
	 * [getTopic description]
	 * @param  int $params['school_type'] 学段
	 * @param  int $params['limit'] 获取条数
	 * @param  int $params['flag'] 资讯类型
	 * @return [type]         [description]
	 */
	function getTopic($params) {
		if(isset($params['limit'])) {
			$params['count'] = $params['limit'];
		}

		$cacheKey = 'posts:'.md5(__NAMESPACE__.implode(':', $params));
		$TTL = 1800;

		$list = \Cache::get($cacheKey);
		if(empty($list)) {
			$list = \F::api('cp:/post/search', $params);
			$list = isset($list['rst']['data'])?$list['rst']['data']:array();
			foreach($list as $k=>$item) {
				unset($list[$k]['post_contens']);
			}
			\Cache::set($cacheKey, $list, $TTL);
		}
		return $list;
	}
}
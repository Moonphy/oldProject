<?php 
namespace Modules\Huodong\Mobileactivity\ActionTraits;
use F;
use Cache\Redis;

trait LoginTrait{

	public function traitTest(){
		return F::dump('trait_test');
	}

}
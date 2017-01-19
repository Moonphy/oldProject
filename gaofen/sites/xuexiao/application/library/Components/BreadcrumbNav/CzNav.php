<?php

namespace Components\BreadcrumbNav;

use \F;

class CzNav extends Base{
	public function indexNav() {
        $this->addNavData('学校库', F::URL('cz:/school/index'));
        return $this;
    }

    public function czIndexNav(){
        $this->addNavData('初中库', F::URL('/cz/school/index', array()));
        return $this;
    }

    public function czViewNav($schoolInfo){
        $this->addNavData($schoolInfo['name'], F::URL('/cz/school/view', array('id'=>$schoolInfo['id'])));
        return $this;
    }

    public function finalNav($name) {
        $this->addNavData($name, '');
        return $this;
    }
}

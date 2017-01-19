<?php

namespace Components\BreadcrumbNav;

use \F;

class GzNav extends Base{
	public function indexNav() {
        $this->addNavData('学校库', F::URL('gz:/school/index'));
        return $this;
    }

    public function czIndexNav(){
        $this->addNavData('高中库', F::URL('/gz/school/index', array()));
        return $this;
    }

    public function czViewNav($schoolInfo){
        $this->addNavData($schoolInfo['name'], F::URL('/gz/school/view', array('id'=>$schoolInfo['id'])));
        return $this;
    }

    public function finalNav($name) {
        $this->addNavData($name, '');
        return $this;
    }
}

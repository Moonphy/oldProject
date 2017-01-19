<?php

use Modules\Huodong\Xunbao\BaseTaskController;

class Weixin_Xunbao_TaskaController extends BaseTaskController
{
    protected function getType()
    {
        $xb2016 = CFG::huodong('xb2016');
        return $xb2016['taska']['type'];
    }

    protected function myPrefix()
    {
        return $this->aPrefix;
    }

    protected function prerequisite()
    {
        return true;
    }
}

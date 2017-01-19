<?php
namespace Modules\Huodong\BaseTask\ActionTraits;

use F;

trait Portfolio
{
    abstract protected function getType();
    abstract protected function getUser();
    abstract protected function getDefaultInfo();
    abstract protected function getPortfolioValidation();

    protected function getPortfolio($uid = null) {
        if (!$uid) {
            $uid = $this->getUser()->getUserId();
        }

        $items = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'uid' => $uid,
            'type' => $this->getType(),
        ]);
        $len = sizeof($items['list']);

        $default = array_merge([
            'id' => null, 
            'uid' => $uid 
        ], $this->getDefaultInfo());

        if ($len == 0) {
            return $default;
        }
        $info = $items['list'][0]->assemblage;
        if (!$info) {
            return $default;
        }
        $info['id'] = $items['list'][0]->id;
        return array_merge($default, $info);
    }

    public function portfolioAction() {
        $uinfo = $this->getPortfolio();
        $this->getView()->assign('uinfo', $uinfo);
    }

    public function updateportfolioAction() {
        $uinfo = $this->getPortfolio();
        $user = $this->getUser();
        $nuinfo = array_merge($uinfo);
        $uid = $user->id;

        $key = $this->getCacheKey("up:$uid");
        $val = $this->getCache()->get($key);
        if (30 <= $this->getCache()->get($key)) {
            F::ajaxRst(false, 100001, '已到达到申请上限，请24小时后再试。');
            exit;
        }

        $input = $this->getDefaultInfo();
        foreach ($input as $k => $v) {
            $input[$k] = V("p:$k");
        }

        $validation = $this->getPortfolioValidation();
        $valid = true;
        $errMsg = null;
        foreach ($validation as $k => $v) {
            if (!preg_match($v['p'], $input[$k])) {
                $valid = false;
                $errMsg = $v['m'];
                break;
            } else {
                $nuinfo[$k] = $input[$k];
            }
        }
        if (!$valid) {   
            F::ajaxRst(false, 100001, $errMsg);
            exit;
        }

        $this->getCache()->setex($key, 12*3600, $val + 1);
        if (!$nuinfo['id']) {
            $nuinfo['uid'] = $user->id;
            $rs = F::api('Huodong/Bestvoice/Assemblage/create', [
                'uid' => $user->id,
                'pid' => 0,
                'type' => $this->getType(),
                'assemblage' => $nuinfo,
            ]);
        } else {
            $rs = F::api('Huodong/Bestvoice/Assemblage/update', [
                'id' => $nuinfo['id'],
                'assemblage' => $nuinfo,
            ]);
        }

        if (!$rs) {
            F::ajaxRst(false, 100001, '更改失败，请重试。');
            exit;
        }
        F::ajaxRst(['uinfo' => $nuinfo]);
        exit;
    }

}

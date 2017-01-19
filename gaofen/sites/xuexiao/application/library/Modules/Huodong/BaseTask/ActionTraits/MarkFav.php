<?php
namespace Modules\Huodong\BaseTask\ActionTraits;

use F;
use CACHE;

trait MarkFav
{
    abstract protected function getType();
    abstract protected function isEnd();
    abstract protected function getPrjCode();

    public function markfavAction($onSuccess = null)
    {
        $this->requireLogin(true);
        $mid = V('g:m');
        $uid = $this->userObj->getUserId();
        $type = $this->getType();
        $code = $this->getPrjCode();

        if ($this->isEnd()) {
            F::ajaxRst(['markfav' => false], 8001, '活动已结束');
        }

        $key = "{$code}:fav:{$type}:{$uid}";
        if ('1' == CACHE::get($key)) {
            F::ajaxRst(['markfav' => false], 8002, '太快了，慢点慢点。');
            exit;
        }
        CACHE::setex($key, 5, '1');

        $rs = F::api('/Huodong/Bestvoice/Fav/listByCond', [
            'uid' => $uid,
            'type' => $this->getType(),
            'mid' => $mid,
            'limit' => 1,
        ]);

        if (sizeof($rs['list']) == 0) {
            $prj = $this->getPrjCode();

            $inviter = 0;
            if (isset($_SESSION[$prj]['inviter'])) {
                $inviterUid = $_SESSION[$prj]['inviter']['uid'];
                $inviterMid = $_SESSION[$prj]['inviter']['mid'];
                if ($inviterMid == $mid) {
                    $inviter = $inviterUid;
                }
            }

            $favRs = F::api('/Huodong/Bestvoice/Fav/create', [
                'uid' => $uid, 
                'mid' => $mid, 
                'inviter' => $inviter,
                'type' => $type,
            ]);

            if (!is_null($onSuccess)) {
                call_user_func_array($onSuccess, [$uid, $mid]);
            }

            if($favRs) {
                F::ajaxRst([
                    'markfav' => true,
                ]);
            }
        }

        F::ajaxRst(['markfav' => false], 8003, '已投票');
    }

    public function isfavAction() {
        $this->requireLogin(true);
        $mid = V('g:m');
        $uid = $this->userObj->getUserId();
        $type = $this->getType();
        $code = $this->getPrjCode();

        $rs = F::api('/Huodong/Bestvoice/Fav/listByCond', [
            'uid' => $uid,
            'type' => $this->getType(),
            'mid' => $mid,
            'limit' => 1,
        ]);

        $isFav = true;
        if (sizeof($rs['list']) == 0) {
            $isFav = false;
        }

        F::ajaxRst([
            'isFav' => $isFav,
        ]);
    }
}

<?php
namespace Modules\Huodong\Ny2016;

use Modules\Huodong\Prize as BasePrize;
use F;

class Prize extends BasePrize
{
    public function getDrawStatus($userId, $materialId)
    {
        $prize = F::api('/Huodong/Bestvoice/Prize/listByCond', [
            'uid' => $userId,
            'pid' => $materialId,
            'type' => $this->getType(),
        ]);

        if (sizeof($prize['list']) == 0) {
            return null;
        }

        if (strpos($prize['list'][0]->gift, 'redpack') === 0) {
            return 'redpack';
        }
        return $prize['list'][0]->gift;
    }
    
    public function writeData(array $data) {
        $rs = NULL;

        $gift   = $this->getGift();
        $ex = ['gift'=>$gift];
        $data = array_merge($ex, $data);

        if(empty($data['type'])) {
            throw new \Exception('缺少type参数', '100001');
        }

        $rs = \F::api('/Huodong/Bestvoice/Prize/create', $data);

        if(!empty($rs->id)) {
            return $rs;
        }else{
            return false;
        }
    }

    public function getGift2()
    {
        $gift = $this->getGift();
        if (strpos($gift, 'redpack') === 0) {
            return 'redpack';
        }
        return $gift;
    }
}

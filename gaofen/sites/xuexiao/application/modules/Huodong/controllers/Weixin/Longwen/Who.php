<?php


use Service\ThirdParty\WeixinJssdk;
use Modules\Huodong\Match\Match;
use Modules\Huodong\Bestvoice\User;


class Weixin_Match_WhoController extends Yaf_Controller_Abstract
{	

    public function init() {
        $this->type = 3;
        $this->hashIdsObj = new Hashids\Hashids('zy_match', 5);
        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig', json_encode($jsSdk->getCfg()));
        $this->getView()->assign('ajaxUri', json_encode($this->getAJaxUri()));
        $this->getView()->assign('shareData', json_encode($this->getShareContent()));
    }

	/**
	 * 首页
	 * @return [type] [description]
	 */
    public function indexAction() {
        $id     = V('g:id'); //已保存的对比数据
        $cmp_uid= V('g:cmp_uid');
        $face1 = '';
        $face_default = GAOFEN_STATIC.'/html/weixin/match/img/pic-student.png';

        $info = '';
        $id = array_shift($this->hashIdsObj->decode($id));
        if($id) { //历史记录浏览
            $tmp = F::api('/Huodong/Bestvoice/Assemblage/get', ['id'=>$id]);
            if($tmp) {
                $info = $tmp->assemblage;
            }
        }

        if(empty($info) && $cmp_uid) { //选择比较
            $uInfo  = F::api('/Huodong/bestvoice/User/get', ['id'=>$cmp_uid]);
            if($uInfo) {
                //$face1 = \F::imageUrl($uInfo->headimgurl, '', '', false);
                $face1 = "http://file.gaofen.com/html/weixin/voice/img/match/{$cmp_uid}-1.jpg";
            }
        }

        $tips = $this->getTips($info);

        $this->getView()->assign(compact(['info', 'face1', 'face_default', 'tips']));
    }

    private function getTips($info) {
        $msg = '自古至今，老师与学生就是一对亦师亦友的存在，那么他们面对面多了会产生容貌相似吗？';
        if(isset($info['compareResult']['similarity'])) {
            $rate = round($info['compareResult']['similarity']);
            switch($rate) {
                case $rate>0:
                    $msg = '你们的相貌已经接近神级接近了，请好好珍惜这个缘分哦！';
                break;
            }
        }

        return $msg;
        
    }


    /**
     * 图片对比
     * @return [type] [description]
     */
    public function compareAction() {
        $face1  = F::imageUrl(V('p:face1'),'180_180', '', false); //face1
        $face2  = F::imageUrl(V('p:face2'),'180_180', '', false); //face2

        if(F::inEnv('develop')) {
            $face1  = 'http://file.gaofen.com/teacher/2015/11/201511101149345641694e6aaa7_180_180.jpg';
            $face2  = 'http://file.gaofen.com/teacher/2015/11/20151110093529564149e180fb4_180_180.jpg';
        }

        if(empty($face1) || empty($face2)) {
            F::AjaxRst(false, 100001, '缺少参数');
        }

        $userObj = new User();

        $matchObj = new Match();
        $compareResult = $matchObj->compare($face1, $face2)->getResult();

        if($compareResult) {
            $assemblage = ['face1'=>$face1, 'face2'=>$face2, 'compareResult'=>$compareResult];
            $rs = F::api('/Huodong/Bestvoice/Assemblage/create', ['uid'=>$userObj->getUserId(), 'assemblage'=>$assemblage, 'type'=>$this->type]);
            $id = $this->hashIdsObj->encode($rs->id);
            if(!empty($rs->id)) {
                $result['url']  = F::URL('huodong_m:/huodong/weixin_match_who/index', ['id'=>$id]);
                $result['id']   = $id;
                $result['similarity']   = round($compareResult['similarity']).'%';
                $result['tips'] = $this->getTips($assemblage);
                F::AjaxRst($result);
            }
        }

        F::AjaxRst(false, 1000002, '无法识别!图片上的人物需五官清晰！请确认后再试！');
    }



    function getAJaxUri() {
        $uri = [
            'uploadface'=>F::URL('huodong_m:/huodong/weixin_match_upload/html5upload'),
            'compare' => F::URL('huodong_m:/huodong/weixin_match_who/compare'),
        ];

        return $uri;
    }

    /**
     * 获取分享内容
     * @return [type] [description]
     */
    function getShareContent() {
        $action = \Request::getActionName();

        $shareData = [];
        $shareData['img'] = 'http://file.gaofen.com/weike.jpg';
        switch($action) {
            default:
                $shareData['title'] = '谁和我最Match?';
                $shareData['content'] = '谁和我最Match?';
            break;
        }

        return $shareData;
    }

}
<?php

namespace Modules\Huodong\Xunbao;

use Modules\Huodong\Xunbao\BaseController;
use Modules\Huodong\BaseTask\ActionTraits\ImageUpload;
use Modules\Huodong\BaseTask\ActionTraits\MarkFav;
use F;
use CFG;
use Cache;

abstract class BaseTaskController extends BaseController
{
    use ImageUpload;
    use MarkFav;

    abstract protected function myPrefix();

    protected function backToHome() {
        F::redirect($this->xbPrefix.'/index/');
        exit;
    }

    protected function getLinks($need) {
        $links = [];
        foreach ($need as $name => $args) {
            $links[$name] = F::URL($this->myPrefix()."/$name/", $args);
        }
        return $links;
    }

    protected function getExtData() {
        return json_encode([
            'text' => V('p:text', ''),
        ]);
    }

    public function indexAction() {
        $this->requireLogin();
        if (!$this->prerequisite()) {
            $this->backToHome();
        }

        $uid = $this->userObj->getUserId();
        $this->materialObj->setByUid($uid);
        $mid = $this->materialObj->id;

        $key = $this->getPrjCode().':count:'.$this->getType();
        $count = CACHE::get($key);
        if (is_null($count)) {
            $items = F::api('/Huodong/Bestvoice/Material/listByCond', [
                'type' => $this->getType(),
            ]);
            $count = $items['total'];
            CACHE::setex($key, 60, $count);
        }

        $links = [];
        if ($mid) {
            $links['item'] = ['m' => $mid];
        } else {
            $links['upload'] = [];
        }

        $this->getView()->assign(compact(['mid', 'count']));
        $this->getView()->assign('links', $this->getLinks($links));
    }

    public function index2Action() {
        $this->requireLogin();
    }

    /**
     * Get current task status
     */
    public function statusAction() {
        $this->requireLogin(true);

        $config = CFG::huodong('xb2016');
        $catid = $config['catid'];
        $appid = CFG::auth('cat_list', $catid, 'app_id');
        $mch_id = CFG::auth('weixin_cfg', $appid, 'mch_id');

        $url = F::URL($this->aPrefix.'/index2/');
        $jsConfig = F::api("weixin:/account/{$appid}/jssdk/getConfig/", [
            'url' => $url,
        ]);
        if (isset($jsConfig['content'])) {
            $jsConfig = $jsConfig['content'];
        } else {
            $jsConfig = [];
        }
        
        F::ajaxRst([
            'links' => [
                'host' => $_SERVER['HTTP_HOST'],
                'home' => F::URL($this->xbPrefix.'/index/'),
                'login' => F::URL("{$this->xbPrefix}/login/"),
                'footer1' => F::URL('huodong_m:/huodong/weixin_xunbao_xunbao/index/'), 
                'footer2' => F::URL('huodong_m:/huodong/weixin_xunbao_taska/index2/'), 
                'footer3' => F::URL('huodong_m:/huodong/weixin_xunbao_xunbao/portfolio/'), 
                'portfolio' => F::URL($this->xbPrefix.'/taskportfolio/'),
                'host' => $_SERVER['HTTP_HOST'],
            ],
            'config' => $jsConfig,
        ]);
    }

    /**
     * Get Current user's material 
     */
    public function meAction() {
        $this->requireLogin(true);

        $uid = $this->userObj->getUserId();
        $this->materialObj->setByUid($uid);
        $m = $this->materialObj;

        if (!$m->id) {
            F::ajaxRst([
                'id' => null,
                'user' => [
                    'headimgurl' => $this->userObj->headimgurl,
                    'nickname' => $this->userObj->nickname,
                ],
            ]);
        }

        F::ajaxRst([
            'id' => $m->id,
            'ext_data' => $m->ext_data,
            'fav_num' => $m->fav_num,
            'fav_num_total' => $m->fav_num_total,
            'path' => $m->getImageLink(),
            'updated_at' => $m->updated_at,
            'user' => [
                'headimgurl' => $m->user->headimgurl,
                'nickname' => $m->user->nickname,
            ],
        ]);
    }

    /**
     * Get all items in task
     */
    public function getitemsAction() {
        $this->requireLogin(true);

        $page = max(V('g:page', 1), 1);
        $list = F::api('/Huodong/Bestvoice/Material/listByCond', [
            'type' => $this->getType(),
            'page' => $page,
            'limit' => 10
        ]);

        $items = [];
        foreach ($list['list'] as $i) {
            array_push($items, [
                'id' => $i->id,
                'ext_data' => $i->ext_data,
                'fav_num' => $i->fav_num,
                'fav_num_total' => $i->fav_num_total,
                'path' => $i->present()->getImageLink(),
                'updated_at' => $i->updated_at,
                'user' => [
                    'headimgurl' => $i->user->headimgurl,
                    'nickname' => $i->user->nickname,
                ],
            ]);
        }

        F::ajaxRst([
            'count' => $list['total'],
            'items' => $items, 
        ]);
    }

    /** 
     * Get rank list
     */
    public function rankAction() {
        $this->requireLogin(true);

        $user = $this->getUser();
        $material = $this->getMaterial();
        $material->setByUid($user->id);

        if (!$material) {
            F::redirect(F::URL($this->myPrefix().'/index/'));
            exit;
        }

        $key = $this->getPrjCode().':rank:'.$this->getType().':'.$user->id;
        $rank = CACHE::get($key);
        if (!$rank) {
            $weekly = F::api('/Huodong/Bestvoice/Material/listByCond', [
                'type' => $this->getType(),
                'limit' => 10,
                'sort' => 'fav_num',
            ]);
            $final = F::api('/Huodong/Bestvoice/Material/listByCond', [
                'type' => $this->getType(),
                'limit' => 10,
                'sort' => 'fav_num_total',
            ]);

            $weeklyRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
                'id' => $material->id,
                'type' => $this->getType(),
                'field' => 'fav_num',
            ]);
            $finalRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
                'id' => $material->id,
                'type' => $this->getType(),
                'field' => 'fav_num_total',
            ]);

            $weeklyItems = [];
            foreach ($weekly['list'] as $i) {
                array_push($weeklyItems, [
                    'id' => $i->id,
                    'ext_data' => $i->ext_data,
                    'fav_num' => $i->fav_num,
                    'fav_num_total' => $i->fav_num_total,
                    'path' => $i->present()->getImageLink(),
                    'updated_at' => $i->updated_at,
                    'user' => [
                        'headimgurl' => $i->user->headimgurl,
                        'nickname' => $i->user->nickname,
                    ],
                ]);
            }

            $finalItems = [];
            foreach ($final['list'] as $i) {
                array_push($finalItems, [
                    'id' => $i->id,
                    'ext_data' => $i->ext_data,
                    'fav_num' => $i->fav_num,
                    'fav_num_total' => $i->fav_num_total,
                    'path' => $i->present()->getImageLink(),
                    'updated_at' => $i->updated_at,
                    'user' => [
                        'headimgurl' => $i->user->headimgurl,
                        'nickname' => $i->user->nickname,
                    ],
                ]);
            }

            $rank = json_encode([
                'weekly' => $weeklyItems,
                'final' => $finalItems,
                'weeklyRank' => $weeklyRank,
                'finalRank' => $finalRank,
            ]);
            CACHE::setex($key, 60, $rank);
        }

        $rank = json_decode($rank);

        F::ajaxRst([
            'weekly' => $rank->weekly,
            'final' => $rank->final,
            'weeklyRank' => $rank->weeklyRank,
            'finalRank' => $rank->finalRank,
        ]);
    }
}

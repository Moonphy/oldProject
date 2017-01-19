<?php 

use Modules\Huodong\BaseTask\BaseController as Controller;
use Modules\Huodong\BaseTask\ActionTraits\Login;
use Modules\Huodong\BaseTask\ActionTraits\ImageUpload;
use Modules\Huodong\BaseTask\ActionTraits\MarkFav;
use Modules\Huodong\Xunbao\User;
use Modules\Huodong\Xunbao\Material;


/**
 * Assemblage - pid - 1: invite count; 2: comment; 3: card
 * Share Type - friend | moment |
 *       home  |   8   |   9    |
 *      school |   1   |   2    |
 *       build |   6   |   7    |
 *       share |   4   |   5    |
 */
class Weixin_Zhongkao_IndexController extends Controller {
    use Login;
    use ImageUpload {
        uploadAction as upload;
    }
    use MarkFav {
        markfavAction as markfav;
    }

    protected $prefix = 'huodong_m:/huodong/weixin_zhongkao_index';
    protected $fn;
    protected $config;

    public function init() {
        parent::init();
        $this->config = CFG::huodong('zhongkao');
        $type = $this->getType();
        $this->fn = DATA_PATH."/huodong/voice/{$type}/school.txt";
    }

    /***
     * Configuration
     */

    protected function isEnd() {
        // todo temporary until it is final
        if (strtotime('2016-06-20') < time()) {
            return true;
        }
        return false;
    }

    protected function getPrjCode() {
        return 'ZKAO16';
    }

    protected function getAppid() {
        $catid = $this->config['catid'];
        $appid = CFG::auth('cat_list', $catid, 'app_id');
        return $appid;
    }

    protected function getCatid() {
        return $this->config['catid'];
    }

    protected function getType() {
        return $this->config['type'];
    }

    protected function prerequisite() {
        return true;
    }

    protected function getUser() {
        return new User();
    }

    protected function getMaterial() {
        return new Material($this->getType());
    }

    protected function getLoginUrl() {
        return F::URL("{$this->prefix}/login/");
    }

    protected function getLoginCallbackUrl()
    {
        return F::URL("{$this->prefix}/loginCallback/");
    }

    protected function getExtData() {
        return json_encode([
            'text' => V('p:text', ''),
        ]);
    }

    protected function getLeftOver() {
        return strtotime('2016-06-20') - time();
    }

    /***
     * Page and Api
     */

    public function indexAction() {
        $this->requireLogin();

        $this->getView()->assign('static', [
            'domain' => $_SERVER['SERVER_NAME'],
            'links' => [
                'home' => F::URL("{$this->prefix}/index/"),
                'login' => F::URL("{$this->prefix}/login/"),
                'share' => F::URL("{$this->prefix}/share/"),
            ],
            'api' => [
                'home' => F::URL("{$this->prefix}/home/"),
                'school' => F::URL("{$this->prefix}/school/"),
                'getschool' => F::URL("{$this->prefix}/getschool/"),
                'jsConfig' => F::URL("{$this->prefix}/jsConfig/"),
                'imageUpload' => F::URL("{$this->prefix}/upload/"),
                'markfav' => F::URL("{$this->prefix}/markfav/"),
                'comment' => F::URL("{$this->prefix}/comment/"),
                'card' => F::URL("{$this->prefix}/card/"),
                'getcard' => F::URL("{$this->prefix}/getcard/"),
                'savecard' => F::URL("{$this->prefix}/savecard/"),
            ],
        ]);
    }

    public function shareAction() {
        $this->requireLogin();

        $uid = V('g:uid', null);
        $mid = V('g:id', null);
        $aid = V('g:aid', null);
        $type = V('g:type', 3);
        $prj = $this->getPrjCode();

        if (!isset($_SESSION)) {
            session_start();
        }
        if (!isset($_SESSION[$prj])) {
            $_SESSION[$prj] = [];
        }
        
        if ($uid) {
            if ($mid) {
                $_SESSION[$prj]['inviter'] = [
                    'uid' => $uid,
                    'mid' => $mid,
                ];
            } else if ($aid) {
                $card = $this->getCard($aid, true);
                if ($card) {
                    $_SESSION[$prj]['inviter'] = [
                        'uid' => $uid,
                        'mid' => $card['mid'],
                    ];
                }
            }

            $iopenid = $this->getOpenid($uid);
            $openid = $this->getOpenid($this->userObj->id);

            F::api("weixin:user/open/{$iopenid}/make-friend", [
                'openid' => $openid,
                'src' => 4,
                'type' => $type,
            ], [], 'POST');
        }

        if (isset($_SESSION[$prj]['inviter']['mid'])) {
            $mid = $_SESSION[$prj]['inviter']['mid'];
        }

        if ($aid) {
            F::redirect(F::URL("{$this->prefix}/index/#share&aid={$aid}"));
        }
        if ($type == 6 || $type == 7) {
            F::redirect(F::URL("{$this->prefix}/index/#build"));
        }
        if ($mid && $type == 1 || $type == 2) {
            F::redirect(F::URL("{$this->prefix}/index/#detail&id={$mid}"));
        }
        F::redirect(F::URL("{$this->prefix}/index/"));
    }

    public function homeAction() {
        $this->requireLogin(true);

        $recentList = $this->getRecentVotedSchool();
        $rank = $this->getRankList();
        $school = $this->getSchoolName();
        $winner = $this->getWinner();
        $voter = $this->getRecentVoterHome();
        $time = $this->getLeftOver();
        $notify = $this->getNotify();

        $rst = [
            'rank' => [
                'recent' => $recentList,
                'today' => $rank->weekly,
                'total' => $rank->final,
            ],
            'school' => $school,
            'winner' => $winner,
            'recent' => $voter,
            'time' => $time,
        ];

        if (!empty($notify)) {
            $rst['notify'] = $notify;
        }

        F::ajaxRst($rst);
    }

    public function schoolAction() {
        $this->requireLogin(true);

        $mid = V('g:m', null);
        $school = $this->getSchool($mid);
        $rank = $this->getRank($mid);
        $vote = $this->getTotalVote($mid);
        $top = $this->getTopInviter($mid);
        $comment = $this->getComment($mid);
        $recent = $this->getRecentVoter($mid);
        $winner = $this->getWinner();

        F::ajaxRst([
            'school' => $school,
            'rank' => [
                'vote' => $vote,
                'today' => $rank->weeklyRank?:0,
                'total' => $rank->finalRank?:0,
            ],
            'top' => $top,
            'comment' => $comment,
            'recent' => $recent,
            'winner' => $winner,
        ]);
    }

    public function getschoolAction() {
        $name = V('g:name', '');
        if (empty($name)) {
            F::ajaxRst([], 6003, '学校名不合法。');
        }
        $name = urldecode($name);
		$mid = $this->schoolLookup($name);

        if ($mid) {
            F::ajaxRst(['id' => $mid]);
        }

        F::ajaxRst([], 6004, '学校名不存在。');
    }

    public function uploadAction() {
        $name = V('p:text', '');

        if ($this->isEnd()) {
            F::ajaxRst([], 6008, '活动已结束');
        }

        if (sizeof($name) > 20) {
            F::ajaxRst([], 6006, '学校名限制在20字内。');
        }
        $schoolList = $this->getSchoolName();

        if (in_array($name, $schoolList)) {
            F::ajaxRst([], 6005, '学校名已存在。');
        }

        $cache = $this->getCache();
        $prj = $this->getPrjCode();
        $type = $this->getType();

        $this->upload(function($mid) use ($name, $cache, $prj, $type) {
            $key = $prj.':school';
            $schoolFile = file_get_contents($this->fn);
            $school = json_decode($schoolFile, true);
            $school[$name] = $mid;
            $cache->set($key, json_encode($school));
            $fp = fopen($this->fn, 'w');
            fwrite($fp, json_encode($school));
            fclose($fp);
        });
    }
 
    public function jsConfigAction() {
        $link = V('g:link', '');
        $jsConfig = $this->getJsConfig($link);
        F::ajaxRst([
            'config' => $jsConfig,
        ]);
    }

    public function commentAction() {
        $this->requireLogin(true);
        $mid = V('g:m', null);
        $time = V('g:t', 0);
        $text = V('g:text', '');

        if ($this->isEnd()) {
            F::ajaxRst([], 6031, '活动已结束');
        }

        $this->getSchool($mid);
        if (empty($text)) {
            F::ajaxRst([], 100001, '评论为空。');
        }
        if (sizeof($text) > 20) {
            F::ajaxRst([], 100001, '评论限制在20字内。');
        }
        if (intval($time) < 0) {
            F::ajaxRst([], 100001, '时间不合法。');
        } 

        $uid = $this->userObj->getUserId();
        $prj = $this->getPrjCode();
        $type = $this->getType();
        $cache = $this->getCache();

        $key = "{$prj}:acomment:{$uid}";
        if ('1' == CACHE::get($key)) {
            F::ajaxRst([], 100001, '已处理，请稍后。');
        }
        $cache->setex($key, 10, '1');

        $invite = F::api('Huodong/Bestvoice/Assemblage/create', [
            'uid' => $uid,
            'pid' => 2,
            'cond1' => $mid,
            'type' => $type,
            'assemblage' => [
                'time' => intval($time),
                'text' => $text,
            ],
        ]);

        if ($invite) {
            F::ajaxRst([
                'time' => $time,
                'text' => $text,
            ]);
        }

        F::ajaxRst([], 100001, '留言失败。');
    }

    public function markfavAction() {
        $this->requireLogin(true);

        $prj = $this->getPrjCode();
        $type = $this->getType();
        $cache = $this->getCache();

        $inviterMid = null;
        $inviterUid = null;
        if (isset($_SESSION[$prj]['inviter'])) {
            $inviterUid = $_SESSION[$prj]['inviter']['uid'];
            $inviterMid = $_SESSION[$prj]['inviter']['mid'];
        }

        $this->markfav(function ($uid, $mid) use ($prj, $type, $inviterUid, $inviterMid, $cache) {

            $user = F::api('Huodong/Bestvoice/User/get', ['id' => $uid]);
            $material = F::api('Huodong/Bestvoice/Material/get', ['id' => $mid]);

            $key1 = "{$prj}:recentschool";
            $cache->lrem($key1, 1, $mid);
            $len = $cache->lpush($key1, $mid);
            if ($len > 10) {
                $cache->rpop($key1);
            }

            $key2 = "{$prj}:recent2:{$mid}";
            $len = $cache->lpush($key2, json_encode([
                'n' => $user->nickname,
                'h' => $user->headimgurl,
                'i' => $user->id,
            ]));
            if ($len > 20) {
                $cache->rpop($key2);
            }

            $key3 = "{$prj}:recentvote";
            $len = $cache->lpush($key3, json_encode([
                'n' => $user->nickname,
                'm' => $material->ext_data['text'],
                't' => time(),
            ]));
            if ($len > 10) {
                $cache->rpop($key3);
            }

            if ($inviterMid != $mid || $inviterUid == $uid) {
                return;
            }

            $items = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
                'uid' => $inviterUid,
                'pid' => 1,
                'cond1' => $mid,
                'type' => $type,
            ]);
            
            if (sizeof($items['list']) == 0) {
                $invite = F::api('Huodong/Bestvoice/Assemblage/create', [
                    'uid' => $inviterUid,
                    'pid' => 1,
                    'cond1' => $mid,
                    'type' => $type,
                    'assemblage' => [
                        'count' => 1,
                    ],
                ]);

            } else {
                F::api('Huodong/Bestvoice/Assemblage/update', [
                    'id' => $items['list'][0]->id,
                    'assemblage' => [
                        'count' => $items['list'][0]->assemblage['count'] + 1
                    ]
                ]);
            }
        });
    }

    public function cardAction() {
        $this->requireLogin(true);

        $mid = V('g:m', null);
        $material = $this->getSchool($mid, true);
        $school = $this->getSchoolName();
        $user = $this->userObj;
        
        $rst = [
            'schools' => $school,
            'user' => [
                'u' => $user->id,
                'headimgurl' => $user->headimgurl,
                'nickname' => $user->nickname,
            ],
        ];

        if ($material) {
            $rst['material'] = $material;
        }

        F::ajaxRst($rst);
    }

    public function getcardAction() {
        $this->requireLogin(true);
		
        $aid = V('g:aid', null);

        $card = $this->getCard($aid);
        $recent = $this->getRecentVoter($card['mid']);

        $uid = $card['uid'];
        $recent = array_filter($recent, function($i) use ($uid) {
            return $uid != $i['u'];
        });
		
        F::ajaxRst([
			'card' => $card,
			'recent' => $recent,
		]);
    }

    public function savecardAction() {
        $this->requireLogin(true);
		$user = $this->userObj;
		$name = V('g:name', '');
		$nickname = V('g:nickname', $user->nickname);
		$content = V('g:content', '');

        if ($this->isEnd()) {
            F::ajaxRst([], 6021, '活动已结束');
        }
		
		$mid = $this->schoolLookup($name);
        if (!$mid) {
			F::ajaxRst([], 6007, '学校名不存在。');
        }
        if (iconv_strlen($content, 'UTF-8') > 80) {
			F::ajaxRst([], 6027, '表白内容不能多于80字。');
        }
        $type = $this->getType();

        $items = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'pid' => 3,
            'uid' => $user->id,
            'cond1' => $mid,
            'type' => $type,
        ]); 

        if (sizeof($items['list']) == 0) {
            $res = F::api('Huodong/Bestvoice/Assemblage/create', [
                'uid' => $user->id,
                'pid' => 3,
                'cond1' => $mid,
                'type' => $type,
                'assemblage' => [
                    'name' => $name,
                    'nickname' => $nickname,
                    'headimgurl' => $user->headimgurl,
                    'content' => $content,
                ],
            ]);

        } else {
            $res = F::api('Huodong/Bestvoice/Assemblage/update', [
                'id' => $items['list'][0]->id,
                'assemblage' => [
                    'name' => $name,
                    'nickname' => $nickname,
                    'headimgurl' => $user->headimgurl,
                    'content' => $content,
                ]
            ]);
        }
        
        F::ajaxRst([
            'aid' => $res->id,
        ]);
    }

    /***
     * Functionality
     */
    protected function getJsConfig($link) {
        $url = $_SERVER['HTTP_REFERER'];
        if (!empty($link)) {
            //$url = preg_replace('/#.*$/', '', $link);
        }
        $appid = $this->getAppid();
        $jsConfig = F::api("weixin:/account/{$appid}/jssdk/getConfig/", [
            'url' => $url,
        ]);
        if (isset($jsConfig['content'])) {
            $jsConfig = $jsConfig['content'];
        } else {
            $jsConfig = [];
        }
        return $jsConfig;
    }
	
	protected function schoolLookup($name) {
		$type = $this->getType();
        $cache = $this->getCache();
        $key = $this->getPrjCode().':school';
        
        $mid = null;
        $i = 0;
        while (++$i) {
            $schoolCache = $cache->get($key);
            if (!$schoolCache) {
                $schoolFile = file_get_contents($this->fn);
                if (!$schoolFile) {
                    $schoolFile = [];
                    $fp = fopen($this->fn, 'w');
                    fwrite($fp, json_encode($schoolFile));
                    fclose($fp);
                    continue;
                } else {
                    $cache->set($key, $schoolFile);
                    continue;
                }
            } else {
                $school = json_decode($schoolCache, true);
                if (isset($school[$name])) {
                    $mid = $school[$name];
                    break;
                } else {
                    $schoolList = $this->getSchoolName();
                    if (in_array($name, $schoolList)) {
                        $mid = $this->createSchool($name);
                        $schoolCache = $cache->get($key);
                        $schoolCache = json_decode($schoolCache, true);
                        $schoolCache[$name] = $mid;
                        $cache->set($key, json_encode($schoolCache));
                        $fp = fopen($this->fn, 'w');
                        fwrite($fp, json_encode($schoolCache));
                        fclose($fp);
                        break;
                    } else {
						return;
                    }
                }
            }
            if ($i > 10) {
                break;
            }
        }
		
		return $mid;
	}

    protected function createSchool($name) {
        $type = $this->getType();
        $schoolList = $this->getSchoolList();
        if (empty($schoolList[$name])) {
            $path = "/huodong/voice/{$type}/school/{$name}.png";
        } else {
            $path = "/huodong/voice/{$type}/{$schoolList[$name]}";
        }
        $uid = $this->userObj->id; // the first user

        $saveData = [
            'uid'   => 0,
            'path'  => $path,
            'type'  => $type,
            'mil_sec'   => 0,
            'ext_data' => json_encode([
                'text' => $name,
            ]),
        ];

        $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
        $mid = $rs->id;

        return $mid;
    }

    protected function getRecentVotedSchool() {
        $cache = $this->getCache();
        $prj = $this->getPrjCode();
        $type = $this->getType();

        $subkey = $prj.':recentschool';
        $schoolIds = $cache->lrange($subkey, 0, 10);

        if ($schoolIds) {
            $items = F::api('Huodong/Bestvoice/Material/getBatch', [
                'ids' => $schoolIds,
                'type' => $type,
            ]);
                
            $rvote = [];
            foreach ($items as $i) {
                array_push($rvote, [
                    'id' => $i->id,
                    'ext_data' => $i->ext_data,
                    'fav_num' => $i->fav_num,
                    'fav_num_total' => $i->fav_num_total,
                    'path' => $i->present()->getImageLink(),
                    'updated_at' => $i->updated_at,
                ]);
            }

        } else {
            return [];
        }

        return $rvote;
    }

    protected function getRecentVoterHome() {
        $cache = $this->getCache();
        $prj = $this->getPrjCode();
        $type = $this->getType();

        $subkey = "{$prj}:recentvote";
        $user = $cache->lrange($subkey, 0, 10);

        $voter = [];
        foreach ($user as $i) {
            $i = json_decode($i);
            array_push($voter, [
                'school' => $i->m,
                'nickname' => $i->n,
                'time' => ceil((time() - $i->t)/60),
            ]);
        }

        return $voter;
    }

    protected function getRecentVoter($mid) {
        $cache = $this->getCache();
        $prj = $this->getPrjCode();
        $type = $this->getType();

        $subkey = "{$prj}:recent2:{$mid}";
        $user = $cache->lrange($subkey, 0, 20);

        $voter = [];
        foreach ($user as $i) {
            $i = json_decode($i);
            array_push($voter, [
                'u' => $i->i,
                'headimgurl' => $i->h,
                'nickname' => $i->n,
            ]);
        }

        return $voter;
    }

    protected function getSchool($mid, $returnBool = false) {
        if (!is_numeric($mid)) {
            if ($returnBool) {
                return false;
            } else {
                F::ajaxRst([], 6001, '参数不合法');
            }
        }

        $material = $this->getMaterial();
        $material->setByMid($mid);     

        if (is_null($material->id)) {
            if ($returnBool) {
                return false;
            } else {
                F::ajaxRst([], 6002, '学校不存在');
            }
        }

        return [
            'id' => $material->id,
            'ext_data' => $material->ext_data,
            'fav_num' => $material->fav_num,
            'fav_num_total' => $material->fav_num_total,
            'path' => $material->getImageLink(),
            'updated_at' => $material->updated_at,
        ];
    }

    protected function getTopInviter($mid) {
        $cache = $this->getCache();
        $key = $this->getPrjCode().':topinviter:'.$mid;
        $topUser = $cache->get($key);
 
        if (!$topUser || empty($topUser)) {
            $items = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
                'pid' => 1,
                'cond1' => $mid,
                'type' => $this->getType(),
                'limit' => 99,
            ]); 
                
            usort($items['list'], function($a, $b) {
                return ($a->assemblage['count'] > $b->assemblage['count'])? -1 :1;
            });

            $top = array_slice($items['list'], 0, 3);

            $topUser = [];
            foreach($top as $u) {
                array_push($topUser, [
                    'vote' => $u->assemblage['count'],
                    'user' => [
                        'u' => $u->user->id,
                        'headimgurl' => $u->user->headimgurl,
                        'nickname' => $u->user->nickname,
                    ]
                ]);
            }

            $topUser = json_encode($topUser);
            $cache->setex($key, 10, $topUser);
        }

        return json_decode($topUser);
    }

    protected function getComment($mid) {
        $cache = $this->getCache();
        $key = $this->getPrjCode().':comment:'.$mid;
        $comment = $cache->get($key);
 
        if (!$comment) {
            $items = f::api('huodong/bestvoice/assemblage/listbycond', [
                'pid' => 2,
                'cond1' => $mid,
                'type' => $this->getType(),
                'limit' => 50,
            ]); 
            usort($items['list'], function($a, $b) {
                return ($b->assemblage['time'] < $a->assemblage['time'])? -1 :1;
            });

            $comment = [];
            foreach ($items['list'] as $i) {
                array_push($comment, [
                    'time' => $i->assemblage['time'],
                    'text' => $i->assemblage['text'],
                ]);
            }
            $comment = json_encode($comment);
            $cache->setex($key, 10, $comment);
        }

        return json_decode($comment);
    }

    protected function getTotalVote($mid) {
        $rs = F::api('/Huodong/Bestvoice/Fav/listByCond', [
            'mid' => $mid,
            'type' => $this->getType(),
            'limit' => 1,
        ]);

        return $rs['total'];
    }

    protected function getRankList() {
        $cache = $this->getCache();
        $key = $this->getPrjCode().':ranklist';
        $rank = $cache->get($key);
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

            $weeklyItems = [];
            foreach ($weekly['list'] as $i) {
                if ($i->fav_num == 0) {
                    break;
                }
                array_push($weeklyItems, [
                    'id' => $i->id,
                    'ext_data' => $i->ext_data,
                    'fav_num' => $i->fav_num,
                    'fav_num_total' => $i->fav_num_total,
                    'path' => $i->present()->getImageLink(),
                    'updated_at' => $i->updated_at,
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
                ]);
            }

            $rank = json_encode([
                'weekly' => $weeklyItems,
                'final' => $finalItems,
            ]);
            $cache->setex($key, 10, $rank);
        }

        $rank = json_decode($rank);
        return $rank;
    }

    protected function getRank($mid) {
        $cache = $this->getCache();
        $key = $this->getPrjCode().':rank:'.$mid;
        $rank = $cache->get($key);
        $type = $this->getType();

        if (!$rank) {
            $weeklyRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
                'id' => $mid,
                'type' => $type,
                'field' => 'fav_num',
            ]);
            $finalRank = F::api('/Huodong/Bestvoice/Material/getRankById', [
                'id' => $mid,
                'type' => $type,
                'field' => 'fav_num_total',
            ]);

            $rank = json_encode([
                'weeklyRank' => $weeklyRank,
                'finalRank' => $finalRank,
            ]);
            $cache->setex($key, 10, $rank);
        }

        $rank = json_decode($rank);
        return $rank;
    }

    protected function getWinner() {
        $cache = $this->getCache();
        $key = $this->getPrjCode().':winner3';
        $winner = $cache->get($key);

        if (!$winner || empty($winner)) {
            if (defined('ZKAO16_WINNER')) {
                $winner = [];
                $data = json_decode(ZKAO16_WINNER, true);

                $tmpl = [
                    'champ' => '<li>6月%s日校园冠军：%s</li>',
                    'lucky' => '<li>每日幸运奖：%s</li>',
                ];

                $tmpl2 = '<div class="ui-avatar"><img src="%s" alt=""></div><span class="font-orange">%s</span>';
                $date = '';
                $i = 0;

                $winner = [];
                foreach ($data as $key => $item) {
                    $i++;
                    if ($i > 1) {
                        //break;
                    }
                    $champ = [];
                    $lucky = [];

                    $date = $key;
                    if (isset($item['champ'])) {
                        $school = $this->getSchool($item['champ'][1]);
                        array_push($champ, sprintf($tmpl2, $school['path'], $school['ext_data']['text']));
                        array_push($winner, sprintf($tmpl['champ'], $date, implode($champ, ', ')));
                    }
                    if (isset($item['lucky'])) {
                        $user = F::api('/Huodong/Bestvoice/User/get', ['id' => $item['lucky']]);
                        array_push($lucky, sprintf($tmpl2, $user->headimgurl, $user->nickname));
                        array_push($winner, sprintf($tmpl['lucky'], implode($lucky, ', ')));
                    }
                }

                if (!empty($winner)) {
                    $winner = json_encode($winner);
                    $cache->setex($key, 3600, $winner);
                }
            } else {
                $winner = json_encode([]);
            }
        }
        
        return json_decode($winner, true);
    }

    protected function getNotify() {
        $cache = $this->getCache();
        $prj = $this->getPrjCode();
        $winnerKey = "{$prj}:winnernotify4";
        $notifyKey = "{$prj}:notifylog";
        $winner = $cache->get($winnerKey);
        $uid = $this->userObj->getUserId();
        
        if (!$winner) {
            if (!defined('ZKAO16_WINNER')) {
                return [];
            }
            $data = json_decode(ZKAO16_WINNER, true);
/*
            $data = [
                '13' => [
                    'champ' => [8840199, 23009],
                    'lucky' => 8839500,
                ],
                '12' => [
                    'champ' => [8839503, 23014],
                    'lucky' => 8839493,
                ],
            ];
*/
            $winner = [];
            foreach ($data as $key => $val) {
                if (isset($val['champ'])) {
                    $winner[$val['champ'][0]] = [$key, 1, $val['champ'][0]]; // date, type, user id
                }
                if (isset($val['lucky'])) {
                    $winner[$val['lucky']] = [$key, 2, $val['lucky']];
                }

                if ($key == 'first') {
                    $winner[$val] = [20, 3, $val];
                }
                if ($key == 'second') {
                    $winner[$val] = [20, 4, $val];
                }
                if ($key == 'third') {
                    $winner[$val] = [20, 5, $val];
                }
            }
            $winner = json_encode($winner);
            $cache->setex($winnerKey, 3600, $winner);
        }
        $winner = json_decode($winner, true);

        if (!array_key_exists($uid, $winner)) {
            return [];
        }

        $notifylog = $cache->get($notifyKey);
        if ($notifylog) {
            $notifylog = json_decode($notifylog, true);
        } else {
            $notifylog = [];
        }

        $entry = $winner[$uid];
        if (isset($notifylog[implode($entry, '_')]) && $notifylog[implode($entry, '_')] == 1) {
            return [];
        }
        
        $notifylog[implode($entry, '_')] = 1;
        $notifylog = json_encode($notifylog);
        $cache->set($notifyKey, $notifylog);        

        $type = '';
        switch ($entry[1]) {
            case 1: $type = 'champ';break;
            case 2: $type = 'lucky';break;
            case 3: $type = 'first';break;
            case 4: $type = 'second';break;
            case 5: $type = 'third';break;
        }

        return [
            'type' => $type,
            'nickname' => $this->userObj->nickname,
            'headimgurl' => $this->userObj->headimgurl,
        ];
    }

    protected function getCard($aid, $returnBool = false) {
        if (!is_numeric($aid)) {
            if ($returnBool) {
                return false;
            } else {
                F::ajaxRst([], 6011, '参数不合法');
            }
        }

        $item = f::api('huodong/bestvoice/assemblage/get', ['id' => $aid]);

        if (!$item || $item->type != $this->getType()) {
            if ($returnBool) {
                return false;
            } else {
                F::ajaxRst([], 6012, '表白卡不存在');
            }
        }

        return [
            'id' => $item->id,
            'uid' => $item->uid,
            'nickname' => $item->assemblage['nickname'],
            'headimgurl' => $item->assemblage['headimgurl'],
            'mid' => $item->cond1,
            'name' => $item->assemblage['name'],
            'content' => $item->assemblage['content'],
            'updated_at' => $item->updated_at,
        ];

    }

    protected function getHomeQr() {
        $qrkey = $this->getPrjCode().':qrhome';
        $cache = $this->getCache();
        $qrcode = $redis->get($qrkey);
        if (!$qrcode) {
            $data = [
                'key' => ['callback', 'event'],
                'val' => [
                    json_encode(['url' => F::Url("{$this->prefix}/home/")]),
                    $this->getPrjCode(),
                ],
                'expire_seconds' => 3600*24*7,
            ];
            $appid = $this->getAppid();
            $query = http_build_query($data);
            $query = preg_replace('/%5B[0-9]+%5D/simU', '[]', $query);
            $rs = F::api("weixin:account/{$appid}/qr/create?{$query}", [], [], 'POST');
            if ($rs && $rs['return_code'] == 'SUCCESS') {
                $qrcode = $rs['content']['qrcode_image'];
                $cache->setex($qrkey, 24*3600*5, $qrcode);
            }
            $qrcode = null;
        }
        return $qrcode;
    }

    protected function getSchoolQr($mid, $uid) {
        $qrkey = $this->getPrjCode().':qr:'.$uid;
        $cache = $this->getCache();
        $qrcode = $redis->get($qrkey);
        if (!$qrcode) {
            $data = [
                'key' => ['callback', 'event'],
                'val' => [
                    json_encode(['url' => F::Url("{$this->prefix}/home/")]),
                    $this->getPrjCode(),
                ],
                'expire_seconds' => 3600*24*7,
            ];
            $appid = $this->getAppid();
            $query = http_build_query($data);
            $query = preg_replace('/%5B[0-9]+%5D/simU', '[]', $query);
            $rs = F::api("weixin:account/{$appid}/qr/create?{$query}", [], [], 'POST');
            if ($rs && $rs['return_code'] == 'SUCCESS') {
                $qrcode = $rs['content']['qrcode_image'];
                $cache->setex($qrkey, 24*3600*5, $qrcode);
            }
            $qrcode = null;
        }
        return $qrcode;
    }

    protected function getOpenid($uid) {
        $catid = $this->getCatid();

        $items = F::api('auth:Auth/WeixinToken/listByCond', [
            'uid' => $uid,
            'catid' => $catid,
        ]);

        $len = sizeof($items['list']);
        if ($len > 0) {
            $user = $items['list'][0];
            return $user['openid'];
        }
        return null;
    }

    public function testAction() {
        $s = $this->getSchoolList();
        $type = $this->getType();

        foreach ($s as $k => $v) {
            if (!file_exists(DATA_PATH."/huodong/voice/{$type}/school/{$k}.png")) {
                var_dump($k);
            }
        }
var_dump(sizeof($s));
        exit;
    }

    protected function getSchoolName() {
        $schoolList = $this->getSchoolList();
        $schoolList = array_keys($schoolList);

        $schoolFile = file_get_contents($this->fn);
        $schoolFile = json_decode($schoolFile, true);
        $schoolFile = array_keys($schoolFile);
        
        $school = array_merge($schoolList, $schoolFile);
        $school = array_unique($school);
        $school = array_values($school);

        return $school;
    }

    protected function getSchoolList() {
        return [
            '广州市第三中学' => '',
            '广州市第七中学' => '',
            '广州市第十中学' => '',
            '广州市第十三中学' => '',
            '广州市第十六中学' => '',
            '广州市第十七中学' => '',
            '广州市第二十一中学' => '',
            '广州市越秀外国语学校' => '',
            '广州市第三十七中学' => '',
            '广州市第四十中学' => '',
            '广州市第八十二中学' => '',
            '广州市培正中学' => '',
            '广州市育才中学' => '',
            '广州市恒福中学' => '',
            '广州市知用中学' => '',
            '广州市华侨外国语学校' => '',
            '广州市八一实验学校' => '',
            '广州市东环中学' => '',
            '广州市长堤真光中学' => '',
            '广州市五羊中学' => '',
            '广州市豪贤中学' => '',
            '广州市铁二中学' => '',
            '广州市矿泉中学' => '',
            '广州市第二中学' => '',
            '广东实验中学' => '',
            '广州大学附属中学' => '',
            '广州市铁一中学' => '',
            '广东华侨中学' => '',
            '广州市育才实验学校' => '',
            '广州市越秀区二中应元学校' => '',
            '广州市执信中学' => '',
            '广州市越秀区汇泉中学' => '',
            '广州市越秀区明德实验学校' => '',
            '广州市第一中学' => '',
            '广州市第四中学' => '',
            '广州市南海中学' => '',
            '广州市荔湾区广豪学校' => '',
            '广州市第二十三中学' => '',
            '广州市第二十四中学' => '',
            '广州市西关培英中学' => '',
            '广州市陈嘉庚纪念中学' => '',
            '广州市荔湾中学' => '',
            '广州市美华中学' => '',
            '广州市流花中学' => '',
            '广州市荔湾区双桥中学' => '',
            '广州市荔湾区汾水中学' => '',
            '广州市第九十三中学' => '',
            '广州市西关外国语实验学校' => '',
            '广州市真光中学' => '',
            '广州市荔湾区金道中学' => '',
            '广州市荔湾区花地中学' => '',
            '广州市一中实验学校' => '',
            '广州市荔湾区四中聚贤中学' => '',
            '广州广雅实验学校' => '',
            '广州市真光实验学校' => '',
            '广州市荔湾区双桥实验学校' => '',
            '广州市第五中学' => '',
            '广州市第二十六中学' => '',
            '广州市第三十三中学' => '',
            '广州市第四十一中学' => '',
            '广州市海珠实验中学' => '',
            '广州市江南外国语学校' => '',
            '广州市绿翠现代实验学校' => '',
            '广州市南武中学' => '',
            '广州市岭南印象派纪念中学' => '',
            '广州市第七十八中学' => '',
            '广州市东晓中学' => '',
            '广州市第九十七中学' => '',
            '广州市第九十八中学' => '',
            '广州市晓园中学' => '',
            '广州市蓝天中学' => '',
            '广州市聚德中学' => '',
            '广州市海珠区劬劳中学' => '',
            '广州市南石中学' => '',
            '中山大学附属中学' => '',
            '广州南武实验学校' => '',
            '广州市海珠区六中珠江中学' => '',
            '北大附中广州实验学校' => '',
            '广州市海珠中学' => '',
            '广州市白云区同和中学' => '',
            '广州市广园中学' => '',
            '广州市白云区颜乐天纪念中学' => '',
            '广州市白云区嘉禾中学' => '',
            '广州市白云区新市中学' => '',
            '广州市第二外国语学校' => '',
            '广州市白云区石井中学' => '',
            '白云广雅实验学校' => '',
            '广州市白云区培英中学实验学校' => '',
            '广州市梓元岗中学' => '',
            '广州白云广附实验学校' => '',
            '广州市广外附设外语学校' => '',
            '广东外语外贸大学附属中学' => '',
            '广州市华师附中新世界学校' => '',
            '广州市白云区景泰中学' => '',
            '广州市白云区汇侨中学' => '',
            '广州市白云区桃园中学' => '',
            '广州市白云区平沙培英学校' => '',
            '广州大学附属实验学校' => '',
            '广州市第七十中学' => '',
            '华南师范大学附属太和实验学校' => '',
            '广州市第一一三中学' => '',
            '广州市天河外国语学校' => '',
            '广州市东圃中学' => '',
            '广州南方中英文学校' => '',
            '广州市骏景中学' => '',
            '广州市第四十七中学汇景实验学校' => '',
            '广州市华颖外国语学校' => '',
            '广州市第四十七中学' => '',
            '华南理工大学附属中学' => '',
            '暨南大学附中' => '',
            '华南师范大学附属中学' => '',
            '广东实验中学附属天河学校' => '',
            '广州市第八十六中学分校' => '',
            '广州市第一二三中学' => '',
            '广州市玉岩中学' => '',
            '广州市黄埔军校纪念中学' => '',
            '广州南方中英文学校' => '',
            '广州市二中苏元实验学校' => '',
            '广州市黄埔广附实验学校' => '',
            '广州开发区外国语学校' => '',
            '玉岩天健实验学校' => '',
            '华南师范大学附属初级中学' => '',
        ];
    }
}

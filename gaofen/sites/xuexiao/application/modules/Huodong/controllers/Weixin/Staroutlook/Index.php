<?php

use Modules\Huodong\Bestvoice\User;
use Service\ThirdParty\WeixinJssdk;
use Cache\Redis;
use Service\ThirdParty\WeixinPub;

class Weixin_Staroutlook_IndexController extends Yaf_Controller_Abstract
{
    public function init() {
        $this->userObj = new User();

        $config = CFG::huodong('staroutlook');
        $this->type = $config['type'];
        $this->catid = $config['catid'];
        $this->appid = CFG::auth('cat_list', $this->catid, 'app_id');
        $this->mch_id = CFG::auth('weixin_cfg', $this->appid, 'mch_id');

        $this->redis = 'outlook';
        $this->cache = Redis::getInstance('huodong');
   
        $this->isEnd = false;
        $this->prjCode = 'OL1603';

        if(F::inEnv('develop')) {
            $this->qrEvent = 'devhopestar';
        } else {
            $this->qrEvent = 'hopestar';
        }

        $jsSdk = new WeixinJssdk();
        $this->getView()->assign('wxConfig', json_encode($jsSdk->getCfg()));

        $this->getView()->assign('isEnd', $this->isEnd);
    }

    public function indexAction() {

        $qrkey = "{$this->redis}:qr1";
        $qrcode = $this->cache->get($qrkey);
        if (!$qrcode) {
            $qrcode = $this->createQr([
                'key' => ['callback'],
                'val' => [json_encode([
                    'url' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/registercb/')
                ])],
            ]);

            $this->cache->setex($qrkey, 24*3600*5, $qrcode);
        }

        $this->getView()->assign('qrcode', $qrcode);
        $this->getView()->assign('links', [
            'registration' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/registration/'),
        ]);
        $this->getView()->assign('share', F::Url('huodong_m:/huodong/weixin_staroutlook_index/index/'));
    }

    protected function loginCheck($bool = false) {
        $callback = F::URL('huodong_m:/huodong/weixin_staroutlook_index/logincb/');
        if(!$this->userObj->isLogin()) {
            if(!$this->userObj->autoLogin()) {
                if ($bool) {
                    return false;
                }
                F::redirect(F::URL('auth:/Auth/Weixin/sync', [
                    'catid' => $this->catid,
                    'callback' => F::URL('huodong_m:huodong/weixin_account/callback', ['callback' => $callback])
                ]));
                exit;
            }
        }
        return true;
    }

    protected function getLastInfo($userId = null) {
        if (!$userId) {
            $userId = $this->userObj->getUserId();
        }

        $items = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'uid' => $userId,
            'type' => $this->type,
        ]);
        $len = sizeof($items['list']);

        if ($len == 0) {
            return null;
        }
        return $items['list'][0];
    }

    protected function getOpenid($uid) {
        $items = F::api('auth:Auth/WeixinToken/listByCond', [
            'uid' => $uid,
            'catid' => $this->catid,
        ]);

        $len = sizeof($items['list']);
        if ($len > 0) {
            $user = $items['list'][0];
            return $user['openid'];
        }
        return null;
    }

    protected function getUidByOpenid($openid) {
        $items = F::api('auth:Auth/WeixinToken/listByCond', [
            'openid' => $openid,
            'catid' => $this->catid,
        ]);

        $len = sizeof($items['list']);
        if ($len > 0) {
            $user = $items['list'][0];
            return $user['uid'];
        }
        return null;
    }

    protected function getInvitationCard($mid, $path = false) {
        if (!$mid) {
            return null;
        }
        $item = F::api('Huodong/Bestvoice/Material/get', ['id' => $mid]);
        if ($item) {
            if ($path) {
                return $item->path;
            }
            if(F::inEnv('develop')) {
                $link = '/data/uploads'.$item->path;
            } else {
                $link = GAOFEN_STATIC.$item->path;
            }
            return $link;
        }
        return null;
    }

    protected function getInvitationCardByUid($uid) {
        $items = F::api('Huodong/Bestvoice/Material/listByCond', [
            'uid' => $uid,
            'type' => $this->type,
        ]);
        $len = sizeof($items['list']);
        if ($len > 0) {
            $m = $items['list'][0];
            return $m;
        }
        return null;
    }

    protected function createQr($data) {
        array_push($data['key'], 'event');
        array_push($data['val'], $this->qrEvent);
        $data['expire_seconds'] = 3600*24*7;
        $query = http_build_query($data);
        $query = preg_replace('/%5B[0-9]+%5D/simU', '[]', $query);
        $rs = F::api("weixin:account/{$this->appid}/qr/create?{$query}", [], [], 'POST');
        if ($rs && $rs['return_code'] == 'SUCCESS') {
            return $rs['content']['qrcode_image'];
        }
        return null;
    }

    protected function sendMsg($openid, $data) {
        $url = F::URL('huodong_m:/huodong/weixin_staroutlook_index/registration/');
        $msg = [
            'url' => $url,
            'data' => $data,
        ];

        $rs = F::api("weixin:account/{$this->appid}/tmpl/repo/OPENTM207664667/user/open/{$openid}/send/", json_encode($msg), [], 'POST');
    }

    protected function processImage($savePath, $headimgUrl, $ticketUrl, $nickname) {
        $basepath = BASEPATH.'/application/modules/Huodong/views/weixin/staroutlook';
        $tpl = $basepath.'/template.png';

        $tplW = 750;
        $tplH = 1335;
        $headSize = 156;
        $ticketSize = 270;

        $fp = @fopen($headimgUrl, "r");
        if (!$fp) {
            return false;
        }
        $imageFile = fread ($fp, 3000000);
        fclose($fp);
        $tmpHeadName = tempnam ("/temp", "IMG");
        $fp = fopen($tmpHeadName, "w");
        fwrite($fp, $imageFile);
        fclose($fp);

        $baseImg = imagecreatetruecolor($tplW, $tplH);
        $tplImg = imagecreatefrompng($tpl);
        $ticketImg = imagecreatefromjpeg($ticketUrl);

        $headImg = @imagecreatefromjpeg($tmpHeadName);
        if (!$headImg) {
            $headImg = @imagecreatefrompng($tmpHeadName);
        }
        if (!$headImg) {
            $headImg = @imagecreatefromwebp($tmpHeadName);
        }
        unlink($tmpHeadName);

        $result = true;
        try {
            $headImgOld = $headImg;
            $headImg = imagescale($headImg, $headSize, $headSize);

            $ticketImgOld = $ticketImg;
            $ticketImg = imagescale($ticketImg, $ticketSize, $ticketSize);

            imagealphablending($baseImg, false);
            imagealphablending($tplImg, false);

            imagecopymerge(
                $baseImg, $headImg, (750-$headSize)/2 , 234,
                0, 0, $headSize, $headSize, 100
            );
            imagecopymerge(
                $baseImg, $ticketImg, (750-$ticketSize)/2, 820,
                0, 0, $ticketSize, $ticketSize, 100
            );
            imagecopymerge(
                $baseImg, $tplImg, 0, 0,
                0, 0, $tplW, $tplH, 100
            );

            $len = strlen($nickname);
            $black = imagecolorallocate($baseImg, 0, 0, 0);
            $font = $basepath.'/simhei.ttf';
            imagettftext($baseImg, 30, 0, (750-20*$len)/2, 430, $black, $font, $nickname);

            imagettftext($baseImg, 10, 0, 275, 1110, $black, $font, '此二维码将于'.date('Y年n月j日', strtotime('+6 days')).'过期。');

            /*
            header('Content-Type: image/png');
            imagepng($baseImg);
            */

            $dirname = dirname($savePath);

            if(!is_dir($dirname)) {
                mkdir($dirname, 0755, true);
            }

            imagepng($baseImg, $savePath);
        } catch (Exception $e) {
            // log it?
            $result = false;
        }

        imagedestroy($baseImg);
        imagedestroy($tplImg);
        imagedestroy($headImg);
        imagedestroy($headImgOld);
        imagedestroy($ticketImg);
        imagedestroy($ticketImgOld);

        return $result;
    }

    protected function getMsg($exmsg = '') {
        $msg = '欢迎关注CCTV“希望之星”海外生存大作战相关信息！报名后获取个人专属码，每邀请50人扫码即可减免500元，每人最高优惠1500元！';
        $msg .= "\r\n";
        $msg .= 'CCTV“希望之星”海外生存大作战是为期14天的综合能力提升真人秀，全程央视跟摄。将游历美国著名城市，途经世界知名大学，体验国外多元文化；优秀选手还有机会直通2017年CCTV“希望之星”英语风采大赛全国预选赛。小伙伴们都加入了，你还等什么？！';
        $msg .= "\r\n";
        $msg .= '<a href="http://mp.weixin.qq.com/s?__biz=MjM5OTQ3NjUwOQ==&mid=402038193&idx=1&sn=fed4b6379859103d5836016d73939be6#rd" title="" class="more-link">央视巨制，名校联合，这条游学线超乎你想象！</a>';
        $msg .= "\r\n";

        $msg .= $exmsg;

        return $msg;
    }

    public function registrationAction() {
        $this->loginCheck();

        $uid = $this->userObj->getUserId();

        $uinfo = $this->getLastInfo($uid);
        if ($uinfo) {
            $uinfo = $uinfo->assemblage;
        }
        $isReg = true;
        $uinfoDefault = [
            'name' => '',
            'grade' => '',
            'cell' => '',
            'qq' => '',
            'addr' => [
                'province' => '',
                'city' => '',
                'district' => '',
            ],
        ];

        if (!$uinfo) {
            $uinfo = $uinfoDefault;
            $isReg = false;
        } else {
            $uinfo = array_merge($uinfoDefault, $uinfo);
        }

        // create qrcode for 7 days but refresh in 5 days.
        $qrkey = "{$this->redis}:qr1";
        $qrcode = $this->cache->get($qrkey);
        if (!$qrcode) {
            $qrcode = $this->createQr([
                'key' => ['callback'],
                'val' => [json_encode([
                    'url' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/registercb/')
                ])],
            ]);

            $this->cache->setex($qrkey, 24*3600*5, $qrcode);
        }

        // limit update
        $canUpdateKey = "{$this->redis}:regs:$uid";
        $canUpdate = $this->cache->get($canUpdateKey);
        if ($canUpdate && 3 <= $canUpdate) {
            $canUpdate = false;
        } else {
            $canUpdate = true;
        }

        $this->getView()->assign('uinfo', $uinfo);
        $this->getView()->assign('isReg', $isReg);
        $this->getView()->assign('qrcode', $qrcode);
        $this->getView()->assign('canUpdate', $canUpdate);
        $this->getView()->assign('links', [
            'index' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/index/'),
            'register' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/register/'),
            'card' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/card/'),
        ]);
        $this->getView()->assign('share', F::Url('huodong_m:/huodong/weixin_staroutlook_index/index/'));
    }

    protected function sendCard() {
        $uid = $this->userObj->getUserId();

        // if wxmid:uid exist, use this,
        // else if card:uid exist, upload it and use it,
        // else create new one upadte it then use it.

        $mKey = "{$this->redis}:wxmid:{$uid}";
        $mVal = $this->cache->get($mKey);

        if (!$mVal) {
            $mVal = $this->getCard();
            $this->cache->setex($mKey, 2*24*3600, $mVal);
        }
        
        if ($mVal) {
            $wxPub = new WeixinPub();
            $response = $wxPub->getService()->request('message/custom/send', 'post', json_encode([
                'touser' => $this->getOpenid($uid),
                'msgtype' => 'image',
                'image' => [
                    'media_id' => $mVal,
                ],
            ]));

            return true;
        }
        return false;
    }

    protected function uploadCard($mid) {
        $wxPub = new WeixinPub();
        $card = $this->getInvitationCard($mid, true);

        $file = DATA_PATH.$card;
        $response = $wxPub->getService()->request('media/upload?type=image', 'GET', [
        ], [], [
            //CURLOPT_URL => 'http://dev.xuexiao.gaofen.com/huodong/weixin_staroutlook_index/pupload/',
            CURLOPT_SAFE_UPLOAD => false, 
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => [
                'media' => new CURLFile($file, 'image/png', time().'.png'),
            ], 
        ]);

        $result = json_decode($response);
        if (isset($result->media_id)) { 
            return $result->media_id;
        }
        return false;
    }

    protected function getCard() {
        $uid = $this->userObj->getUserId();

        $mKey = "{$this->redis}:card:{$uid}";
        $mVal = $this->cache->get($mKey);
        if ($mVal > 0) {
            $card = $this->getInvitationCard($mVal);

            if ($card) {
                $mid = $mVal;
                return $this->uploadCard($mid);
            }
        }

        $qrcode = $this->createQr([
            'key' => ['callback', 'inviter'],
            'val' => [
                json_encode([
                    'url' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/invitationcb/'),
                    'inviter' => $uid,
                ]),
                $uid,
            ],
        ]);

        if (!$qrcode) {
            return false;
            // $qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFC8ToAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0tVUEZjTWZtdHREUHZULTY5bTJ3AAIEzZYdVwMEgDoJAA==';
        }

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time()).'.png';
        $savePath = DATA_PATH.$saveUri;

        $rs = $this->processImage(
            $savePath,
            $this->userObj->headimgurl,
            $qrcode,
            $this->userObj->nickname
        );

        if (!$rs) {
            $rs = $this->processImage(
                $savePath,
                $this->userObj->headimgurl,
                $qrcode,
                $this->userObj->nickname
            );
        }

        if($rs) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $saveUri,
                'type'  => $this->type,
                'mil_sec'   => 0,
                'ext_data' => ['list' => []],
            ];

            $material = $this->getInvitationCardByUid($uid);
            if ($material) {
                $mid = $material->id;
                $saveData['id'] = $mid;
                $saveData['ext_data'] = $material->ext_data;
                $rs = F::api('/Huodong/Bestvoice/Material/update', $saveData);
            } else {
                $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }

            $this->cache->setex($mKey, 24*3600*5, $mid); // keep it for 5 days

        } else {
            return false;
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);

        $card = $this->getInvitationCard($mid);
        if ($card) {
            return $this->uploadCard($mid);
        }
    }

    public function logAction() {
        $p = V('p:pw', null);

        if (!$p == 'gaofen') {
            $this->getView()->assign('isAuth', false);
            return;
        }

        $uinfos = F::api('Huodong/Bestvoice/Assemblage/listByCond', [
            'type' => $this->type,
            'limit' => 9999,
        ]);

        $result = [];
        foreach($uinfos['list'] as $u) {
            if (!isset($result['u'.$u->uid])) {
                $result['u'.$u->uid] = $u->assemblage;
                $result['u'.$u->uid]['uid'] = $u->uid;
                $result['u'.$u->uid]['qq'] = isset($u->assemblage['qq'])?$u->assemblage['qq']:'';
                $material = $this->getInvitationCardByUid($u->uid);
                if ($material) {
                    $result['u'.$u->uid]['count'] = count($material->ext_data['list']);
                } else {
                    $result['u'.$u->uid]['count'] = 0;
                }
            }
        }

        $this->getView()->assign('isAuth', true);
        $this->getView()->assign('uinfos', $result);
    }

    /*
    private function cardAction() {
        $this->loginCheck();

        $m = V('g:m', null);
        $material = $this->getInvitationCard($m);

        $uid = $this->userObj->getUserId();
        $uinfo = $this->getLastInfo($uid);

        if (!$uinfo && !$material) {
            F::redirect(F::Url('huodong_m:/huodong/weixin_staroutlook_index/index/'));
            exit;
        }
        if ($material) {
            $this->getView()->assign('link', $material);
            return;
        }

        $mKey = "{$this->redis}:card:{$uid}";
        $mVal = $this->cache->get($mKey);
        if ($mVal === 0) {
            echo '已处理，请稍后5分钟。';
            exit;
        } else if ($mVal > 0) {
            $card = $this->getInvitationCard($mVal);

            if ($card) {
                F::redirect(F::Url('huodong_m:/huodong/weixin_staroutlook_index/card/', ['m' => $mVal]));
                exit;
            }
        }

        $this->cache->setex($mKey, 5*60, 0); // prevent request too fast

        $qrcode = $this->createQr([
            'key' => ['callback', 'inviter'],
            'val' => [
                json_encode([
                    'url' => F::Url('huodong_m:/huodong/weixin_staroutlook_index/invitationcb/'),
                    'inviter' => $uid,
                ]),
                $uid,
            ],
        ]);

        if (!$qrcode) {
            echo 'Fail to create';
            exit;
            // $qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQFF8DoAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL0hrTnAtbi1tRjlCdXZBaDVXbTJ3AAIESFvvVgMEgDoJAA==';
        }

        $saveUri = "/huodong/voice/".$this->type."/{$uid}_".md5(time()).'.png';
        $savePath = DATA_PATH.$saveUri;

        $rs = $this->processImage(
            $savePath,
            $this->userObj->headimgurl,
            $qrcode,
            $this->userObj->nickname
        );

        if($rs) {
            $saveData = [
                'uid'   => $uid,
                'path'  => $saveUri,
                'type'  => $this->type,
                'mil_sec'   => 0,
                'ext_data' => ['list' => []],
            ];

            $material = $this->getInvitationCardByUid($uid);
            if ($material) {
                $mid = $material->id;
                $saveData['id'] = $mid;
                $saveData['ext_data'] = $material->ext_data;
                $rs = F::api('/Huodong/Bestvoice/Material/update', $saveData);
            } else {
                $rs = F::api('/Huodong/Bestvoice/Material/create', $saveData);
                $mid = $rs->id;
            }

            $this->cache->setex($mKey, 24*3600*5, $mid); // keep it for 5 days

        } else {
            echo 'fail to save';
            exit;
        }

        //上报数据
        file_get_contents('http://bbs.gaofen.com/plugin.php?id=sms_club:test&nickname='.$this->userObj->nickname);

        $card = $this->getInvitationCard($mid);
        if ($card) {
            F::redirect(F::Url('huodong_m:/huodong/weixin_staroutlook_index/card/', ['m' => $mid]));
            exit;
        }
    }
    */

    public function logincbAction() {
        $this->loginCheck();

        $user = $this->userObj;
        F::api("weixin:account/{$this->appid}/login", [
            'unionid' => $user->unionid,
            'openid' => $user->openid,
            'nickname' => $user->nickname,
            'headimgurl' => $user->headimgurl,
            'sex' => $user->sex,
        ], [], 'POST');

        $url = F::URL('/huodong_m:/huodong/weixin_staroutlook_index/registration/');
        F::redirect($url);
        exit;
    }

    public function registerAction() {
        if (!$this->loginCheck(true)) {
            F::ajaxRst(false, 100001, '请授权。');
            exit;
        }

        $user = $this->userObj;
        $uid = $user->getUserId();

        $key = "{$this->redis}:regf:$uid";
        if ('1' == $this->cache->get($key)) {
            F::ajaxRst(false, 100001, '已处理，请稍后。');
            exit;
        }
        $this->cache->setex($key, 60*0.1, '1');

        $name = V('p:name', '');
        $grade = V('p:grade', '');
        $cell = V('p:cell', '');
        $qq = V('p:qq', '');
        $province = V('p:province', '');
        $city = V('p:city', '');
        $district = V('p:district', '');

        $key = "{$this->redis}:regs:$uid";
        $val = $this->cache->get($key);
        if (3 <= $this->cache->get($key)) {
            F::ajaxRst(false, 100001, '已到达到申请上限，请24小时后再试。');
            exit;
        }

        $validation = [
            'name' => [
                'p' => '/^.{1,20}$/u',
                'm' => '学生名字。必填项。不长于20个字。',
            ],
            'grade' => [
                'p' => '/^(\d{1,2})?$/u',
                'm' => '学生年级。可选项。不长于10个字。',
            ],
            'cell' => [
                'p' => '/^(\d{7,11})?$/',
                'm' => '联系号码。可选项。输入你的手机或座机号码。',
            ],
            'qq' => [
                'p' => '/^(\d{5,12})?$/',
                'm' => 'QQ号码。可选项。输入你的QQ号码。'
            ],
            'province' => [
                'p' => '/^.{0,10}$/u',
                'm' => '地址：省。可选项。输入你的现居住的省。不长于10个字。',
            ],
            'city' => [
                'p' => '/^.{0,20}$/u',
                'm' => '地址：市。可选项。输入你的现居住的市。不长于20个字。',
            ],
            'district' => [
                'p' => '/^.{0,20}$/u',
                'm' => '地址：区。可选项。输入你的现居住的区。不长于20个字。',
            ],
        ];
 
        $valid = true;
        $errMsg = null;
        foreach ($validation as $k => $v) {
            if (!preg_match($v['p'], $$k)) {
                $valid = false;
                $errMsg = $v['m'];
                break;
            }
        }
        if (!$valid) {   
            F::ajaxRst(false, 100001, $errMsg);
            exit;
        }

        $oldInfo = $this->getLastInfo($user->id);
        $oldInfo = $oldInfo->assemblage;
        if ($oldInfo['name'] == $name &&
            $oldInfo['grade'] == $grade &&
            $oldInfo['cell'] == $cell &&
            $oldInfo['qq'] == $qq &&
            $oldInfo['addr']['province'] == $province &&
            $oldInfo['addr']['city'] == $city &&
            $oldInfo['addr']['district'] == $district
        ) {
            $this->sendCard();
            F::ajaxRst(['uinfo' => $oldInfo, 'old' => 1]);
            exit;
        }

        $this->cache->setex($key, 12*3600, $val + 1);
        $uinfo = F::api('Huodong/Bestvoice/Assemblage/create', [
            'uid' => $user->id,
            'pid' => 0,
            'type' => $this->type,
            'assemblage' => [
                'name' => $name,
                'grade' => $grade,
                'cell' => $cell,
                'qq' => $qq,
                'addr' => [
                    'province' => $province,
                    'city' => $city,
                    'district' => $district,
                ],
            ],
        ]);

        if (!$uinfo) {
            $this->sendCard();
            F::ajaxRst(false, 100001, '更改失败，请重试。');
            exit;
        }
        F::ajaxRst(['uinfo' => $uinfo->assemblage]);
        exit;
    }

    /**
     * Scan qr after register callback
     */
    public function registercbAction() {
        $appid = V('p:appid');
        $openid = V('p:openid');

        $uid = $this->getUidByOpenid($openid);

        $url = F::URL('huodong_m:/huodong/weixin_staroutlook_index/registration/');
        $msg = "<a href='{$url}'>立即报名 / 登录</a>";
        $msg = $this->getMsg($msg);

        if ($uid) {
            $uinfo = $this->getLastInfo($uid);
            if ($uinfo) {
                $type = 1;
                $msg = "赶紧分享让好友帮你扫码吧！优惠大礼包等你来拿：邀请50名好友扫码可获500元现金减免，封顶1500。\r\n";
                $msg .= "在找邀请卡吗？马上<a href='{$url}'>登录</a>获取邀请卡！";
            }
        }

        $this->getView()->assign('msg', $msg);
    }

    /**
     * Scan qr of invitation callback
     */
    public function invitationcbAction() {
        $appid = V('p:appid');
        $openid = V('p:openid');
        $inviter = V('p:inviter');

        $iopenid = $this->getOpenid($inviter);
        $material = $this->getInvitationCardByUid($inviter);

        if (!$material || !$iopenid) {
            exit;
        }
        $url = F::URL('huodong_m:/huodong/weixin_staroutlook_index/registration/');

        $history = $material->ext_data['list'];
        $historyLen = sizeof($history);

        if ($iopenid == $openid) {
            // is owner
            $msg = "有{$historyLen}个朋友收到邀请了。\r\n";
            $msg .= "<a href='{$url}'>修改资料</a>";
            $msg = $this->getMsg($msg);

            $this->getView()->assign('msg', $msg);
            return;
        }

        // not owner
        if (!in_array($openid, $history)) {
            F::api("weixin:user/open/{$iopenid}/make-friend", [
                'openid' => $openid,
                'src' => 2, // $this->prjCode,
                'type' => 1, // 1 - from qr code.
            ], [], 'POST');

            ++$historyLen;
            // if ($historyLen%10 == 0) {
                $open = F::api("weixin:user/open/{$openid}/", [], [], 'GET');

                $openName = "你有好友";
                if (isset($open['content'][0]['unionid']['nickname'])) {
                    $openName = $open['content'][0]['unionid']['nickname'];
                }

                $m = "已有{$historyLen}个好友收到邀请了";
                if ($historyLen == 50) {
                    $m = "您人气太高了！已经有50名好友帮你扫描啦！恭喜成功获取500元现金减免优惠！再接再厉！";
                } 
                if ($historyLen == 50) {
                    $m = "您人气太高了！已经有100名好友帮你扫描啦！恭喜成功获取1000元现金减免优惠！再接再厉！";
                } 
                if ($historyLen == 50) {
                    $m = "您人气太高了！已经有150名好友帮你扫描啦！恭喜成功获取1500元现金减免优惠！再接再厉！";
                } 

                $this->sendMsg($iopenid, [
                    'first' => ['value' => "海外生存大作战"],
                    'keyword1' => ['value' => "{$openName}收到邀请了"],
                    'keyword2' => ['value' => date('Y-m-d H:i:s') ],
                    'remark' => ['value' => $m],
                ]);
            // }

            array_push($history, $openid);
            F::api('/Huodong/Bestvoice/Material/update', [
                'id' => $material->id,
                'ext_data' => ['list' => $history],
            ]);
        }

        $msg = "<a href='{$url}'>立即报名 / 登录</a>";
        $msg = $this->getMsg($msg);
        $this->getView()->assign('msg', $msg);
    }
}

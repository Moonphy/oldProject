<?php
namespace Presenters\Huodong\Bestvoice;

use \Presenters\AbstractModelPresenter;

class Material extends AbstractModelPresenter
{  
    static $myFavs = [];

    function __toString() {

    }

    //录音地址
    public function getVoiceLink() {
        $link = '';
        if(\F::inEnv('develop')) {
            $link = '/data/uploads'.$this->_model->path;
        } else {
            $link = GAOFEN_STATIC.$this->_model->path;
        }

        $UA = new \UserAgent();

        //if($UA->is_mobile('android')) {
         //   $link = $link . '.amr';
        //} else {
            $link = $link . '.mp3';
        //}

        return $link;
        
    }

    //保存路径
    public function getSaveFilepath() {
        return DATA_PATH.$this->_model->path;
    }

    public function getImageLink() {
        $link = '';
        if(\F::inEnv('develop')) {
            $link = '/data/uploads'.$this->_model->path;
        } else {
            $link = GAOFEN_STATIC.$this->_model->path;
        }
        return $link;
    }

    public function getFormatCreatedDate($format="Y-m-d H:i") {
        return date($format, strtotime($this->_model->created_at));
    }

    public function getVoiceTime() {
        $totalSeconds = ceil($this->_model->mil_sec/1000);
        $totalSeconds = $totalSeconds>60 ? '15':$totalSeconds;
        $rs = $totalSeconds.'″';
        return $rs;
    }

    /**
     * 是否喜欢过当前作品
     * @param  [type]  $uid      用户id
     * @param  [type]  $mode     [description]
     * @param  integer $ttl 允许用户再次投票间隔时间（秒），为零时只能投一次,默认24小时
     * @return boolean           [description]
     */
    public function isFavByUser($uid, $mode='', $ttl=86400) {

        static $tmp = '';
        if($uid && empty(static::$myFavs)) {

            if(empty($tmp['list'])) {
                $tmp = \F::api('/Huodong/Bestvoice/Fav/listByCond', ['uid'=>$uid, 'type'=>$this->_model->type, 'limit'=>50]);
            }

            if(!empty($tmp['list'])) {
                foreach($tmp['list'] as $row) {                    
                    if($ttl) {
                        //允许下次投票时间, 按天限制时，从0点开始
                        if(($ttl%86400)==0) {
                            $nextFavTime = strtotime(date('Y-m-d', strtotime($row['created_at']) + $ttl));
                        }else{//按时分秒限制时，从具体时间开始
                            $nextFavTime =  strtotime($row['created_at']) + $ttl;
                        }

                        if( time() < $nextFavTime ) {
                            if(!isset(static::$myFavs[$row['mid']])) {
                                static::$myFavs[$row['mid']] = 1;
                            }else{
                                static::$myFavs[$row['mid']]++;
                            }
                        }
                    }else{
                        if(!isset(static::$myFavs[$row['mid']])) {
                            static::$myFavs[$row['mid']] = 1;
                        }else{
                            static::$myFavs[$row['mid']]++;
                        }
                    }
                }
            }
        }

        $hadLike = isset(static::$myFavs[$this->_model->id]);

        $rt = '';
        switch($mode) {
            case 'text':
                $rt = $hadLike ?'已点赞':'赞';
            break;

            case 'class':
                $rt = $hadLike ? 'had-like': '';
            break;

            case 'icon':
                $rt = $hadLike ? '':'icon-like-hand';
            break;

            default:
                $rt = (bool)$hadLike;
            break;
        }

        return $rt;
    }

    public function getAudioHtml() {
        $html = '<audio  preload="none" src="'.$this->getVoiceLink().'" class="audio" id="en"></audio>';
        return $html;
    }

    /**
     * 获取上周排行榜值
     * @return [type] [description]
     */
    public function getPreRank() {
        if($this->_model->pre_rank>0 && $this->_model->pre_rank<4) {
            return $this->_model->pre_rank;
        }

        return 4;
    }

    /**
     * 获取上周荣誉描述
     * @return [type] [description]
     */
    public function getPreRankDescription() {
        $_honour = [
            1 => '上周冠军，继续加油',
            2 => '上周亚军，继续加油',
            3 => '上周季军，继续加油',
        ];

        if(isset($_honour[$this->_model->pre_rank])) {
            return $_honour[$this->_model->pre_rank];
        }else{
            return '上周排名第'.$this->_model->pre_rank.'位';
        }
    }

    /**
     * 获取荣誉称呼
     * @param  [type] $fav_num [description]
     * @return [type]          [description]
     */
    public function getHonourName($fav_num, $pre_rank) {
        $name = '';

        if($pre_rank>0 && $pre_rank<=3) {
            switch($pre_rank) {
                case 1:
                    $name = '周冠军';
                    break;
                case 2:
                    $name = '周亚军';
                    break;
                case 3:
                    $name = '周季军';
                    break;
            }
        }else{
            switch($fav_num) {
                case ($fav_num<=10):
                    $name = '萌童徽章';
                    break;
                case ($fav_num<=30):
                    $name = '萌士徽章';
                    break;
                case ($fav_num<=80):
                    $name = '萌客徽章';
                    break;
                case ($fav_num<=160):
                    $name = '萌侠徽章';
                    break;
                case ($fav_num<=230):
                    $name = '萌圣徽章';
                    break;
                default:
                    $name = '萌神徽章';
                    break;
            }
        }

        return $name;
    }
}
 

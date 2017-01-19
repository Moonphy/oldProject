<?php
set_time_limit(3600*24);

use Modules\Huodong\Bestvoice\Material;

class CronController extends Yaf_Controller_Abstract {

    public function init() {
        //cron只允许cli执行
        if(!Yaf_Dispatcher::getInstance()->getRequest()->isCli() && !F::inEnv('develop')){
            die();
        }

        Yaf_Dispatcher::getInstance()->disableView();
    }


    public function rankofdatelineAction() {
        $school_types = ['xsc'=>3/*, 'zhongkao'=>2, 'gaokao'=>1*/];
        $cates = [1=>'range_rank_yg',2=>'range_rank_ng']; //办学属性 1公办 2民办
        $city = V('g:city', 289);
        $districtList = CFG::school('location', 'city', $city, 'district');
        $dids = array_keys($districtList);
        $dids[] = '';

        echo PHP_EOL;
        echo '[info] started at :'.date('Y-m-d H:i:s').PHP_EOL;


        foreach($school_types as $name=>$v){
          foreach($cates as $cate=>$rankField) {
            foreach($dids as $did) { //注意$did, 为0时表示“周边其它区域” 为''时表示忽略区域条件，所以要用"==="进行比较
              if($cate==2 && $did!=='') continue; //民办学样只有全量排名没区域排名
              $args = array('page'=>1, 'cate'=>$cate, 'district'=>$did, 'count'=>'20', 'orderby'=>$rankField);
               $rs = F::api('/Search/cz', $args);

               if($rs && isset($entry['errno'])){
                  echo '[error] msg:'.$entry['err'].' school_type:'.$v.' at: '.date('Y-m-d H:i:s').PHP_EOL;
                  continue;
               }
               $entry = $rs['list'];
               $ids = array();
               foreach($entry as $item){
                  $ids[] = array('id'=>$item['id'], 'name'=>$item['name'], 'views'=>$item['views']);
               }

               $data = array(
                    'dateline'  => date('ymWNH'), //年.周.日.时
                    'school_type' => $v,
                    'ids'   => $ids,
                    'cate'  => $cate,
                    'district' => $did,
                );

               $r = F::api('/Rank/create', $data);
               if($r){
                    echo '[info] completed school_type:'.$v.',params:'.json_encode($args).' at: '.date('Y-m-d H:i:s').PHP_EOL;
               }
            }
          }
        }

        echo '[info] finished at :'.date('Y-m-d H:i:s').PHP_EOL;
    }

    /**
     * 批量更新浏览量
     */
    public function updateViewsAction()
    {
        $city = V('g:city', 289);
        //更新流览数到数据库
        $rst =  F::api('/Cz/School/saveUnitToDbForAdmin', array('field'=>'views', 'city'=>$city));

        echo "Finished at :".date('Y-m-d H:i:s');
    }

    /**
     * 中国豆娃好声音每期数据备份
     * @return [type] [description]
     */
    public function finishBestvoiceRoundAction() {
      $rs = F::api('/Huodong/Bestvoice/Material/finishRound', ['type'=>13]);
      echo "Finished at :".date('Y-m-d H:i:s').PHP_EOL;
    }

    /**
     * 好声音每天新手奖
     */
    public function bestvoiceDayNewUserPrizeAction() {

        $type = 1;

        $rs = F::api('/Huodong/Bestvoice/Material/listByCond', ['type'=>$type, 'sort'=>'created_at', 'limit'=>300]);

        $tmp = [];
        if(isset($rs['list']) && is_array($rs['list'])) {
            foreach($rs['list'] as $row) {
                //只允许前一天新过用户参加新人奖
                if(date('Y-m-d', strtotime($row['created_at'])) !== date('Y-m-d', strtotime('-1 day'))) continue;
                $tmp[$row->fav_num][] = $row->uid;
            }
        }

        $mObj = new Material();

        $mObj->saveTopNewUserIds($tmp, $type);

        echo "Finished at :".date('Y-m-d H:i:s').PHP_EOL;

    }


    /**
     * 自动投票任务
     * @return [type] [description]
     */
    public function incrBestvoiceUserFavAction() {

        $uids = ["8862866","8862889","8862904","8862910","8862908","8862912","8862918","8862924","8862926","8862929","8862928","8839494","8862964","8862969","8862977","8862991","8862996","8863049","8863057","8839500","8863106","8863116","8840188","8863136","8863137","8863020","8863149","8862863","8863170","8862939","8863272","8862934","8863309","8863352","8863394","8863408","8863426","8863457","8863132","8863523","8863532","8863542","8863563","8863117","8863813","8863934","8863935","8840202","8864295","8864298","8864302","8864297","8864314","8864323","8864325","8864324","8864335","8864340","8864344","8864354","8864372","8864378","8864397","8864402","8864511","8864447","8864826","8863900","8840197","8865172","8840201","8862895","8839496","8863472","8863110","8865504","8859891","8865996","8866005","8839508","8862982","8864749","8864796","8864807","8864808","8867270","8863059","8867966","8863036","8868861","8862894","8868989","8863255","8869928","8867382","8868828","8839493","8868059","8865982","8863044","8868822","8840196","8863197","8863752","8868657","8840198","8840206",];

        $id = 63;

        $t =date('Y-m-d H:i:s');

        if(rand(1, 5) != 3) {
            echo $t.':任务命中失败'.PHP_EOL;
            exit;
        }

        foreach($uids as $uid) {
            $rs = F::api('/Huodong/Bestvoice/Fav/listByCond', ['uid'=>$uid, 'mid'=>$id, 'limit'=>1]);
            if(isset($rs['list'])) {
                $favRs = false;
                //时间控制每天能投1次

                if( empty($rs['list']) || strtotime(date('Y-m-d', strtotime($rs['list'][0]['created_at'])))<strtotime(date('Y-m-d'))) {
                    $favRs = F::api('/Huodong/Bestvoice/Fav/create', ['uid'=>$uid, 'mid'=>$id, 'type'=>0]);
                }

                if($favRs) {
                    echo  $t.':'.$uid.'-投票成功'.PHP_EOL;
                    break;
                }
            }
        }
    }

    /**
     * 导入获奖数据
     * @return [type] [description]
     */
    public function importPrizeAction() {
        $file = DATA_PATH."/prize/winner_3";
        $data = explode("\n", file_get_contents($file));
        foreach($data as $k=>$r) {
            $r = explode("\t", $r);

            if($k<=200) {
                $saveData = ['date'=>date('Ymd', strtotime($r[0])), 'type'=>3, 'gift'=>$r[4], 'uid'=>$r[1], 'pid'=>$r[2], 'fav_id'=>$r[3], 'created_at'=>$r[0]];
            }else{
                $saveData = ['date'=>date('Ymd', strtotime($r[0])), 'type'=>3, 'gift'=>$r[1], 'uid'=>$r[2], 'pid'=>$r[3], 'fav_id'=>$r[4], 'created_at'=>$r[0]];
            }

            \F::api('/Huodong/Bestvoice/Prize/create', $saveData);
        }

        return false;
    }
}

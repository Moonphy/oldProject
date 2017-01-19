<?php
namespace Modules\Teacher;

use Modules\Teacher\TeacherClient;

class Teacher{
	static $instance = NULL;

	static public function getInstance(){
		if(empty(static::$instance)) {
			static::$instance = new static();
		}

		return static::$instance;
	}
	
	public function getCalendarHtml($tid, $month='', $year=''){
		$tpl = '<div class="calendar">
              <div class="calendar-head">
                <div class="prev-mon">
                  <div class="iconfont" rel="e:calendar,type:prev">&#x3612;</div>
                </div>
                <div class="month"><span id="year">{calendar_year}年</span><span id="month">{calendar_month}月</span></div>
                <div class="next-mon">
                  <div class="iconfont" rel="e:calendar,type:next">&#x3612;</div>
                </div>
              </div>
              <div class="calendar-body">
                <table>
                  <thead>
                    <tr>
                      <th>一</th>
                      <th>二</th>
                      <th>三</th>
                      <th>四</th>
                      <th>五</th>
                      <th>六</th>
                      <th>日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar_body}
                  </tbody>
                </table>
              </div>
            </div>';

        $month = in_array($month, range(1,12))? $month:date('n');
        $year  = (int)$year > 2012 ? (int)$year:date('Y');

        $start_time = strtotime($year.'-'.$month.'-1');
        $end_time = strtotime('+1 month', $start_time)-1;

        $cacheKey = '12#M_T_T#CALENDAR#'.$year.'#'.$month.'#'.$tid;

        $html = \Cache::get($cacheKey);

        if(empty($html)) {
	        $client = new TeacherClient();

	        //教师排课表
	        $result = $client->getArrangementListByTeacher(['teacherNid'=>$tid, 'bg'=>$start_time, 'ed'=>$end_time]);
            $canClassTimeResult = $client->CanClassTimeByTeacher(['teacherNid'=>$tid, 'beginTime'=>$start_time, 'endTime'=>$end_time]);

            //var_dump($result->getArrangementListByTeacherResult->ArrangementModel);
            //教师排课次数
	        $arragementList = array();
	        if(!empty($result->getArrangementListByTeacherResult->ArrangementModel)){
                $result = $result->getArrangementListByTeacherResult->ArrangementModel;
                if(is_array($result)) {
      	        	foreach($result as $row) {
                        $_d = date('j', strtotime($row->TimeFrom));
                        if(isset($arragementList[$_d])) {
                            $arragementList[$_d]++;
                        } else {
                            $arragementList[$_d] = 1;
                        }      	        		
      	        	}
                }else{
                    $arragementList[date('j', strtotime($result->TimeFrom))] = 1;
                }
	        }

            //
            $canClassList = [];
            if(!empty($canClassTimeResult->CanClassTimeByTeacherResult->VipTeacherClassTime)){
                $result = $canClassTimeResult->CanClassTimeByTeacherResult->VipTeacherClassTime;
                if(is_array($result)) {
                    foreach($result as $row) {
                        $_d = date('j', strtotime($row->Date));
                        if(isset($canClassList[$_d])) {
                            $canClassList[$_d]++;
                        } else {
                            $canClassList[$_d] = 1;
                        }                       
                    }
                }else{
                    $canClassList[date('j', strtotime($result->Date))] = 1;
                }
            }


            //获取月历数据
	        $calendar = $this->getCalendarData($start_time);

	        $calendar_body = '';
	        foreach($calendar as $row){
	        	$calendar_body .= "<tr>".PHP_EOL;
	        	foreach($row as $day){
                    if($day['day']) {
                        $class = '';
                        $amount = 0;
                        $canClassTimes = 0;
                        if(isset($arragementList[$day['day']])){
                            $amount = $arragementList[$day['day']];
                        }

                        if(isset($canClassList[$day['day']])) {
                            $canClassTimes = $canClassList[$day['day']];
                        }

                        switch($this->getArragementStatus($day['date'], $amount, $canClassTimes)) {
                            case 1:
                                $class = 'over';
                            break;

                            case 2:
                                $class = 'scheduled';
                            break;

                            case 3:

                            break;
                        }
                        $calendar_body .="\t<td class='{$class}'><span>{$day['day']}</span></td>".PHP_EOL;
                    }else{
                        $calendar_body .="\t<td></td>".PHP_EOL;
                    }
	        		
	        	}
	        	$calendar_body .= "</tr>".PHP_EOL;
	        }

	        $html = preg_replace(array('#{calendar_year}#', '#{calendar_month}#', '#{calendar_body}#'), array($year, $month, $calendar_body), $tpl);
	        \Cache::set($cacheKey, $html, 300);
	    }
        return $html;        
	}

	//获取$time当月月历
	function getCalendarData($time){
		$theDay = date('N', $time); //星期几；
        $days = date('t', $time); //这个月总有几天；
        
        $cal = array(); //月历数据存放
        $c_s = false; //
        $c_e = true;
        $n = 1;
        for($i=1; $i<=6; $i++){
        	for($j=1; $j<=7; $j++) {
        		if($i==1 && $j==$theDay){
        			$c_s = true;
        		}
        		if($n>$days) {
        			$c_e = false;
                    if($j===1) break;
        		}

        		if($c_s && $c_e){
        			$cal[$i][$j] = ['day'=>$n, 'date'=>date("Y-m-$n", $time)];
        			$n++;
        		}else{
        			$cal[$i][$j] = ['day'=>'', 'date'=>''];
        		}
        		
        	}        	
        }
        return $cal;
	}

    /**
     * 获取老师是否可排课状态
     * @param  string $time   [description]
     * @param  int $amount 当日已安排或已上课次数
     * @param  int $canClassTimes 当日可排课次数
     * @return int         1:不可排果  2：已排满 3：可预约
     */
    function getArragementStatus($time, $amount, $canClassTimes){
        if(!is_numeric($time)) $time = strtotime($time);
        $theDay = date('N', $time); //星期几；
        $theMonth = date('n', $time); //

        $status = 3;
        if(date('Ymd')>date('Ymd', $time) || empty($canClassTimes)) {
            $status = 1;
        } else {
            if($theMonth>=7 && $theMonth<9) {
                if($amount>=4) {
                    $status = 2;
                }
            } else {
                switch($theDay) {
                    case 1:
                        $status = 1;
                    break;

                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        if($amount>=1) {
                            $status = 2;
                        }
                    break;

                    case 6:
                    case 7:
                        if($amount>=5) {
                            $status = 2;
                        }
                    break;
                }
            }
        }

        return $status;
    }
}
<?php

namespace Modules\Teacher;
use Modules\Teacher\TeacherClient;

class Sync {
	const HEAD_IMG_API = 'http://t.zy.com/teacher/headimages?tIds=';
	public static function teacherInfoSync() {
		$client = TeacherClient::client();

		$page = 1;
		$limit = 60; //受到get请求获取地址限制，limit最大只能设60;
		$startAt 	= date('Y-m-d H:i:s');
		$city = 80;
		$i = 0;
		while(1) {
			$params = array('cityNid'=>$city, 'pageIndex'=>$page, 'pageSize'=>$limit);
			$res = $client->__soapCall('GetNSB_TeacherModel', array('parameters'=>$params));
			$page++;
			$save = [];//需要保存的数据
			$uuids = []; //教师的UUID;
			$headImgs = []; //头像存放地址

			if(!empty($res->GetNSB_TeacherModelResult->NSB_TeacherModel)) {
				//var_export($res->GetNSB_TeacherModelResult);exit;
				foreach($res->GetNSB_TeacherModelResult->NSB_TeacherModel as $item){
					//科目数据
					$subject  = array();
					if(is_array($item->Subject->Teacher_Subject)) {
						foreach($item->Subject->Teacher_Subject as $sub) {
							$subject[] = $sub->SubjectNid;
						}
					}elseif(!empty($item->Subject->Teacher_Subject)){
						$subject[] = $item->Subject->Teacher_Subject->SubjectNid;
					}

					//班级数据
					$grade = array();
					$fee = $max_fee = 0;
					$school_types = array(); //学段
					if(is_array($item->Grade->Teacher_Grade)) {
						foreach($item->Grade->Teacher_Grade as $grd) {
							$_tmpgrade = '';
							if(count($subject)==1) { //过滤初高中单科中的小学学段
								if(in_array($subject[0], range(6, 11))){
									if($grd->GradeNid>6){
										$_tmpgrade = $grd->GradeNid;
									}
								}else{
									$_tmpgrade = $grd->GradeNid;
								}								
							}else{
								$_tmpgrade = $grd->GradeNid;
							}

							if(!empty($_tmpgrade)) {
								$grade[] = $_tmpgrade;

								//学段处理
								if(in_array($_tmpgrade, range(1,6))){
									$school_types[3] = '';
								}elseif(in_array($_tmpgrade, range(7,9))){
									$school_types[2] = '';
								}elseif(in_array($_tmpgrade, range(10,12))){
									$school_types[1] = '';
								}
							}

							if($fee==0){
								$fee = $grd->PeriodPrice;
							}else{
								$fee = min($fee, $grd->PeriodPrice);
							}
							
							$max_fee = max($fee, $grd->PeriodPrice);
						}
					}elseif(!empty($item->Grade->Teacher_Grade)){
						$grade[] = $item->Grade->Teacher_Grade->GradeNid;
						$fee = $item->Grade->Teacher_Grade->PeriodPrice;
						$max_fee = $item->Grade->Teacher_Grade->PeriodPrice;
					}

					//标签 //介绍
					$tags  = $intro = array();
					if(is_array($item->Attribute->Teacher_Attribute)) {
						foreach($item->Attribute->Teacher_Attribute as $sub) {
							if(isset($sub->TeacherAttributeID) && $sub->TeacherAttributeID==1){
								$tags[] = $sub->Content;
							}

							if(isset($sub->TeacherAttributeID) && $sub->TeacherAttributeID==2){
								$intro[] = $sub->Content;
							}
						}
					}elseif(!empty($item->Attribute->Teacher_Attribute)){
						if($item->Attribute->Teacher_Attribute->TeacherAttributeID==1){
							$tags[] = $item->Attribute->Teacher_Attribute->Content;
						}
						if($item->Attribute->Teacher_Attribute->TeacherAttributeID==2){
							$intro[] = $item->Attribute->Teacher_Attribute->Content;
						}						
					}

					//培训中心
					$trainingCenter  = array();
					if(is_array($item->TrainingCenter->Teacher_TrainingCenter)) {
						foreach($item->TrainingCenter->Teacher_TrainingCenter as $sub) {
							$trainingCenter[] = $sub->TrainingCenterNid;
						}
					}elseif(!empty($item->TrainingCenter->Teacher_TrainingCenter)){
						$trainingCenter[] = $item->TrainingCenter->Teacher_TrainingCenter->TrainingCenterNid;
					}

					$district = \CFG::teacher('trainingCenter', $trainingCenter[0], 'district');
					$save[$item->TeacherNid] = array(
						'id' 	=> $item->TeacherNid,
						'name'	=> $item->TeacherName,
						'exp_age'	=> $item->SchoolAge,
						'subject'	=> implode(',', $subject),
						'grade'		=> implode(',', $grade),
						//'short_intro'	=> $item->TeachFeature,
						//'feature'	=> implode('<br />', $intro),
						//'star'		=> $item->Level_ID,
						'city'		=> $item->CityNid,
						'city_name'	=> $item->CityName,
						'fee'		=> $fee,
						'max_fee'	=> $max_fee,
						'venue' 	=> implode(',', $trainingCenter),
						'district'	=> $district,
						'district_name' => \CFG::teacher('location', 'province', 19, 'city', $city, 'district', $district),
						//'tags'		=> implode(',', $tags),
						//'gender'	=> $item->Sex?'male':'female',
						'uuid'		=> $item->OTeacherID,
						//'school_types' => implode(',', array_keys($school_types)),
						//'tel'		=> $item->MobilePhone,
						);
					$uuids[$item->TeacherNid] = $item->OTeacherID;

					$i++;
				}				

				//获取头像地址
				/*if($uuids) {
					$data = json_decode(file_get_contents(self::HEAD_IMG_API.implode(',', $uuids)), true);
					if(!empty($data['data']) && is_array($data['data'])) {
						foreach($data['data'] as $img){
							$headImgs[$img['tId']] = $img['imageUrl'];
						}
					}
				}*/

				foreach($save as $TeacherNid=>$item){
					if(!empty($headImgs[$item['uuid']])) {
						//$item['headimg'] = $headImgs[$item['uuid']];
					}

					$oldInfo = \F::api('/Teacher/Teacher/get', array('id'=>$TeacherNid,
																		'_useFormat'=>false));

					if($oldInfo && !isset($oldInfo['errno'])) {
						$rs = \F::api('/Teacher/Teacher/update', $item);
					}else{
						$rs = \F::api('/Teacher/Teacher/create', $item);
					}
				}
			}else{
				break;
			}
		}

		$finishAt 	= date('Y-m-d H:i:s');
		return array('startAt'=>$startAt, 'finishAt'=>$finishAt, 'process'=>$i);
	}
}
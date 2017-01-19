<?php
namespace Modules\Huodong\Match;

use Service\ThirdParty\Facepp\Facepp;

class Match {
	private $result = [];
	private $method = 'facepp';

	public function facepp($face1, $face2) {
		$cmpObj = new Facepp(\CFG::Huodong('facepp', 'api_key'), \CFG::Huodong('facepp', 'api_secret'));

		$params = [
			'url'	=>\F::imageUrl($face1, '180_180'),
			'mode'	=>'oneface',
		];
		$f1 = $this->faceppResponse($cmpObj->execute('/detection/detect', $params));
		$params = [
			'url'	=>\F::imageUrl($face2, '180_180'),
			'mode'	=>'oneface',
		];
		$f2 = $this->faceppResponse($cmpObj->execute('/detection/detect', $params));

		if(!empty($f1['face'][0]['face_id']) && !empty($f2['face'][0]['face_id'])) {
			$rs = $cmpObj->execute('/recognition/compare',
				['face_id1'=>$f1['face'][0]['face_id'], 'face_id2'=>$f2['face'][0]['face_id']]);

			$this->result = $this->faceppResponse($rs);
		}
		return $this;
	}

	/**
	 * 设置对比提供商
	 * @param  [type] $method facepp,baidu(未加)
	 * @return [type]         [description]
	 */
	public function useMethod($method) {
		$this->method = $method;
		return $this;
	}

	public function compare($face1, $face2) {
		$method = $this->method;
		$this->$method($face1, $face2);
		return $this;
	}

	public function getResult() {
		return $this->result;
	}

	/**
	 * 解释facepp返回结果
	 * @param  [type] $response [description]
	 * @return [type]           [description]
	 */
	private function faceppResponse($response) {
		$return = [];
		if($response['http_code'] == 200) {
			$return = json_decode($response['body'], 1);
		}

		return $return;
	}
}

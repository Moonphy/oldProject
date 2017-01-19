<?php
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 后台ajax请求管理
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

class UploadController extends AdminCommonController
{

	/**
	 * 关闭自动显示视图
	 *
	 */
	public function init()
	{
		Yaf_Dispatcher::getInstance()->disableView();
	}

	public function html5UploadAction()
	{
		$dosubmit = V('P:dosubmit');
		$swf_auth_key = V('P:swf_auth_key');
		$SWFUPLOADSESSID = V('P:SWFUPLOADSESSID');
		$watermark = V('P:watermark',false);
		$thumb_width = V('P:thumb_width',200);
		$thumb_height = V('P:thumb_height',150);
		$type = V('P:type', 1);
		$path = V('P:path', false);
		$diff = V('P:diff', 1);
		$callback  = V('r:callback');

		$thumb_width_height = [

			/*['thumb_width' => $thumb_width,
			'thumb_height' => $thumb_height],

			['thumb_width' => 100,
			'thumb_height' => 100],*/
		];

		$return = $this->_swfUploadFiles('Filedata', $type, $path, $thumb_width_height, $diff);
		if(isset($return['errno']) && $return['errno']){
			F::ajaxRst(false, $return['errno'], $return['msg'], false, $callback);
		} else {
			F::ajaxRst($return);
		}
	}

	/**
	 * 处理swf上传功能
	 *
	 * @param string $field 上传控件字段
	 * @param string|int $type 图片所属类型
	 *
	 * @return array
	 */
	private function _swfUploadFiles($field, $type = 1,$path = false,
	                                 array $thumb_width_height,
	                                 $diff = false)
	{
		//上传文件
		$upload = NY('Upload');

		$file = $upload->getName($path);


		$ret = $upload->uploadFile($field, $file);
		$info = $upload->getUploadFileInfo();
		if ($info['errcode'] != 0) {
			return array('errno' => $info['errcode'], 'msg' => $info['errmsg']);
		}

		$file_url = W_BASE_HTTP. '/data/uploads/'.$info['webpath'];
		$file_uri = $info['webpath'];
		$show_name = $_FILES[$field]['name'];
		$file_ext = $info['extension'];

		if($diff == 2){
			return array('errno' => 0,
				'url' => $file_url,
				'uri'=>$file_uri,
				'savepath' => $info['savepath'],
				'key'=>md5($file_uri),
				'name'=>$show_name,
				'ext'=>$file_ext);
		}

		//加水印
		/*
		if(in_array($file_ext, array('gif', 'jpg', 'jpeg', 'png'))) {
			$gd_image = NY('images');
			$gd_image->loadFile($info['savepath'])->waterMark(PUBLIC_PATH.'/img/watermark.png', 'right','bottom')->save($info['savepath']);
		}
		 */

		$gd_image = NY('images');

		foreach ($thumb_width_height as $thumb_info) {

			$thumb_width = $thumb_info['thumb_width'];
			$thumb_height = $thumb_info['thumb_height'];

			//缩略图
			$file_path = $info['savepath'];

			$width = $thumb_width == 1600 ? 80 : $thumb_width;
			$height = $thumb_height == 1600 ? 80 : $thumb_height;

			$thumb_file = UPLOAD_PATH.'/'.$info['savename'].'_'.$width.'_'.$height.'.'.$info['extension'];
			$gd_image->loadFile($file_path)->thumbnail($width, $height, true, false, $thumb_file);

		}

		return array('errno' => 0,
			'url' => $file_url,
			'uri'=>$file_uri,
			'savepath' => $info['savepath'],
			'key'=>md5($file_uri),
			'name'=>$show_name,
			'ext'=>$file_ext);
	}

	/**
	 *图片剪切
	 *
	 **/
	 public function cropAction()
	 {
		//回调函数
        $callback = V('G:callback') ? V('G:callback') : 'swfu_callback';

		//所属类型, 默认是讲座
		$preview = V('G:preview') ? V('G:preview') : '';

		//存放目录
		$input = V('G:input') ? V('G:input') : '';
		 $picurl = V('r:picurl');

		if (isset($picurl) && !empty($picurl)) {
			$params = array('picurl' => $picurl,
				'input' => $input,
				'preview' => $preview,
				'callback' => $callback,
		);
            $this->display('picCropV2',$params);
        }


	 }


	/**
	 * ke编辑器上传图片
	 *
	 *
	 */
	public function keUploadJsonAction()
	{
		$upload = NY('Upload');

		//是否加水印
		$watermark = V('P:watermark', false);
		$watermarkstatus = V('P:watermarkstatus', 9);
		$watermarktrans = V('P:watermarktrans', 80);

		$watermarkPath = PUBLIC_PATH.'/img/watermark.png';
		$watermarkX	= 'right';
		$watermarkY = 'bottom';

		$field = 'file';

		//有上传文件时
		if (empty($_FILES[$field]['name']) === false) {
			$batchFileData = [];
			$ret = []; //最终结果存放

			if(is_array($_FILES[$field]['name'])) {
				$batchFileData = $upload->diverseBatchUploadData($_FILES[$field]);
			}

			if($batchFileData) {
				foreach($batchFileData as $each) {
					$file = $upload->getName('editor_tinymce');
					$upload->uploadFileByTMPInfo($each, $file);
					$info = $upload->getUploadFileInfo();
					if(empty($info['errcode'])){
						$this->watermark($info['savepath'], $watermarkX, $watermarkY, $watermarkPath, $watermarktrans);
					}
					$ret[] = $this->format($info);
				}
			} else {
				$file = $upload->getName('editor_tinymce');
				$upload->uploadFile($field, $file);
				$info = $upload->getUploadFileInfo();
				if(empty($info['errcode'])){
					$this->watermark($info['savepath'], $watermarkX, $watermarkY, $watermarkPath, $watermarktrans);
				}
				$ret = $this->format($info);
			}

			echo json_encode($ret);
		}

	}

	/**
	 * 格式化结果
	 * @param  [type] $info [description]
	 * @return [type]       [description]
	 */
	public function format($info) {
		if ($info['errcode'] != 0) {
			$return = array('error' => $info['errcode'], 'msg' => $info['errmsg']);
		} else {
			$file_url = W_BASE_HTTP. '/data/uploads/'.$info['webpath'];
			$file_uri = '/data/uploads/'.$info['webpath'];
			$show_name = $info['filename'];
			$file_ext = $info['extension'];


			$return = array('error' => 0,
				'url' => $file_url,
				'uri'=>$file_uri,
				'key'=>md5($file_uri),
				'name'=>$show_name,
				'ext'=>$file_ext,
				'msg' => null);
		}
		return $return;
	}

	/**
	 * 加水印
	 * @param  [type]  $imagePath      [description]
	 * @param  string  $watermarkX     [description]
	 * @param  string  $watermarkY     [description]
	 * @param  [type]  $watermarkPath  [description]
	 * @param  integer $watermarktrans [description]
	 * @return [type]                  [description]
	 */
	public function watermark($imagePath, $watermarkX='right', $watermarkY='bottom', 
							$watermarkPath='', $watermarktrans=80) {

		if(!is_file($imagePath)) return false;
		if(!empty($watermarkPath) && !is_file($watermarkPath)) return false;
		static $gd_image = NULL;
		if(!is_object($gd_image)) {
			$gd_image = NY('images');
		}
		return $gd_image->loadFile($imagePath)
					->waterMark($watermarkPath, $watermarkX, $watermarkY, $watermarktrans)->save($imagePath);

	}

}

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

class Weixin_Match_UploadController extends Yaf_Controller_Abstract
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
		$watermark = V('P:watermark',false);
		$path = 'match'; //V('P:path', false);
		$diff = V('P:diff', 1);
		$callback  = V('r:callback');

		$thumb_width_height = [

			/*['thumb_width' => $thumb_width,
			'thumb_height' => $thumb_height],

			['thumb_width' => 100,
			'thumb_height' => 100],*/
		];

		$return = $this->_swfUploadFiles('file', $path, $thumb_width_height, $diff);
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
	private function _swfUploadFiles($field,$path = false,
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

		//加水印
		/*
		if(in_array($file_ext, array('gif', 'jpg', 'jpeg', 'png'))) {
			$gd_image = NY('images');
			$gd_image->loadFile($info['savepath'])->waterMark(PUBLIC_PATH.'/img/watermark.png', 'right','bottom')->save($info['savepath']);
		}
		 */
		if($diff == 2){
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
		}

		return array('errno' => 0,
			'url' => $file_url,
			'uri'=>$file_uri,
			//'savepath' => $info['savepath'],
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

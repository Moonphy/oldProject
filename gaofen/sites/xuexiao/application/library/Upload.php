<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 *
 * 上传类
 *
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/

class Upload {
	//上传文件的最大值 ,M为单位
	private $maxSize = -1;

	//允许上传的文件类型
	private $allowTypes = 'jpg,jpeg,gif,png,doc,docx,xls,xlsx,ppt,pptx,pdf,txt,zip';
	//上传文件保存路径 例如'../var'
	private $fileInfo = array(
						'savename' => '',//保存名称
						'savepath' => '',//保存的路径
						'webpath' => '',//相对路径
						'extension' => '',//保存的扩展名
						'errmsg' => '',
						'errcode' => '',
						'field' => 'uploadfile',
						'size' => ''
						);
	private $error = '';
	private $errcode = 0;

	/**
	 *
	 * 上传文件
	 * @param unknown_type $field
	 * @return
	 */
	public function uploadFile($field,	$fileName ,$filePath=false, $fType='jpg,jpeg,gif,png,doc,docx,xls,xlsx,ppt,pptx,pdf,txt,zip',	$maxSize=MAX_UPLOAD_FILE_SIZE){

		$this->fileInfo['savename'] = $fileName;
		$this->allowTypes = $fType ? $fType : $this->allowTypes;
		$this->maxSize = $maxSize;

		if ($field) {
			$this->fileInfo['field'] = $field;
		}
		if(!$filePath){
			//$filePath = UPLOAD_PATH .'/pic/';
			$filePath = UPLOAD_PATH . '/';
		}
        if(!is_dir($filePath)) {
            // 检查目录是否编码后的
        	if(!mkdir($filePath)){
               $this->fileInfo['errmsg']  =  '上传的文件目录'.$filePath.'不存在' ;
               $this->fileInfo['errcode'] = 40050;
               return false;
            }
        }else{
        	if(!is_writable($filePath)){
        		$this->fileInfo['errmsg']  =  '上传的文件目录'.$filePath.'不可写';
        		$this->fileInfo['errcode'] = 40050;
        		return false;
        	}
        }
        $file = $_FILES[$this->fileInfo['field']];
		$this->fileInfo['filename'] = $file['name'];

        if(!$this->_check($file)){
        	return false;
        }
        $this->fileInfo['errcode'] = 0;
        $this->fileInfo['errmsg'] = '文件上传成功';
        $this->fileInfo['extension'] = $this->_getExt($file['name']);
        $this->fileInfo['savepath'] = $filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];

        $this->fileInfo['localpath'] = $filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];

		/*
        $this->fileInfo['webpath'] = W_BASE_HTTP
        							.W_BASE_URL_PATH
         							.$filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];
		 */
        $this->fileInfo['webpath'] = $this->fileInfo['savename'].'.'.$this->fileInfo['extension'];
		$this->fileInfo['size'] = $file['size'];

        $io = NY('Fileio');
        $io->write($this->fileInfo['savepath'],file_get_contents($file['tmp_name']));
        return true;
	}

	/**
	 * [uploadFileByTMPInfo description]
	 * @param  [type]  $field    [description]
	 * @param  [type]  $fileName [description]
	 * @param  boolean $filePath [description]
	 * @param  string  $fType    [description]
	 * @param  [type]  $maxSize  [description]
	 * @return [type]            [description]
	 */
	public function uploadFileByTMPInfo($fileTempInfo, $fileName, $filePath=false, $fType='jpg,jpeg,gif,png,doc,docx,xls,xlsx,ppt,pptx,pdf,txt,zip',	$maxSize=MAX_UPLOAD_FILE_SIZE){

		$this->fileInfo['savename'] = $fileName;
		$this->allowTypes = $fType ? $fType : $this->allowTypes;
		$this->maxSize = $maxSize;

		if(!$filePath){
			//$filePath = UPLOAD_PATH .'/pic/';
			$filePath = UPLOAD_PATH . '/';
		}
        if(!is_dir($filePath)) {
            // 检查目录是否编码后的
        	if(!mkdir($filePath)){
               $this->fileInfo['errmsg']  =  '上传的文件目录'.$filePath.'不存在' ;
               $this->fileInfo['errcode'] = 40050;
               return false;
            }
        }else{
        	if(!is_writable($filePath)){
        		$this->fileInfo['errmsg']  =  '上传的文件目录'.$filePath.'不可写';
        		$this->fileInfo['errcode'] = 40050;
        		return false;
        	}
        }
        $file = $fileTempInfo;
		$this->fileInfo['filename'] = $file['name'];

        if(!$this->_check($file)){
        	return false;
        }
        $this->fileInfo['errcode'] = 0;
        $this->fileInfo['errmsg'] = '文件上传成功';
        $this->fileInfo['extension'] = $this->_getExt($file['name']);
        $this->fileInfo['savepath'] = $filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];

        $this->fileInfo['localpath'] = $filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];

		/*
        $this->fileInfo['webpath'] = W_BASE_HTTP
        							.W_BASE_URL_PATH
         							.$filePath
         							.$this->fileInfo['savename']
         							.'.'.$this->fileInfo['extension'];
		 */
        $this->fileInfo['webpath'] = $this->fileInfo['savename'].'.'.$this->fileInfo['extension'];
		$this->fileInfo['size'] = $file['size'];

        $io = NY('Fileio');
        $io->write($this->fileInfo['savepath'],file_get_contents($file['tmp_name']));
        return true;
	}

	/**
	 *
	 * 转换$_FILES 数据结构
	 * 由
	 * $_FILES['field'] = [
	 * 		'name' => [
	 * 			0 => 'file1',
	 * 			1 => 'file2'
	 * 		],
	 * 		'type' => [
	 * 			0 => 'text/plain',
	 * 			1 => 'text/html',
	 * 		]
	 * ]
	 *
	 * 变为：
	 * 
	 * $_FILES['field'] = [
	 * 		0 => [
	 * 			'name' => 'file1',
	 * 			'type' => 'text/plain'
	 * 		],
	 * 		1 => [
	 * 			'name' => 'file2',
	 * 			'type' => 'text/html',
	 * 		]
	 * ]
	 * 
	 * 
	 */
	public function diverseBatchUploadData($vector) {
		$result = array(); 
	    foreach($vector as $key1 => $value1) 
	        foreach($value1 as $key2 => $value2) 
	            $result[$key2][$key1] = $value2; 

    	return $result; 
	}


	/**
	 * 文件
	 *
	 * @return
	 */
	public function getName($subDir = '') {
		$fileName = date('Y/m/').date('Ymdhis').uniqid();
		if ($subDir) {
			$fileName = $subDir.'/'.$fileName;
		}
		return $fileName;
	}

	/**
	 *
	 * 是否符合类型
	 * @param unknown_type $type
	 * @return
	 */
 	private function _checkType($filename)
    {
        if(!empty($this->allowTypes)) {
        	$ext = $this->_getExt($filename);
            return in_array(strtolower($ext), explode(',',$this->allowTypes));
        }
        return true;
    }

	/**
	 *
	 * 是否超过最大尺寸
	 * @param unknown_type $size
	 * @return
	 */
	private function _checkSize($size){
		 return !($size > $this->maxSize*1024*1024) || (-1 == $this->maxSize*1024*1024);
	}

	/**
	 *
	 * 检查是否为HTTP POST 上传的
	 * @param 文件名
	 * @return
	 */
	private function _checkUpload($filename){
		return is_uploaded_file($filename);
	}

	/**
	 *
	 * 返回上传文件的信息
	 * @return
	 */
	public function getUploadFileInfo(){
		return $this->fileInfo;
	}

	/**
	 *
	 * 获取错误信息描述
	 * @return 返回错误描述
	 */
	public function getErrorMsg(){
		return $this->fileInfo['errmsg'];
	}

	/**
	 * 获取错误代码
	 * @return 返回错误码
	 */
	public function getErrorCode(){
		return $this->fileInfo['errcode'];
	}

	/**
	 *
	 * 检查上传中可能存在错误
	 * @param $file文件信息
	 * @return
	 */
	private function _check($file) {
        if($file['error']!== 0) {
            //文件上传失败
            //捕获错误代码
            $this->_error($file['error']);
            return false;
        }
        //文件上传成功，进行自定义规则检查
        //检查文件大小
        if(!$this->_checkSize($file['size'])) {
            $this->fileInfo['errmsg'] = '超出文件上传大小的最大限制';
            $this->fileInfo['errcode'] = 40012;
            return false;
        }
        //检查文件后缀名类型
        if(!$this->_checkType($file['name'])) {
            $this->fileInfo['errmsg'] = '文件的后缀名不允许上传';
            $this->fileInfo['errcode'] = 40013;
            return false;
        }
        //检查是否合法上传
        if(!$this->_checkUpload($file['tmp_name'])) {
            $this->fileInfo['errmsg'] = '非法上传';
            $this->fileInfo['errcode'] = 40050;
            return false;
        }
        return true;
    }

	/**
	 *
	 * $_FILES默认的错误信息
	 * @param unknown_type $errorNo
	 * @return
	 */
	private function _error($errorNo)
    {
         switch($errorNo) {
            case 1:
                $this->fileInfo['errmsg'] = '上传的文件超过了 php.ini 中 upload_max_filesize 选项限制的值';
                $this->fileInfo['errcode'] = 40012;
                break;
            case 2:
                $this->fileInfo['errmsg'] = '上传文件的大小超过了 HTML 表单中 MAX_FILE_SIZE 选项指定的值';
                $this->fileInfo['errcode'] = 40012;
                break;
            case 3:
                $this->fileInfo['errmsg'] = '文件只有部分被上传';
                $this->fileInfo['errcode'] = 40010;
                break;
            case 4:
                $this->fileInfo['errmsg'] = '没有文件被上传';
                $this->fileInfo['errcode'] = 40010;
                break;
            case 6:
                $this->fileInfo['errmsg'] = '找不到临时文件夹';
                $this->fileInfo['errcode'] = 40050;
                break;
            case 7:
                $this->fileInfo['errmsg'] = '文件写入失败';
                $this->fileInfo['errcode'] = 40050;
                break;
            default:
                $this->fileInfo['errmsg'] = '未知上传错误！';
                $this->fileInfo['errcode'] = 40050;
        }
        return ;
    }

    /**
     *
     * 获取上传的扩展名
     * @param $filename
     * @return
     */
	private function _getExt($filename){
        $pathinfo = pathinfo($filename);
        return $pathinfo['extension'];
    }
}
?>

<?php
class ThumbnailController extends Yaf_Controller_Abstract {
	
	private $_cropObj;
	private $_confObj;
	private $_album;
	
	public function init() {
		Yaf_Dispatcher::getInstance()->disableView();
		$this->_cropObj = new Images();
		$this->_confObj = new Yaf_Config_Ini(CONFIG_PATH.'/thumbnail.ini');
	}
	
	public function setAlbum($album) {
		$this->_album = $album;
	}
	
	public function getAlbum(){
		return $this->_album;
	}
	
	/**
	* 图片生成
	* 
	* @param mixed $album upload下目录名，也就是
	* @param mixed $cfgKey 
	*/
	public function showAction($album=NULL, $cfgKey=NULL) {
		$path = Yaf_Dispatcher::getInstance()->getRequest()->get('path');		
		
		$config = $this->getThumbConf($path, $album, $cfgKey);
		if($path && !empty($config) && is_file($config->original)){			
			if($config->resize){ //是否能正常生成缩略图
				$this->_cropObj->loadFile($config->original);			
				
				$_mode = ($config->mode==1)?1:0;
				if($config->width>0 && $config->height>0) {
					$this->_cropObj->resize($config->width, $config->height, $_mode);
				}				
				$this->_cropObj->setQuality($config->quality);
				
				if($config->mode==2 && $config->width>0 && $config->height>0){
					$x = ($this->_cropObj->getWidth()>$config->width)?ceil(($this->_cropObj->getWidth()-$config->width)/2):0;
					$y = ($this->_cropObj->getHeight()>$config->height)?ceil(($this->_cropObj->getHeight()-$config->height)/2):0;
					$this->_cropObj->crop($x, $y, $config->width, $config->height);
				}
				
				if(!empty($config->watermark)) {
					$this->_cropObj->waterMark($config->wm_img, $config->wm_hp, $config->wm_vp, 30);
				}
				
				$this->_cropObj->save($config->target, 'jpg');
				$this->_cropObj->output('jpg');
				return;
			}elseif(empty($config->cfgKey) && is_file($config->target)){
				$attr = getimagesize($config->target);
				header("Content-type:".$attr['mime']); 
				readfile($config->target);
				return;
			}
		}
		header("HTTP/1.1 404 Not Found", true, 404);exit;
	}
	
	public function getThumbConf($path, $album, $cfgKey) {		
		$path	= str_replace('\\', '/', $path);
		$path	= ltrim($path, '/');
		if($path && empty($album) && (strripos($path, '/')!==stripos($path, '/') || strpos($path, '/')!==false)){			
			$album 	= str_replace(strchr($path, '/'), '', $path);
			$path 	= ltrim(strchr($path, '/'), '/');
			$filename = ltrim(strrchr($path, '/'), '/');
			$dir	= str_replace($filename, '', $path);
		}else{			
			$path = ltrim($path, '/');
			$filename = ltrim(strrchr($path, '/'), '/');
			$dir = str_replace($filename, '', $path);
		}
		
		if(empty($cfgKey)){
			if(false!==strpos($filename, '.')) {//处理带扩展名路径
				$cfgKey = strchr($filename, '_');
				$cfgKey = str_replace(strchr($cfgKey, '.'), '', $cfgKey);
			}else{
				$cfgKey = strchr($filename, '_');
			}
			$cfgKey = substr($cfgKey, 1);
		}
		$cfgKey = strtolower($cfgKey);
		
		$row = @$this->_confObj->thumbnail->get($album)->$cfgKey;
		$thumbnail_dir = $this->_confObj->path->thumbnail_dir;
		$original_dir = $this->_confObj->path->original_dir;
		
		$diffDir = false;
		if($thumbnail_dir!=$original_dir && empty($cfgKey)){
			$row = @$this->_confObj->thumbnail->get('common');
		}
		
		$oFilename = str_replace($cfgKey?'_'.$cfgKey:'', '', $filename);
		$tFilename = $row?$filename:$oFilename;
		
		$config = array();
		$config['album']	= $album;
		$config['cfgKey'] 	= $cfgKey;
		$config['fileDir']	= $dir;
		$config['tFilename']	= $tFilename;
		$config['oFilename']	= $oFilename;
		$config['thumbnail_dir']	= $thumbnail_dir;
		$config['original_dir']		= $original_dir;
		$config['target']	= str_replace('//', '/', $thumbnail_dir.'/'.$album.'/'.$dir.'/'.$tFilename);
		$config['original']	= str_replace('//', '/', $original_dir.'/'.$album.'/'.$dir.'/'.$oFilename);
		
		$config['resize'] = false;
		if(($row && is_string($row))) {
			$config['resize'] = true;
			@list($config['width'], $config['height'], $config['mode'], $config['watermark'], $config['quality']) = explode(':', $row);
			if(empty($config['width'])){
				$config['width'] = 0;
			}
			
			if(empty($config['height'])){
				$config['height'] = 0;
			}
			
			if(empty($config['quality'])){
				$config['quality'] = 80;
			}
			
			if(empty($config['mode'])){
				$config['mode'] = 0;
			}
			
			if(!empty($config['watermark'])){
				$_ex = array('t'=>'top', 'l'=>'left', 'r'=>'right', 'c'=>'center', 'b'=>'bottom');
				$_wm = $config['watermark'];
				$_wm_img = $this->_confObj->watermark->toArray();
				$config['wm_img']	= $_wm_img[@$_wm{0}];
				$config['wm_vp']	= @$_wm{1}?$_ex[strtolower($_wm{1})]:$_ex['c'];
				$config['wm_hp']	= @$_wm{2}?$_ex[strtolower($_wm{2})]:$_ex['c'];
			}
		}
		return (object)$config;
	}
	
	
}

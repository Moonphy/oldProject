<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 项目名称:  高分CMS
 * 建立日期:  2013年02月25日
 * 
 * 文件操作类
 * 
 * @作者 heli <heli@gaofen.com>
 * @版本 $Id:
 **/


class File {
	var $err 	 = "";
	var $logType = 'io';
	
	function __construct()
	{
	}
	
	function write($file, $data, $append = false)
	{
        $file = addslashes($file);
		if (!file_exists($file)){
			if (!$this->mkdir(dirname($file))) {
				return false;
			}
		}
		$len  = false;
		$mode = $append ? 'ab' : 'wb';
		$fp = @fopen($file, $mode);
		if (!$fp) {
			exit("Can not open file $file !");
		}
		flock($fp, LOCK_EX);
		$len = @fwrite($fp, $data);
		flock($fp, LOCK_UN);
		@fclose($fp);
		
		return $len;
	}
	
	function read($file) 
	{
		if (!file_exists($file)){
			return false;
		}
		if (!is_readable($file)) {
			return false;
		}
		
		$result = '';
		if (function_exists('file_get_contents')){
			$result = file_get_contents($file);
		}else{
			$result = (($contents = file($file))) ? implode('', $contents) : false; 
		}
		
		return $result;
	}
	
	/// get files and dirs not use recursion
	function ls($dir,$r=false,$info=false) 
	{
		if (empty($dir)) $dir = '.';
		if(!file_exists($dir) || !is_dir($dir)){return false;}
		$fs = array();
		$ds = array($dir);
		while(count($ds)>0){
			foreach($ds as $i=>$d){
				unset($ds[$i]);
				$handle = opendir($d);
				while (false !== ($item = readdir($handle))) {
					if ($item == '.' || $item == '..') continue;
					$fp = ( $d=='.' || $d=='.\\' ||  $d=='./'  ) ? $item :  $d.DIRECTORY_SEPARATOR.$item;
					$t =  is_file($fp) ? 'f' : (is_dir($fp) ? 'd' : 'o');
					if (is_dir($fp) && $r) { $ds[]=$fp; }
					$fs[] = ($info ? array($t,$fp,$this->info($fp)) : array($t,$fp));
				}
			}
		}

		return $fs;
	}
	
	
	function mkdir($path) 
	{
		$rst = true;
		if (!file_exists($path)) {
			$this->mkdir(dirname($path));
			$rst = @mkdir($path, 0777);
		}
		
		return $rst;
	}
	
	
	function rm($path)
	{
		$path = rtrim($path,'/\\ ');
		if (!is_dir($path)) { 
			return @unlink($path);
		}
		if (!$handle= opendir($path)) { 
			return false; 
		}
		
		while(false !==($file=readdir($handle))) {
			if($file=="." || $file=="..") continue ;
			$file=$path .DIRECTORY_SEPARATOR. $file;
			if(is_dir($file)) { 
				$this->rm($file);
			} else {
				if(!@unlink($file)) {
					return false;
				}
			}
		}
		
		closedir($handle);
		if(!rmdir($path)){
			return false;
		}
		
		return true;
	}
	
	function info($path=".", $key=false) 
	{
		$path = realpath($path);
		if (!$path) false;
		$result = array(
			"name"		=> substr($path, strrpos($path, DIRECTORY_SEPARATOR)+1),
			"location"	=> $path,
			"type"		=> is_file($path) ? 1 : (is_dir($path) ? 0 : -1),
			"size"		=> filesize($path),
			"access"	=> fileatime($path),
			"modify"	=> filemtime($path),
			"change"	=> filectime($path),
			"read"		=> is_readable($path),
			"write"		=> is_writable($path)
			);
		clearstatcache();
		
		return $key ? $result[$key] : $result;
	}

	public function dir_path($path)
	{
		$path = str_replace('\\', '/', $path);
		if(substr($path, -1) != '/') $path = $path.'/';
		return $path;
	}

	public function dir_list($path, $exts = '', $list= array())
	{
		$path = $this->dir_path($path);
		$files = glob($path.'*');
		foreach($files as $v)
		{
			$fileext = $this->fileext($v);
			if(!$exts || preg_match("/\.($exts)/i", $v))
			{
				$list[] = $v;
				if(is_dir($v))
				{
					$list = $this->dir_list($v, $exts, $list);
				}
			}
		}
		return $list;
	}

	public function fileext($filename){
		return strtolower(trim(substr(strrchr($filename, '.'), 1, 10)));
	}
	
	
}
?>

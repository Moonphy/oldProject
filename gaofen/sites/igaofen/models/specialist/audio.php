<?php
/**
 * 微信录音处理及合并
 */

if (!defined('IN_ANWSION'))
{
	die;
}

class specialist_audio_class extends AWS_MODEL {

	private $amrPostfix = '.amr';
	private $mp3Postfix = '.mp3';

	public function get_file($media_ids) {
		$media_ids = explode(',', $media_ids);
		$audioData = [];
		foreach($media_ids as $media_id) {
        	$audioData[] = $this->model('openid_weixin_weixin')->get_file($media_id);
        }

        $saveToPath = get_setting('upload_dir').'/specialist/tmp/audiotmp_'.rand(10000, 99999);

        $sourcefile = $this->createAmrFile($saveToPath, $audioData);

		$saveRs = $this->convertAndSaveToMP3($sourcefile);

		$data = file_get_contents( $saveToPath. AWS_APP::config()->get('specialist')->wexin_audio_postfix);

		//unlink($saveToPath.$this->mp3Postfix);
		//unlink($saveToPath.$this->amrPostfix);

		return $data;
		// do here something
	}


	public function convertAndSaveToMP3($fromPath, $toPath='') {
		$toPath = $toPath?:substr($fromPath, 0, -3).'mp3';

		if($fromPath!=$toPath) {
			$cmd = "ffmpeg -y -i $fromPath -acodec mp3 $toPath";
			$rs = system($cmd);

			//下面用到fromPath
			$fromPath = $toPath;
		}
		
		//因为在测试覆盖转换过程中可能会出现问题而不正常，所先转成缓存文件再覆盖
		$tmpPath = $toPath.'.mp3';
		$cmd = "ffmpeg -y -i $fromPath -acodec mp3 -ab 24k -ar 24000 -ac 1 -aq 10 $tmpPath";
		system($cmd);
		$cmd = "mv -f $tmpPath $fromPath";
		system($cmd);
		unlink($tmpPath);

		return $rs !== false;
	}

	public function createAmrFile($path, $audioData) {

		if(count($audioData)>1) {
			$audioData = $this->contact($audioData);
		}else{
			$audioData = $audioData[0];
		}

		$dirname = dirname($path);
        $basename = basename($path);

		if(!is_dir($dirname)) {
        	mkdir($dirname, 0755, true);
        }
        $path .= $this->amrPostfix;
        return file_put_contents($path, $audioData) ? $path:false;
	}

	/**
	 * 获取音频时长
	 * @param  [type] $fromPath [description]
	 * @return [type]           [description]
	 */
	public function getDuration($fromPath) {
		if(!is_file($fromPath)) return false;

		$cmd = "ffmpeg -i $fromPath 2>&1";
		ob_start();
		passthru($cmd);
		$info = ob_get_contents();
		ob_end_clean();

		preg_match('#Duration: ([0-9\:]*)(\.|,)#sim', $info, $result);

		if(isset($result['1'])) {
			return $this->timeToSeconds($result['1']);
		}

		return false;
	}

	/**
	 * 连接音频
	 * @param  array  $audioes [description]
	 * @return [type]         [description]
	 */
	private function contact(array $audioes){

		$tmpfiles = [];

		foreach($audioes as $i=>$audioData) {
			if(empty($audioData)) continue;

			$tmpfiles[$i] = tempnam(sys_get_temp_dir(), 'audio');
			file_put_contents($tmpfiles[$i], $audioData);
		}

		

		$toTmpFile = get_setting('upload_dir').'/specialist/tmp/audiotmp_trunk_'.rand(10000, 99999).$this->amrPostfix;

		$cmd = "ffmpeg -i concat:\"".implode('|', $tmpfiles)."\" -acodec copy -f amr $toTmpFile";
		$rs = system($cmd);

		$data = file_get_contents($toTmpFile);

		foreach($tmpfiles as $_f) {
			unlink($_f);
		}

		unlink($toTmpFile);
		return $data;
	}

	/**
	 * 时分秒合成秒数
	 * @param  string $time 12:23:34 时/分/秒
	 * @return int 总秒数
	 */
	private function timeToSeconds($time) {
		$time = date('H:i:s', strtotime($time));
		return strtotime($time) - strtotime(date('Y-m-d'));
	}
}

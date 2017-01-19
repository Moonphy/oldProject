<?php

namespace Service;

class Sign{

	/**
	 * 生成参数签名, 作验证参数是否完整
	 * @param  array  $data [description]
	 * @param  string $salt 盐值
	 * @return [type]       [description]
	 */
	public static function getSign(array $data, $salt){
		ksort($data);
		$queryString = http_build_query($data);

		$queryString = $queryString."&key=".$salt;
		$sign = md5($queryString);
		$sign = strtoupper($sign);
		return $sign;
	}

	/**
	 * 签名验证，data里必须含有sign字段
	 * @param  array  $data      [description]
	 * @param  [type] $salt      [description]
	 * @param  array  $exceptKey [description]
	 * @return [type]            [description]
	 */
	static function checkSign($data, $salt, array $exceptKey=[]){
		if(!is_array($data)) return FALSE;
		
		$tmpData = $data;
		unset($tmpData['sign']);
		$tmpData = array_diff_key($tmpData, array_fill_keys($exceptKey, ''));
		$sign = static::getSign($tmpData, $salt);//本地签名
		if ($data['sign'] == $sign) {
			return TRUE;
		}
		return FALSE;
	}

	static function xmlToArray($xml){
		return json_decode(json_encode(@simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
	}

	static function arrayToXml($arr)
    {
        $xml = "<xml>";
        foreach ($arr as $key=>$val)
        {
        	 if (is_numeric($val))
        	 {
        	 	$xml.="<".$key.">".$val."</".$key.">"; 

        	 }
        	 else
        	 	$xml.="<".$key."><![CDATA[".$val."]]></".$key.">";  
        }
        $xml.="</xml>";
        return $xml; 
    }

}
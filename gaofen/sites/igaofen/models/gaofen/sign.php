<?php

/**
 * 高分微信订单签名验证
 */

if (!defined('IN_ANWSION'))
{
    die;
}

class gaofen_sign_class{

	/**
	 * 生成参数签名, 作验证参数是否完整
	 * @param  array  $data [description]
	 * @param  string $salt 盐值
	 * @return [type]       [description]
	 */
	public function getSign(array $data, $salt){
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
	public function checkSign($data, $salt, array $exceptKey=[]){
		if(!is_array($data)) return FALSE;
		
		$tmpData = $data;
		unset($tmpData['sign']);
		$tmpData = array_diff_key($tmpData, array_fill_keys($exceptKey, ''));
		$sign = $this->getSign($tmpData, $salt);//本地签名
		if ($data['sign'] == $sign) {
			return TRUE;
		}
		return FALSE;
	}

	public function xmlToArray($xml){
		return json_decode(json_encode(@simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
	}

	public function arrayToXml($arr)
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
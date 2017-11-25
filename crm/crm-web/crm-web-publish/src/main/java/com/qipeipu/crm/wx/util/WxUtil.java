package com.qipeipu.crm.wx.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;

import com.qipeipu.crm.wx.bean.WxConfig;
import com.qipeipu.crm.wx.exception.AesException;

/**
 * @author Gxy
 */
@Slf4j
public class WxUtil {

	public static String getSHA1(String token, String timestamp, String nonce,
			String encrypt) throws AesException {
		try {
			String[] array = { token, timestamp, nonce };
			// 字符串排序
			Arrays.sort(array);

			String str = array[0] + array[1] + array[2];

			// SHA1签名生成
			MessageDigest md = MessageDigest.getInstance("SHA-1");
			md.update(str.getBytes());
			byte[] digest = md.digest();

			StringBuffer hexstr = new StringBuffer();
			String shaHex = "";
			for (int i = 0; i < digest.length; i++) {
				shaHex = Integer.toHexString(digest[i] & 0xFF);
				if (shaHex.length() < 2) {
					hexstr.append(0);
				}
				hexstr.append(shaHex);
			}
			return hexstr.toString();
		} catch (Exception e) {
			log.error("WxUtil.getSHA1", e);
			throw new AesException(AesException.ComputeSignatureError);
		}
	}

	/**
	 * 验证签名
	 *
	 * @param signature
	 * @param timestamp
	 * @param nonce
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static boolean checkSignature(String signature, String timestamp,
			String nonce) throws NoSuchAlgorithmException {
		String[] arr = { WxConfig.getInstance().getServer_token(), timestamp,
				nonce };
		// 将token、timestamp、nonce三个参数进行字典序排序
		Arrays.sort(arr);
		StringBuilder content = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			content.append(arr[i]);
		}
		MessageDigest md = null;
		String tmpStr = null;

		md = MessageDigest.getInstance("SHA-1");
		// 将三个参数字符串拼接成一个字符串进行sha1加密
		byte[] digest = md.digest(content.toString().getBytes());
		tmpStr = byteToStr(digest);

		content = null;
		// 将sha1加密后的字符串可与signature对比，标识该请求来源于微信
		return tmpStr != null ? tmpStr.equals(signature.toUpperCase()) : false;
	}

	/**
	 * 将字节数组转换为十六进制字符串
	 *
	 * @param byteArray
	 * @return
	 */
	private static String byteToStr(byte[] byteArray) {
		String strDigest = "";
		for (int i = 0; i < byteArray.length; i++) {
			strDigest += byteToHexStr(byteArray[i]);
		}
		return strDigest;
	}

	/**
	 * 将字节转换为十六进制字符串
	 *
	 * @param mByte
	 * @return
	 */
	private static String byteToHexStr(byte mByte) {
		char[] Digit = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
				'B', 'C', 'D', 'E', 'F' };
		char[] tempArr = new char[2];
		tempArr[0] = Digit[(mByte >>> 4) & 0X0F];
		tempArr[1] = Digit[mByte & 0X0F];

		String s = new String(tempArr);
		return s;
	}
}
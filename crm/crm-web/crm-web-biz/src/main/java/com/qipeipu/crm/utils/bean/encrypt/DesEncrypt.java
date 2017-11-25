package com.qipeipu.crm.utils.bean.encrypt;

import java.security.Key;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;

/**
 * des加密解密
 *
 * @author jian.chen
 *
 */
public class DesEncrypt {

	private static final Logger logger = Logger.getLogger(DesEncrypt.class);

	Key key;
	Boolean isEnable = true;//是否启用加密
	private String prefix = "";//前缀
	private String suffix = "";//后缀

	public DesEncrypt(String str) {
		setKey(str);// 生成密匙
	}

	public DesEncrypt() {
		setKey("12345678");
	}

	/**
	 * 根据参数生成KEY
	 */
	public void setKey(String strKey) {
		try {
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
			this.key = keyFactory.generateSecret(new DESKeySpec(strKey
					.getBytes("UTF8")));
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new RuntimeException(
					"Error initializing SqlMap class. Cause: " + e);
		}
	}

	public Boolean getIsEnable() {
		return isEnable;
	}

	public void setIsEnable(Boolean isEnable) {
		this.isEnable = isEnable;
	}

	/**
	 * 加密String明文输入,String密文输出
	 */
	public String encrypt(String strMing) {
		byte[] byteMi = null;
		byte[] byteMing = null;
		String strMi = "";
		try {
			byteMing = strMing.getBytes("UTF8");
			byteMi = this.getEncCode(byteMing);
			strMi = Base64.encodeBase64String(byteMi);
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new RuntimeException(
					"Error initializing SqlMap class. Cause: " + e);
		} finally {
			byteMing = null;
			byteMi = null;
		}
		return strMi;
	}

	/**
	 * 解密 以String密文输入,String明文输出
	 *
	 * @param strMi
	 * @return
	 */
	public String decrypt(String strMi) {
		byte[] byteMing = null;
		byte[] byteMi = null;
		String strMing = "";
		try {
			byteMi = Base64.decodeBase64(strMi);
			byteMing = this.getDesCode(byteMi);
			strMing = new String(byteMing, "UTF8");
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new RuntimeException(
					"Error initializing SqlMap class. Cause: " + e);
		} finally {
			byteMing = null;
			byteMi = null;
		}
		return strMing;
	}

	/**
	 * 加密以byte[]明文输入,byte[]密文输出
	 *
	 * @param byteS
	 * @return
	 */
	private byte[] getEncCode(byte[] byteS) {
		byte[] byteFina = null;
		Cipher cipher;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.ENCRYPT_MODE, key,
					SecureRandom.getInstance("SHA1PRNG"));
			byteFina = cipher.doFinal(byteS);
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new RuntimeException(
					"Error initializing SqlMap class. Cause: " + e);
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	/**
	 * 解密以byte[]密文输入,以byte[]明文输出
	 *
	 * @param byteD
	 * @return
	 */
	private byte[] getDesCode(byte[] byteD) {
		Cipher cipher;
		byte[] byteFina = null;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.DECRYPT_MODE, key,
					SecureRandom.getInstance("SHA1PRNG"));
			byteFina = cipher.doFinal(byteD);
		} catch (Exception e) {
			logger.error(e.getMessage());
			throw new RuntimeException(
					"Error initializing SqlMap class. Cause: " + e);
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	public static void main(String args[]) {
		String key = "AuMNjpdVBdVlyAK7QX4ati6k80ome9JI";//UUID.randomUUID().toString().substring(0, 16);
		DesEncrypt des = new DesEncrypt();
		des.setKey(key);
		logger.info("key is:" + key);

		//		String str1 = "Email : cjxsgn@163.com";
		String pwd = "123456";
		// DES加密
		String str2 = des.encrypt(pwd);
		logger.info("密文:" + str2);
		// DES解密
		logger.info("明文:" + des.decrypt(str2));
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setSuffix(String suffix) {
		this.suffix = suffix;
	}

	public String getSuffix() {
		return suffix;
	}
}

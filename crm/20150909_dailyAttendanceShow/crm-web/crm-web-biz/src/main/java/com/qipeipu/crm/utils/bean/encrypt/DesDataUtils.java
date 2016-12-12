package com.qipeipu.crm.utils.bean.encrypt;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class DesDataUtils implements ApplicationContextAware {

	private static final Logger logger = Logger.getLogger(DesDataUtils.class);

	private static DesEncrypt des = null;

	private static ApplicationContext context;

	public static String EnData(String str) {
		//加密开关
		if (des.getIsEnable() && str != null && !StringUtils.equals("", str)) {
			String prefix = getPrefix();
			String suffix = getSuffix();
			str = craeteKeyRst(prefix, suffix, str);
		}
		return str;
	}

	public static String DeData(String str) {
		if (str != null && !StringUtils.equals("", str)) {
			String prefix = getPrefix();
			String suffix = getSuffix();
			str = craeteKeyRst(prefix, suffix, str);
		}
		return str;
	}

	private static String getPrefix() {
		return des.getPrefix();//UUID.randomUUID().toString().substring(0, 32);
	}

	private static String getSuffix() {
		return des.getSuffix();//UUID.randomUUID().toString().substring(0, 16);
	}

	private static String craeteKeyRst(String prefix, String suffix, String data) {
		//将UUID加密，并去掉其中的=号
		des.setKey(prefix);
		prefix = des.encrypt(prefix).replace("=", "");
		des.setKey(suffix);
		suffix = des.encrypt(suffix).replace("=", "");

		logger.debug("首次加密：prefix=" + prefix + "\t,长度为：" + prefix.length());
		logger.debug("首次加密：suffix=" + suffix + "\t,长度为：" + suffix.length());

		//利用首次加密的prefix+suffix作为key，加密GsonEbRst数据
		//prefix+suffix replace ‘=’ length must be 32
		String key = prefix + suffix;
		des.setKey(key);
		String mi = des.encrypt(data);
		System.err.println("mi key:" + key);

		//将加密过后的UUID再次加密(key为mi)，作为key隐藏至data字符串的首部和尾部
		des.setKey(mi);
		prefix = des.encrypt(prefix).replace("=", "");
		suffix = des.encrypt(suffix).replace("=", "");

		logger.debug("再次加密：prefix=" + prefix + "\t,长度为：" + prefix.length());
		logger.debug("再次加密：suffix=" + suffix + "\t,长度为：" + suffix.length());

		prefix = prefix.substring(0, 4);
		suffix = suffix.substring(suffix.length() - 6, suffix.length() - 1);
		//密文的格式变为：前缀+真正的密文+后缀
		mi = prefix + mi + suffix;
		logger.debug("最后的密文：" + mi);
		return mi;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		context = applicationContext;
		des = (DesEncrypt) context.getBean("desEncrypt");
	}

	public static void main(String args[]) {
		String pwd = "123456";
		// DES加密
		String str2 = EnData(pwd);
		logger.info("密文:" + str2);
		// DES解密
		logger.info("明文:" + DeData(str2));
	}
}

package com.qipeipu.crm.wx.bean;

import lombok.extern.slf4j.Slf4j;

import com.qmsk.basic.PropUtils;

@Slf4j
public class WxConfig {
	/**
	 * 微信开关 ： off，on
	 */
	private String wx_switch;
	/**
	 * 应用id
	 */
	private String wx_appId;
	/**
	 * 应用密钥
	 */
	private String wx_appSecret;
	/**
	 * 微信服务端地址
	 */
	private String server_url;
	/**
	 * 服务令牌
	 */
	private String server_token;
	/**
	 * 消息加密密钥
	 */
	private String server_encodingAESKey;
	/**
	 * 获取openid的url
	 */
	private String reqUrl_openid;
	/**
	 * 获取login
	 */
	private String check_redirectUrl;
	/**
	 * 获取首页
	 */
	private String index_redirectUrl;

	/**
	 * 获取openid的url的动态参数key
	 */
	private String reqUrl_key_secreat = "param_SECRET";
	/**
	 * 获取openid的url的动态参数key
	 */
	private String reqUrl_key_code = "param_CODE";
	/**
	 * 获取openid的url的动态参数key
	 */
	private String reqUrl_key_appId = "param_APPID";

	/**
	 *
	 */
	public static final String DEFAULT_CHARSET = "UTF-8";

	/**
	 * 单例
	 */
	private volatile static WxConfig instance;

	public boolean getWx_switch() {
		if (wx_switch == null || wx_switch.equals("on")) {
			return true;
		}
		return !wx_switch.equals("off");
	}

	public void setWx_switch(String wx_switch) {
		this.wx_switch = wx_switch;
	}

	public String getServer_url() {
		return server_url;
	}

	public void setServer_url(String server_url) {
		this.server_url = server_url;
	}

	public String getServer_token() {
		return server_token;
	}

	public void setServer_token(String server_token) {
		this.server_token = server_token;
	}

	public String getServer_encodingAESKey() {
		return server_encodingAESKey;
	}

	public void setServer_encodingAESKey(String server_encodingAESKey) {
		this.server_encodingAESKey = server_encodingAESKey;
	}

	public String getWx_appId() {
		return wx_appId;
	}

	public void setWx_appId(String wx_appId) {
		this.wx_appId = wx_appId;
	}

	public String getWx_appSecret() {
		return wx_appSecret;
	}

	public void setWx_appSecret(String wx_appSecret) {
		this.wx_appSecret = wx_appSecret;
	}

	public String getReqUrl_openid(String code) {
		return reqUrl_openid.replace(reqUrl_key_code, code);
	}

	public String getIndex_redirectUrl() {
		return index_redirectUrl;
	}

	public void setIndex_redirectUrl(String index_redirectUrl) {
		this.index_redirectUrl = index_redirectUrl;
	}

	public String getCheck_redirectUrl() {
		return check_redirectUrl;
	}

	public void setCheck_redirectUrl(String check_redirectUrl) {
		this.check_redirectUrl = check_redirectUrl;
	}

	/**
	 * instance
	 *
	 * @return
	 */
	public static WxConfig getInstance() {
		if (instance == null) {
			synchronized (WxConfig.class) {
				if (instance == null) {
					instance = new WxConfig();
				}
			}
		}
		return instance;
	}

	private WxConfig() {
		initial();
	}

	private void initial() {
		PropUtils propUtils = new PropUtils();
		log.info("WxConfig init");
		try {
			propUtils.loadOfSrc("wx_config.properties");

			wx_switch = propUtils.getString("wx_switch");

			wx_appId = propUtils.getString("wx_appId");
			wx_appSecret = propUtils.getString("wx_appSecret");

			server_url = propUtils.getString("cpic_http_addr");
			server_token = propUtils.getString("pic_http_addr");
			server_encodingAESKey = propUtils
					.getString("server_encodingAESKey");

			reqUrl_openid = propUtils.getString("reqUrl_openid")
					.replace(reqUrl_key_appId, wx_appId)
					.replace(reqUrl_key_secreat, wx_appSecret);
			check_redirectUrl = propUtils.getString("check_redirectUrl");
			index_redirectUrl = propUtils.getString("index_redirectUrl");
		} finally {
			propUtils = null;
			log.info(" WxConfig init end");
		}
	}
}

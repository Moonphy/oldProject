package com.qipeipu.crm.wx.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.json.JSONObject;

import com.qipeipu.crm.wx.bean.WxConfig;
import com.utils.gson.JSONHelper;

/**
 * 基础API，对应微信公众平台基础栏目
 */
@Slf4j
public class WxBaseAPI {
	/**
	 * 向微信服务器请求用户的OPENID
	 *
	 * @return
	 */
	private static final String resp_openid = "openid";
	private static final String resp_errmsg = "errmsg";

	public static String getOpenID(String code) {
		String openId = null;
		try {
			String reqUrl = WxConfig.getInstance().getReqUrl_openid(code);

			String jsonStr = WxHttpKit.get(reqUrl);

			JSONObject jsonObj = new JSONObject(jsonStr);
			Map<String, Object> map = JSONHelper.jsonToMap(jsonObj);

			if (map.get(resp_errmsg) != null) {
				log.error("Get access token failed, error code:" + code
						+ ",errmsg:" + map.get(resp_errmsg));
				return openId;
			} else {
				openId = (String) map.get(resp_openid);
			}

		} catch (Exception e) {
			log.error("WxBaseAPI.getOpenID", e);
		}
		return openId;
	}

	/**
	 * 判断微信服务器响应的数据是否是错误信息
	 *
	 * @return 有错误返回 error code, 否则返回 null
	 * @since 1.0
	 */
	public static Map<String, Object> checkXMLError(String xml) {
		Map<String, Object> map = new HashMap<String, Object>();
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(xml); // 将字符串转为XML
			Element root = doc.getRootElement(); // 获取根节点
			List<Element> children = root.elements();
			for (int i = 0; i < children.size(); i++) {
				map.put(children.get(i).getName(), children.get(i).getText());
			}
		} catch (Exception e) {
			e.printStackTrace();
			//throw new AesException(AesException.ParseXmlError);
		}
		return map;
	}

}

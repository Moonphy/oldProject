package com.qipeipu.crm.service.main;

import com.qipeipu.crm.dtos.main.MorgDTO;

/**
 * Created by johnkim on 15-2-6.
 */
public interface MorgService {

	/***
	 * 根据汽修厂ID获取汽修厂资料信息
	 * 
	 * @param mOrgId
	 *            汽修厂Id
	 * @return 返回汽修厂资料信息，若没有找到对应ID的汽修厂，则返回null
	 */
	MorgDTO getMorgInfo(Integer mOrgId);

}

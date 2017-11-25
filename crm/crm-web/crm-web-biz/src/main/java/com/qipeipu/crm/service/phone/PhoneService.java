package com.qipeipu.crm.service.phone;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.dtos.phone.UserPhoneDTO;
import com.qipeipu.crm.dtos.phone.UserPhoneEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/20.
 */

public interface PhoneService {


	/**
	 *用户号码务列表查询
	 *
	 * @param userId
	 * @param key
	 * @return
	 */
	public void getUserPhonesByParams(VoModel<?, ?> vo, Integer userId, String key);

	/**
	 * 获取全部的公共号码
	 * @return
	 */
	public void getAllPublicPhoneByParams(VoModel<?, ?> vo, String key);

	/**
	 * 根据contactID获取该联系人的详细信息
	 * @param contactID
	 * @return
	 */
	public List<UserPhoneEntity> getUserPhoneByContactID(Integer contactID);

	/**
	 * 根据contactID获取该公共号码的详细信息
	 * @param contactID
	 * @return
	 */
	public List<PublicPhoneEntity> getPublicPhoneByContactID(Integer contactID);

	/**
	 * 创建UserPhone
	 * @param userPhoneDTO
	 * @return
	 */
	public int createUserPhone(UserPhoneDTO userPhoneDTO);

	/**
	 * 更新UserPhone
	 * @param userPhoneDTO
	 * @return
	 */
	public int updateUserPhone(UserPhoneDTO userPhoneDTO);

	/**
	 * 删除userPhoneDTO
	 * @param userPhoneDTO
	 * @return
	 */
	public int delUserPhone(UserPhoneDTO userPhoneDTO);



	/**
	 * 获取联系类型实体
	 * @return
	 */
	public List<PlatTypeEntity> getAllPlatType();

}

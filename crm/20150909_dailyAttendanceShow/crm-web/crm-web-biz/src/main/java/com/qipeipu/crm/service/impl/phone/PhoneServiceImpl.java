package com.qipeipu.crm.service.impl.phone;

import com.qipeipu.crm.dao.PhoneDao;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.dtos.phone.UserPhoneDTO;
import com.qipeipu.crm.dtos.phone.UserPhoneEntity;
import com.qipeipu.crm.service.phone.PhoneService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/20.
 */
@Service("phoneServiceImpl")
public class PhoneServiceImpl implements PhoneService {

	@Autowired
	private PhoneDao phoneDao;

	@Override
	public void getUserPhonesByParams(VoModel<?, ?> vo, Integer userId, String key) {
		List<UserPhoneEntity> userPhoneEntityList = phoneDao.getAllUserPhoneByParamsSql(userId, key, vo);
		if (CollectionUtils.isEmpty(userPhoneEntityList)) {
			userPhoneEntityList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(phoneDao.getAllUserPhoneByParamsSqlCount(userId, key));
		}
		vo.setModel(userPhoneEntityList);
	}

	@Override
	public void getAllPublicPhoneByParams(VoModel<?, ?> vo, String key) {
		List<PublicPhoneEntity> publicPhoneEntityList = phoneDao.getAllPubPhoneByParamsSql(key, vo);
		if (CollectionUtils.isEmpty(publicPhoneEntityList)) {
			publicPhoneEntityList = Collections.emptyList();
			vo.setTotal(0);
		} else {
			vo.setTotal(phoneDao.getAllPubPhoneByParamsSqlCount(key));
		}
		vo.setModel(publicPhoneEntityList);
	}


	@Override
	public List<UserPhoneEntity> getUserPhoneByContactID(Integer contactID) {
		List<UserPhoneEntity> publicPhoneEntityList = phoneDao
				.getUserPhoneByContactID(contactID);
		return publicPhoneEntityList.size() > 0 ? publicPhoneEntityList : null;
	}


	@Override
	public List<PublicPhoneEntity> getPublicPhoneByContactID(Integer contactID) {
		List<PublicPhoneEntity> publicPhoneEntityList = phoneDao
				.getPublicPhoneByContactID(contactID);
		return publicPhoneEntityList.size() > 0 ? publicPhoneEntityList : null;
	}




	@Override
	public int createUserPhone(UserPhoneDTO userPhoneDTO) {
		return phoneDao.createUserPhone(userPhoneDTO);
	}

	@Override
	public int updateUserPhone(UserPhoneDTO userPhoneDTO) {
		return phoneDao.updateUserPhone(userPhoneDTO);
	}

	@Override
	public int delUserPhone(UserPhoneDTO userPhoneDTO) {
		return phoneDao.delUserPhone(userPhoneDTO);
	}

	@Override
	public List<PlatTypeEntity> getAllPlatType() {
		List<PlatTypeEntity> platTypeEntityList = phoneDao.getAllPlatType();
		return (platTypeEntityList.size()>0)?platTypeEntityList:null;
	}


}

package com.qipeipu.crm.service.impl.wxCustomer;

import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.dtos.visit.MaintainEntity;
import com.qipeipu.crm.service.wxCustomer.WxCustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Service("wxCustomerServiceImpl")
public class WxCustomerServiceImpl implements WxCustomerService {

	@Autowired
	private WxCustomerDao wxCustomerDao;

	@Autowired
	private UserAreaDao userAreaDao;

	@Autowired
	private AreaDao areaDao;

	@Autowired
	private CityDao cityDao;

	@Autowired
	private MaintainDao maintainDao;

	@Autowired
	private MaintainLogDao maintainLogDao;

	@Override
	public CustomerBasedEntity createMfcty(
			CustomerBasedEntity customerBasedEntity) {
		Integer userID = customerBasedEntity.getUserID();
		List<Integer> areaIDs = userAreaDao.getAreaIDByUserID(userID);
		if (areaIDs.size()==0) {
			return null;
		}
		Integer areaID = areaIDs.get(0);
		Integer cityID = areaDao.getCityIDByAreaID(areaID);
		Integer provinceID = cityDao.getprovinceIDByCityID(cityID);
		customerBasedEntity.setCityID(cityID);
		customerBasedEntity.setAreaId(areaID);
		customerBasedEntity.setProvinceID(provinceID);

		wxCustomerDao.createMfcty(customerBasedEntity);
		MaintainEntity developer = MaintainEntity.builder().userID(userID).createTime(customerBasedEntity.getCreateTime()).maintainType(1).custID(customerBasedEntity.getId()).build();
		MaintainEntity developerLog = MaintainEntity.builder().userID(userID).createTime(customerBasedEntity.getCreateTime()).maintainType(1).custID(customerBasedEntity.getId()).build();
		maintainDao.createMaintain(developer);
		maintainLogDao.insertMaintainLog(developerLog);

		return customerBasedEntity;
	}
}

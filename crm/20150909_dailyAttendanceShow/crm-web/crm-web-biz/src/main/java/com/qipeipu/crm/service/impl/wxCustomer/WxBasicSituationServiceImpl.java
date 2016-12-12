package com.qipeipu.crm.service.impl.wxCustomer;

import com.qipeipu.crm.dao.WxBasicSituationDao;
import com.qipeipu.crm.dao.WxCustomerDao;
import com.qipeipu.crm.dtos.visit.BusinessMessageEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;
import com.qipeipu.crm.service.wxCustomer.WxBasicSituationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by laiyiyu on 2015/3/27.
 */
@Service("wxBasicSituationServiceImpl")
public class WxBasicSituationServiceImpl implements WxBasicSituationService {

    @Autowired
    private WxCustomerDao wxCustomerDao;

    @Autowired
    private WxBasicSituationDao wxBasicSituationDao;

    @Override
    public int updateBasicSituation(CustomerBasedDTO customerBasedDTO) {
        return wxCustomerDao.updateBasicSituation(customerBasedDTO);
    }

    @Override
    public int updateBusinessMessage(BusinessMessageEntity businessMessageEntity) {
        return wxBasicSituationDao.updateBusinessMessage(businessMessageEntity);
    }


    public int createBusiness(BusinessMessageEntity businessMessageEntity){
        return wxBasicSituationDao.createMessageBusiness(businessMessageEntity);
    }

}

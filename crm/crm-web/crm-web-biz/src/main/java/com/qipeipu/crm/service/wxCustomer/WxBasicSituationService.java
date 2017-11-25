package com.qipeipu.crm.service.wxCustomer;

import com.qipeipu.crm.dtos.visit.BusinessMessageEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;

/**
 * Created by laiyiyu on 2015/3/27.
 */
public interface WxBasicSituationService {


    public int updateBasicSituation(CustomerBasedDTO customerBasedDTO);

    public int updateBusinessMessage(BusinessMessageEntity businessMessageEntity);

    public int createBusiness(BusinessMessageEntity businessMessageEntity);

}

package com.qipeipu.crm.service.wxCustomer;

import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface WxCustomerService {

    /**
     * 插入用户厂商的基本信息
     * @param customerBasedEntity
     * @return
     */
    public CustomerBasedEntity createMfcty(CustomerBasedEntity customerBasedEntity);

}

package com.qipeipu.crm.service.impl.visit;

import com.baturu.common.guava2.Lists2;
import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dtos.visit.*;
import com.qipeipu.crm.service.transformer.CustomerBasedDTOTransformer;
import com.qipeipu.crm.service.visitAll.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
@Service("visitServiceImpl")
public class VisitServiceImpl implements VisitService {

    @Autowired
    private WxCustomerDao wxCustomerDao;

    @Autowired
    private CustBusinessDao custBusinessDao;
    @Autowired
    private WxPlatFormQuestionDao wxPlatFormQuestionDao;
    @Autowired
    private ReturnGoodsQuestionDao returnGoodsQuestionDao;
    @Autowired
    private WxMessageDetailDao wxMessageDetailDao;

    @Override
    public List<CustomerBasedDTO> getCustomerBasedByID(Integer id) {
        List<CustomerBasedEntity> customerBasedEntityList = wxCustomerDao.getCustomerBasedByID(id);
        List<CustomerBasedDTO> customerBasedDTOList = Lists2.transform(customerBasedEntityList, CustomerBasedDTOTransformer.INSTANCE);
        return (customerBasedDTOList.size()>0)?customerBasedDTOList : null;
    }

    @Override
    public List<BusinessMessageEntity> getBusinessMessageByID(Integer custID) {
        List<BusinessMessageEntity> businessMessageEntityList = custBusinessDao.getBusinessMessageByID(custID);
        return (businessMessageEntityList.size()>0)? businessMessageEntityList : null;
    }

    @Override
    public List<PlatformQuestionEntity> getAllPlatformQuestionByTaskID(Integer taskID) {
        List<PlatformQuestionEntity> platformQuestionEntityList = wxPlatFormQuestionDao.getAllPlatformQuestionByTaskID(taskID);
        return (platformQuestionEntityList.size()>0)?platformQuestionEntityList : null;
    }

    @Override
    public List<ReturnGoodsQuestionEntity> getAllReturnGoodsQuestionByTaskID(Integer taskID) {
        List<ReturnGoodsQuestionEntity> returnGoodsQuestionEntityList = returnGoodsQuestionDao.getReturnGoodsQuestionByTaskID(taskID);
        return (returnGoodsQuestionEntityList.size()>0)?returnGoodsQuestionEntityList : null;
    }

    @Override
    public List<WxMessageDetailDTO> getAllWxMessageDetailList(Integer taskID) {
        List<WxMessageDetailDTO> wxMessageDetailDTOList = wxMessageDetailDao.getAllWxMessageDetailList(taskID);
        return (wxMessageDetailDTOList.size()>0)?wxMessageDetailDTOList : null;
    }
}

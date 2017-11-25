package com.qipeipu.crm.service.visitAll;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.InquirySheetEntity;
import com.qipeipu.crm.dtos.visit.OrderFormEntity;
import com.qipeipu.crm.dtos.visit.QueryConditionEntity;

/**
 * Created by laiyiyu on 2015/4/2.
 */
public interface WxBillOfDocumentService {

    public void getOrderFormListByDemanderID(Integer custID, QueryConditionEntity queryConditionEntity,VoModel<?, ?> vo, Integer userID, String queryTime);



    public OrderFormEntity getOrderFormAndDetailByOrderMainID(String orderMainID);


    public void getInquirysheetListByMfctyID(Integer custID, QueryConditionEntity queryConditionEntity, VoModel<?, ?> vo,Integer userID, String queryTime ) ;


    public InquirySheetEntity getInquirysheetAndDetailByInquiryID(Integer inquiryID);
}

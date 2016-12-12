package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.main.provider.WxBillOfDocumentProvider;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/2.
 */
public interface WxBillOfDocumentDao {


    @Results(value = {
            @Result(column = "orderId", property = "orderMainID"),
            @Result(column = "orderNo", property = "orderMainNo"),
            @Result(column = "publishTime", property = "publishTime"),
            @Result(column = "payTime", property = "payTime"),
            @Result(column = "orgid", property = "orgID"),
            @Result(column = "actualAmount", property = "money"),
            @Result(column = "state", property = "orderStatus")
    })
    @SelectProvider(type = WxBillOfDocumentProvider.class, method = "getOrderFormListByOrgID")
    public List<OrderFormEntity> getOrderFormListByOrgID(@Param("queryConditionEntity")QueryConditionEntity queryConditionEntity, @Param("vo") VoModel<?, ?> vo, @Param("queryTime")String queryTime);

    @SelectProvider(type = WxBillOfDocumentProvider.class, method = "getOrderFormListByOrgIDCount")
    public Integer getOrderFormListByOrgIDCount (@Param("queryConditionEntity")QueryConditionEntity queryConditionEntity, @Param("vo") VoModel<?, ?> vo, @Param("queryTime")String queryTime);


    @Results(value = {
            @Result(column = "orderDetailID", property = "orderDetailID"),
            @Result(column = "stockSnapShotId", property = "stockSnapShotID"),
            @Result(column = "num", property = "num")
    })
    @Select("select orderDetailID,num,stockSnapShotId from qp_orderdetail where orderId=#{orderMainID}")
    public List<PartDetailEntity> getOrderFormDetailListByOrderMainID(@Param("orderMainID") String orderMainID);


    @Results(value = {
            @Result(column = "orderId", property = "orderMainID"),
            @Result(column = "orderNo", property = "orderMainNo"),
            @Result(column = "publishTime", property = "publishTime"),
            @Result(column = "orgid", property = "orgID"),
            @Result(column = "actualAmount", property = "money"),
            @Result(column = "state", property = "orderStatus")
    })
    @Select("select orderId,orderNo,publishTime,actualAmount,deliveryState,state,orgid from qp_order where orderId=#{orderMainID}")
    public OrderFormEntity getOrderFormAndDetailByOrderMainID(@Param("orderMainID") String orderMainID );

    @SelectProvider(type = WxBillOfDocumentProvider.class, method = "getMfctyIDsByQueryCondition")
    public List<Integer> getMfctyIDsByQueryCondition(@Param("queryConditionEntity") QueryConditionEntity queryConditionEntity);



    @Select({"<script>select userID FROM qpu_user where orgid in",
            "<foreach item='item' index='index' collection='mfctyIDList'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<String> getQPUserIDListByMfctyIDs(@Param("mfctyIDList") List<Integer> mfctyIDList );


    @Results(value = {
            @Result(column = "userID", property = "userID"),
            @Result(column = "orgid", property = "mfctyID")
    })
    @Select({"<script>select userID,orgid FROM qpu_user where orgid in",
            "<foreach item='item' index='index' collection='mfctyIDList'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<UserIDAndMfctyIDEntity> getQPUserIDAndOrgIDListByMfctyIDs(@Param("mfctyIDList") List<Integer> mfctyIDList );

    @Results(value = {
            @Result(column = "inquiryID", property = "inquiryID"),
            @Result(column = "inquiryNo", property = "inquiryNo"),
            @Result(column = "publishTime", property = "publishTime"),
            @Result(column = "status", property = "status"),
            @Result(column = "userId", property = "userID"),
            @Result(column = "carTypeId", property = "carTypeId")
    })
    @SelectProvider(type = WxBillOfDocumentProvider.class, method = "getInquirySheetListByUserIDs")
    public List<InquirySheetEntity> getInquirySheetListByUserIDs(@Param("queryConditionEntity")QueryConditionEntity queryConditionEntity, @Param("vo") VoModel<?, ?> vo, @Param("queryTime")String queryTime);



    @SelectProvider(type = WxBillOfDocumentProvider.class, method = "getInquirySheetListCountByUserIDs")
    public Integer getInquirySheetListCountByUserIDs(@Param("queryConditionEntity")QueryConditionEntity queryConditionEntity, @Param("vo") VoModel<?, ?> vo, @Param("queryTime")String queryTime);




    @Results(value = {
            @Result(column = "inquiryID", property = "inquiryID"),
            @Result(column = "inquiryNo", property = "inquiryNo"),
            @Result(column = "publishTime", property = "publishTime"),
            @Result(column = "status", property = "status"),
            @Result(column = "carTypeId", property = "carTypeId")
    })
    @Select("select inquiryID,inquiryNo,publishTime,status,carTypeId from qp_inquiry where inquiryID=#{inquiryID}")
    public InquirySheetEntity getInquirySheetEntityAndDetailByInquiryID(@Param("inquiryID") Integer inquiryID );

    @Results(value = {
            @Result(column = "inquiryDetailId", property = "inquiryDetailId"),
            @Result(column = "partsName", property = "partsName"),
            @Result(column = "needNum", property = "num")
    })
    @Select("select inquiryDetailId,needNum,partsName from qp_inquirydetail  where inquiryID=#{inquiryID}")
    public List<PartDetailEntity> gerInquirySheetDetailByInquiryID(@Param("inquiryID") Integer inquiryID);


    @Results(value = {
            @Result(column = "quotePrice", property = "quotePrice"),
            @Result(column = "remark", property = "remark")
    })
    @Select("select quotePrice,remark from qp_quotedetail where inquiryID=#{inquiryID} and inquiryDetailId=#{inquiryDetailId} and status = 0 ")
    public List<QuotedetailEntity> getInquiryDetailMenoy(@Param("inquiryID")Integer inquiryID, @Param("inquiryDetailId")Integer inquiryDetailId);


}

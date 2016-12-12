package com.qipeipu.crm.dao.main.provider;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.QueryConditionEntity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/2.
 */
public class WxBillOfDocumentProvider {

    public String getOrderFormListByOrgID(Map<String, Object> parameters){

        VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
        QueryConditionEntity queryConditionEntity = (QueryConditionEntity) parameters.get("queryConditionEntity");
        String queryTime = (String) parameters.get("queryTime");
        List<Integer> mfctyIDList = queryConditionEntity.getMfctyIDList();
        Integer mfctyID = queryConditionEntity.getMfctyID();
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select orderId,orderNo,publishTime,actualAmount,payTime,deliveryState,state,orgid from qp_order where state not in (-1) and  ");

        sb.append(" orgid in ").append(" (").append(ids).append(")");
        if(mfctyID!=null){
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }
        }else{
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }else{
                sb.append(" and publishTime like '%").append(currentDay()).append("%' ");
            }
        }

        sb.append(" ORDER BY publishTime desc ");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        System.out.println(sb.toString());
        return sb.toString();

    }


    public String getOrderFormListByOrgIDCount(Map<String, Object> parameters){
        QueryConditionEntity queryConditionEntity = (QueryConditionEntity) parameters.get("queryConditionEntity");
        Integer mfctyID = queryConditionEntity.getMfctyID();
        String queryTime = (String) parameters.get("queryTime");
        List<Integer> mfctyIDList = queryConditionEntity.getMfctyIDList();
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from qp_order where ");

        sb.append(" orgid in ").append(" (").append(ids).append(")");

        if(mfctyID!=null){
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }
        }else{
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }else{
                sb.append(" and publishTime like '%").append(currentDay()).append("%' ");
            }
        }


        return sb.toString();
    }

    public String getInquirySheetListByUserIDs(Map<String, Object> parameters){
        VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
        QueryConditionEntity queryConditionEntity = (QueryConditionEntity) parameters.get("queryConditionEntity");
        String queryTime = (String) parameters.get("queryTime");
        Integer mfctyID = queryConditionEntity.getMfctyID();
        List<String> qpuUserIDList = queryConditionEntity.getQpuUserIDList();
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<qpuUserIDList.size();i++){
            if(i==qpuUserIDList.size()-1) {
                ids.append(qpuUserIDList.get(i));
            }else{
                ids.append(qpuUserIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select inquiryId,inquiryNo,publishTime,carTypeId,status,userid from qp_inquiry where ");

        sb.append(" userId in ").append(" (").append(ids).append(")");
        if(mfctyID!=null){
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }
        }else{
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }else{
                sb.append(" and publishTime like '%").append(currentDay()).append("%' ");
            }
        }
        sb.append(" ORDER BY publishTime desc ");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        System.out.println(sb.toString());
        return sb.toString();

    }


    public String getInquirySheetListCountByUserIDs(Map<String, Object> parameters){
        QueryConditionEntity queryConditionEntity = (QueryConditionEntity) parameters.get("queryConditionEntity");
        String queryTime = (String) parameters.get("queryTime");
        Integer mfctyID = queryConditionEntity.getMfctyID();
        List<String> qpuUserIDList = queryConditionEntity.getQpuUserIDList();
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<qpuUserIDList.size();i++){
            if(i==qpuUserIDList.size()-1) {
                ids.append(qpuUserIDList.get(i));
            }else{
                ids.append(qpuUserIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select count(*) from qp_inquiry where ");

        sb.append(" userId in ").append(" (").append(ids).append(")");
        if(mfctyID!=null){
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }
        }else{
            if (queryTime!=null&&!queryTime.equals("")){
                sb.append(" and publishTime like '%").append(queryTime).append("%' ");
            }else{
                sb.append(" and publishTime like '%").append(currentDay()).append("%' ");
            }
        }
        sb.append(" ORDER BY publishTime desc ");
        System.out.println(sb.toString());
        return sb.toString();

    }



    public String getMfctyIDsByQueryCondition(Map<String, Object> parameters){
        QueryConditionEntity queryConditionEntity = (QueryConditionEntity) parameters.get("queryConditionEntity");
        StringBuilder sb = new StringBuilder();
        Integer areaID = queryConditionEntity.getAreaID();
        Integer cityID = queryConditionEntity.getCityID();
        Integer provinceID = queryConditionEntity.getProvinceID();
        sb.append("select mfctyID FROM t_customer where ");
        if(areaID!=null){
            sb.append(" areaID =").append(areaID);
        }else if(cityID!=null){
            sb.append(" cityID =").append(cityID);
        }else if(provinceID!=null){
            sb.append(" ProvinceID =").append(provinceID
            );
        }
        return sb.toString();

    }


    public String currentDay(){
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date).substring(0, 10);
    }

}

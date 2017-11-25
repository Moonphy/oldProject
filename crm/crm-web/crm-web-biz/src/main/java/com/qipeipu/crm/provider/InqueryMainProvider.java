package com.qipeipu.crm.provider;

import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public class InqueryMainProvider {

    public String getInquirySheetListByUserIDs(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = dateRange.getEndDate();
        String startDate = dateRange.getStartDate();
        List<String> qpuUserIDList = (List<String>) parameters.get("qpuUserIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<qpuUserIDList.size();i++){
            if(i==qpuUserIDList.size()-1) {
                ids.append(qpuUserIDList.get(i));
            }else{
                ids.append(qpuUserIDList.get(i)).append(",");
            }
        }
        if(qpuUserIDList.size()==0){
            ids.append("0");
        }
        StringBuilder sb = new StringBuilder();
        sb.append("select inquiryId,inquiryNo,publishTime,carTypeId,status,userid from qp_inquiry where ");

        sb.append(" userId in ").append(" (").append(ids).append(") ");
        if(endDate!=null&&startDate!=null) {
            sb.append(" and publishTime>='").append(startDate).append("'").append(" and publishTime<='").append(endDate).append("'");
        }
        sb.append(" and status in (1,2,4) ");
        //sb.append(" ORDER BY publishTime desc ");
        //System.out.println(sb.toString());
        return sb.toString();

    }

    public String getInquirySheetListCountByUserIDs(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = dateRange.getEndDate();
        String startDate = dateRange.getStartDate();
        List<String> qpuUserIDList = (List<String>) parameters.get("qpuUserIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<qpuUserIDList.size();i++){
            if(i==qpuUserIDList.size()-1) {
                ids.append(qpuUserIDList.get(i));
            }else{
                ids.append(qpuUserIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select count from qp_inquiry where ");
        sb.append(" userId in ").append(" (").append(ids).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and publishTime between ").append(startDate).append(" and ").append(endDate);
        }
        sb.append(" and status in (1,2,4) ");
        //System.out.println(sb.toString());
        return sb.toString();
    }

    public String countInquiryNumByUserIDsAndTime(Map<String, Object> parameters){
        String publishTime = (String) parameters.get("publishTime");
        List<String> qpuUserIDList = (List<String>) parameters.get("userIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<qpuUserIDList.size();i++){
            if(i==qpuUserIDList.size()-1) {
                ids.append(qpuUserIDList.get(i));
            }else{
                ids.append(qpuUserIDList.get(i)).append(",");
            }
        }
        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) FROM qp_inquiry where publishTime<'").append(publishTime).append("' and userid in ").append(" (").append(ids).append(") ");;
        //System.out.println(sb.toString());
        return sb.toString();
    }
}

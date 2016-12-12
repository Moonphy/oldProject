package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/29.
 */
public class UserVisitProvider {

    public String statisticsVistDetail(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }

        List<Integer> userIDs = (List<Integer>) parameters.get("userIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<userIDs.size();i++){
            if(i==userIDs.size()-1) {
                ids.append(userIDs.get(i));
            }else{
                ids.append(userIDs.get(i)).append(",");
            }
        }
        if(userIDs.size()==0){
            ids.append("0");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("select visitID,taskID,userID,enterTime,leaveTime,content from t_user_visit where ");
        sb.append(" userID in ").append(" (").append(ids).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and enterTime>='").append(startDate).append("'").append(" and enterTime<='").append(endDate).append("'");
        }
        //sb.append(" ORDER BY publishTime desc ");
        System.out.println(sb.toString());
        return sb.toString();
    }


    public String getVistDetailForPage(Map<String, Object> parameters){
        VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }

        Integer userID = (Integer) parameters.get("userID");


        StringBuilder sb = new StringBuilder();
        sb.append("select visitID,taskID,userID,enterTime,leaveTime,content from t_user_visit where ");
        sb.append(" userID in ").append(" (").append(userID).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and enterTime>='").append(startDate).append("'").append(" and enterTime<='").append(endDate).append("'");
        }

        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        //sb.append(" ORDER BY publishTime desc ");
        System.out.println(sb.toString());
        return sb.toString();
    }


    public String getVistDetailForCount(Map<String, Object> parameters){
        VoModel<?, ?> vo = (VoModel<?, ?>) parameters.get("vo");
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }

        Integer userID = (Integer) parameters.get("userID");


        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from t_user_visit where ");
        sb.append(" userID in ").append(" (").append(userID).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and enterTime>='").append(startDate).append("'").append(" and enterTime<='").append(endDate).append("'");
        }


        //sb.append(" ORDER BY publishTime desc ");
        System.out.println(sb.toString());
        return sb.toString();
    }

}

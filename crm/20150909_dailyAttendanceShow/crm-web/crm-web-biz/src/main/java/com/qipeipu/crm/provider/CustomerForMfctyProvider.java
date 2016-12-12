package com.qipeipu.crm.provider;

import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/11.
 */
public class CustomerForMfctyProvider {

    public String countMfctyNumByUserID(Map<String, Object> map){
        DateRange dateRange = (DateRange) map.get("dateRange");
        List<Integer> userIDs = (List<Integer>) map.get("userIDs");
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
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }
        StringBuilder sb = new StringBuilder();
        sb.append(" select  count(1)  from t_customer where 1=1 and userID in (").append(ids).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and createTime>='").append(startDate).append("'").append(" and createTime<='").append(endDate).append("'");
        }

        sb.toString();
        return sb.toString();
    }

}

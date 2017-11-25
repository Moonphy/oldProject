package com.qipeipu.crm.provider;

import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public class OrderMainProvider {

    public String getOrderFormListByOrgID(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }

        List<Integer> mfctyIDList = (List<Integer>) parameters.get("mfctyIDs");

        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }
        }
        if(mfctyIDList.size()==0){
            ids.append("0");
        }
        StringBuilder sb = new StringBuilder();
        sb.append("select orderId,orderNo,payTime,actualAmount,state,orgId,name,address from qp_order where ");
        sb.append(" orgID in ").append(" (").append(ids).append(") ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and payTime>='").append(startDate).append("'").append(" and payTime<='").append(endDate).append("'");
        }
        //sb.append(" ORDER BY publishTime desc ");
        //System.out.println(sb.toString());
        return sb.toString();

    }

}

package com.qipeipu.crm.provider;

import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/4/20.
 */
public class ReturnGoodsProvider {

    public String getReturnGoodsListByCondition(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = dateRange.getEndDate();
        String startDate = dateRange.getStartDate();
        List<Integer> mfctyIDList = (List<Integer>) parameters.get("mfctyIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }

        }
        StringBuilder sb = new StringBuilder();
        sb.append("select returnID,returnCode,orderNo,totalMoney,applyTime,applicantId,applicant from pt_return_goods where ");
        sb.append(" applicantId in ").append(" (").append(ids).append(") ");
        sb.append(" and status=5 ");
        if(endDate!=null&&startDate!=null){
            sb.append(" and returnTime>='").append(startDate).append("'").append(" and returnTime<='").append(endDate).append("'");
        }
        //sb.append(" ORDER BY applyTime desc ");
        //System.out.println(sb.toString());
        return sb.toString();
    }
}

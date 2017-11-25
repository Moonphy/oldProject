package com.qipeipu.crm.provider;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/6/2.
 */
public class CouponProvider {

    public String countUnUsedNumByMfctyIDAndMoney(Map<String, Object> map){
        String orgID = (String) map.get("mfctyID");
        Double money = (Double) map.get("money");
        String currentTime = (String) map.get("currentTime");
        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from pt_mfcty_coupon where state=0 and   createTime is not null and expiryDate is not null and mfctyId=").append(orgID).append(" and money=").append(money).append(" and createTime<='").append(currentTime).append("' and expiryDate>='").append(currentTime).append("' ");
        System.out.println(sb.toString());
        return sb.toString();
    }

    public String getCouponsByMfctyIDAndStateAndMoney(Map<String, Object> map){
        String orgID = (String) map.get("mfctyID");
        Integer state = (Integer) map.get("state");
        Double money = (Double) map.get("money");
        StringBuilder sb = new StringBuilder();
        sb.append("select * from pt_mfcty_coupon where mfctyId=").append(orgID).append(" and state=").append(state).append(" and money=").append(money);
        System.out.println(sb.toString());
        return sb.toString();
    }



}

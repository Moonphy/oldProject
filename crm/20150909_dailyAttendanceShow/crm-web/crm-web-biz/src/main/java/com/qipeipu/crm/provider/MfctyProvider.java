package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/10.
 */
public class MfctyProvider {

    public String getAllCustomerList(Map<String, Object> map) {
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String nameSearch = (String) map.get("nameSearch");
        Integer mfctyID = (Integer) map.get("mfctyID");

        StringBuilder sb = new StringBuilder("select * from t_customer where 1=1 ");
        if(nameSearch!=null&&!nameSearch.trim().equals("")){
            sb.append(" and mfctyName like '%").append(nameSearch).append("%'").append(" ");
        }
        if(mfctyID!=null){
            sb.append(" and mfctyID=").append(mfctyID);
        }

        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());

        return sb.toString();
    }

    public String getAllCustomerListCount(Map<String, Object> map) {
        String nameSearch = (String) map.get("nameSearch");
        Integer mfctyID = (Integer) map.get("mfctyID");

        StringBuilder sb = new StringBuilder("select count(1) from t_customer where 1=1 ");
        if(nameSearch!=null&&!nameSearch.trim().equals("")){
            sb.append(" and mfctyName like '%").append(nameSearch).append("%'").append(" ");
        }
        if(mfctyID!=null){
            sb.append(" and mfctyID=").append(mfctyID);
        }



        return sb.toString();
    }
}

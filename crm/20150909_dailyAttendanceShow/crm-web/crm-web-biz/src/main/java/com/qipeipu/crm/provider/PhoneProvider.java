package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/3/25.
 */
public class PhoneProvider {



    public String getAllUserPhoneByParamsSql(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder(
                "select tup.contactId,tup.contactMan,tup.phoneNo,tup.memo,tup.contactTypeId,tct.contactTypeName  from t_user_phone as tup LEFT JOIN t_contact_type as tct on tup.ContactTypeId = tct.ContactTypeId where state=0 and  ");

        Integer userId = (Integer) map.get("userId");
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String key = (String) map.get("key");

        sb.append("tup.UserId=").append(userId).append(" ");
        if (key != null&&!key.trim().equals("")) {
            sb.append("AND ( tup.contactMan LIKE '%").append(key).append("%' or tup.phoneNo like '%").append(key).append("%')");
        }
        sb.append("ORDER BY state ASC ");
        sb.append("LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());

        return sb.toString();
    }

    public String getAllUserPhoneByParamsSqlCount(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder(
                "select count(*)  from t_user_phone as tup LEFT JOIN t_contact_type as tct on tup.ContactTypeId = tct.ContactTypeId where state=0 and ");

        Integer userId = (Integer) map.get("userId");
        String key = (String) map.get("key");

        sb.append("UserId=").append(userId).append(" ");
        if (key != null&&!key.trim().equals("")) {
            sb.append("AND ( tup.contactMan LIKE '%").append(key).append("%' or tup.phoneNo like '%").append(key).append("%')");
        }

        return sb.toString();
    }



    public String getAllPubPhoneByParamsSql(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder(
                "select tct.ContactTypeName,tpp.contactTypeId,tpp.contactId,tpp.contactMan,tpp.phoneNo,tpp.memo from t_pub_phone tpp LEFT JOIN t_contact_type tct on tpp.ContactTypeId = tct.ContactTypeId where tpp.state=0 ");


        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String key = (String) map.get("key");


        if (key != null&&!key.trim().equals("")) {
            sb.append("AND ( tpp.contactMan LIKE '%").append(key).append("%' or tpp.phoneNo like '%").append(key).append("%')");
        }
        sb.append("ORDER BY state ASC ");
        sb.append("LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());

        return sb.toString();
    }

    public String getAllPubPhoneByParamsSqlCount(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder(
                "select count(*) from t_pub_phone tpp LEFT JOIN t_contact_type tct on tpp.ContactTypeId = tct.ContactTypeId where tpp.state=0 ");

        String key = (String) map.get("key");
        if (key != null&&!key.trim().equals("")) {
            sb.append("AND ( tpp.contactMan LIKE '%").append(key).append("%' or tpp.phoneNo like '%").append(key).append("%')");
        }

        return sb.toString();
    }
}

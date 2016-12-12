package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public class MemorandumProvider {


    public String getMemorandumListByUserID(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder("select noteID,content,planTime from t_user_note where ");
        sb.append(" userid = ").append(userID);
        if(searchKey!=null&&!searchKey.trim().equals("")){
            sb.append(" and planTime like ").append(searchKey);
        }
        sb.append(" ORDER BY planTime desc ");
        sb.append("LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());

        return sb.toString();
    }

    public String getMemorandumListCountByUserID(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder("select count(*) from t_user_note where ");
        sb.append(" userid = ").append(userID);
        if(searchKey!=null&&!searchKey.trim().equals("")){
            sb.append(" and planTime like ").append(searchKey);
        }
        sb.append(" ORDER BY planTime desc ");
        return sb.toString();
    }



}

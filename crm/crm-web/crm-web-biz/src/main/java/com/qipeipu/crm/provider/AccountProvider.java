package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;
import lombok.extern.java.Log;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@Log
public class AccountProvider {


    public String getAccountList(Map<String, Object> map){
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String key = (String) map.get("key");
        StringBuilder sb = new StringBuilder();
        sb.append("select tu.UserId,tu.UserName,tu.LoginName,tu.Email,tu.Mp,t.DutyName from btl_user tu");
        sb.append(" LEFT JOIN ");
        sb.append(" (SELECT ud.UserId,d.DutyName FROM t_user_duty ud LEFT JOIN t_duty d ON ud.DutyId=d.DutyId) AS t ");
        sb.append(" on tu.UserId=t.UserId ");
        if(key!=null&&!key.trim().equals(""))
            sb.append(" where tu.UserName like '%").append(key).append("%'");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        //System.out.println(sb.toString());
        log.info(sb.toString());
        return sb.toString();
    }


    public String getAccountListCount(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        String key = (String) map.get("key");
        sb.append("select count(*) from btl_user tu");
        sb.append(" LEFT JOIN ");
        sb.append(" (SELECT ud.UserId,d.DutyName FROM t_user_duty ud LEFT JOIN t_duty d ON ud.DutyId=d.DutyId) AS t ");
        sb.append(" on tu.UserId=t.UserId ");
        if(key!=null&&!key.trim().equals(""))
            sb.append("  where tu.UserName like '%").append(key).append("%'");
        return sb.toString();
    }
}

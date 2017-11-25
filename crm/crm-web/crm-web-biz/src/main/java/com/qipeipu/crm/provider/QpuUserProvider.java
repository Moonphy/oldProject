package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/28.
 */
public class QpuUserProvider {


    public String getUserListByMfctyID(Map<String, Object> map){
        String orgID = (String) map.get("orgID");
        StringBuilder sb = new StringBuilder();
        sb.append("select * from main.qpu_user where ");
        sb.append(" orgID=").append(orgID);
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();
    }

    public String getUserListByMfctyIDCount(Map<String, Object> map){
        String orgID = (String) map.get("orgID");
        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from main.qpu_user where ");
        sb.append(" orgID=").append(orgID);
        return sb.toString();
    }

    public String batchUpdateQpuUser(Map<String, Object> map){
        QpuUserEntity qpuUserEntity = (QpuUserEntity) map.get("qpuUserEntity");
        StringBuilder sb = new StringBuilder();
        sb.append("update qpu_user set ").append("userName='").append(qpuUserEntity.getUserName()).append("'");
        if(!BaseJudgeUtil.isEmpty(qpuUserEntity.getLoginEmail())) {
            sb.append(",loginEmail='").append(qpuUserEntity.getLoginEmail()).append("'");
        }else{
            sb.append(",loginEmail=").append("null");
        }
        if(!BaseJudgeUtil.isEmpty(qpuUserEntity.getLoginMobile())) {
            sb.append(",loginMobile='").append(qpuUserEntity.getLoginMobile()).append("'");
        }else{
            sb.append(",loginMobile=").append("null");
        }
        sb.append(" where userid=").append(qpuUserEntity.getUserID());
        System.out.println(sb.toString());
        return sb.toString();
    }



}

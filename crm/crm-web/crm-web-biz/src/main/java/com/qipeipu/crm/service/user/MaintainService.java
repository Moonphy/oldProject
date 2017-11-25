package com.qipeipu.crm.service.user;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.CustMaintainEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
public interface MaintainService {

    public void getMaintainList(String nameSearch, Integer mfctyID, VoModel<?, ?> vo);

    public List<CustMaintainEntity> getCustMainByCustID(Integer custID);

    public int updateMaintain(Integer maintainUserID, String maintainTime, Integer developUserID, String logTime, Integer custID);

}

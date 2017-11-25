package com.qipeipu.crm.service.phone;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
public interface PubPhoneService {
    public int createPubPhone(PublicPhoneEntity publicPhoneEntity);

    public List<PublicPhoneEntity> getPubPhoneByID(Integer contactID);

    public int updatePubPhone(PublicPhoneEntity publicPhoneEntity);

    public void getAllPubPhoneByParamsSql(String key, VoModel<?, ?> vo);

    public int  delPub(Integer contactID);
}

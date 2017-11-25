package com.qipeipu.crm.service.impl.phone;

import com.qipeipu.crm.dao.PubPhoneDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.service.phone.PubPhoneService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
@Service
public class PubPhoneServiceImpl implements PubPhoneService {

    @Autowired
    private PubPhoneDao pubPhoneDao;

    @Override
    public int createPubPhone(PublicPhoneEntity publicPhoneEntity) {
        return pubPhoneDao.createPubPhone(publicPhoneEntity);
    }

    @Override
    public List<PublicPhoneEntity> getPubPhoneByID(Integer contactID) {
        List<PublicPhoneEntity> publicPhoneEntityList = pubPhoneDao
                .getPubPhoneByID(contactID);
        return publicPhoneEntityList.size() > 0 ? publicPhoneEntityList : null;
    }

    @Override
    public int updatePubPhone(PublicPhoneEntity publicPhoneEntity) {
        return pubPhoneDao.updatePubPhone(publicPhoneEntity);
    }

    @Override
    public void getAllPubPhoneByParamsSql(String key, VoModel<?, ?> vo) {
        List<PublicPhoneEntity> publicPhoneEntityList = pubPhoneDao.getAllPubPhoneByParamsSql(key, vo);
        if (CollectionUtils.isEmpty(publicPhoneEntityList)) {
            publicPhoneEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(pubPhoneDao.getAllPubPhoneByParamsSqlCount(key));
        }
        vo.setModel(publicPhoneEntityList);
    }

    @Override
    public int delPub(Integer contactID) {
        return pubPhoneDao.delPub(contactID);
    }
}

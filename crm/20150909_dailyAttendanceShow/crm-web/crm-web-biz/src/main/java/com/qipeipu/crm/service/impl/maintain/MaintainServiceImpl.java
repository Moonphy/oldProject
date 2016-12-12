package com.qipeipu.crm.service.impl.maintain;

import com.qipeipu.crm.dao.MaintainDao;
import com.qipeipu.crm.dao.MaintainLogDao;
import com.qipeipu.crm.dao.WxCustomerDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.CustMaintainEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.dtos.visit.MaintainEntity;
import com.qipeipu.crm.service.user.MaintainService;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/10.
 */
@Service
public class MaintainServiceImpl implements MaintainService {

    @Autowired
    private WxCustomerDao wxCustomerDao;

    @Autowired
    private MaintainDao maintainDao;

    @Autowired
    private MaintainLogDao maintainLogDao;


    public void getMaintainList(String nameSearch, Integer mfctyID, VoModel<?, ?> vo){
        List<CustMaintainEntity> custMaintainEntityList = new ArrayList<>();
        List<CustomerBasedEntity> customerBasedEntityList = wxCustomerDao.getAllCustomerList(nameSearch, mfctyID, vo);
        for(CustomerBasedEntity customerBasedEntity: customerBasedEntityList){
            Integer custID = customerBasedEntity.getId();
            List<MaintainEntity> maintainEntityList = maintainDao.getMaintainListByCustID(custID);
            List<MaintainEntity> targetMaintainEntities = new ArrayList<>();
            if(maintainEntityList.size()==0){
                targetMaintainEntities.add(new MaintainEntity());
                targetMaintainEntities.add(new MaintainEntity());
            }else{
                if(maintainEntityList.size()==1){
                    MaintainEntity maintainEntityTemp = maintainEntityList.get(0);
                    Integer type = maintainEntityTemp.getMaintainType();
                    if(type!=null&&type==1){
                        targetMaintainEntities.add(maintainEntityTemp);
                        targetMaintainEntities.add(new MaintainEntity());
                    }else{
                        targetMaintainEntities.add(new MaintainEntity());
                        targetMaintainEntities.add(maintainEntityTemp);
                    }
                }else{
                    targetMaintainEntities.addAll(maintainEntityList);
                }
            }

            CustMaintainEntity custMaintainEntity = CustMaintainEntity.builder().customerBasedEntity(customerBasedEntity).maintainEntityList(targetMaintainEntities).build();
            custMaintainEntityList.add(custMaintainEntity);
        }
        if (CollectionUtils.isEmpty(custMaintainEntityList)) {
            custMaintainEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxCustomerDao.getAllCustomerListCount(nameSearch, mfctyID));
        }
        vo.setModel(custMaintainEntityList);
    }

    public List<CustMaintainEntity> getCustMainByCustID(Integer custID){
        List<CustMaintainEntity> custMaintainEntityList = new ArrayList<>();
        CustomerBasedEntity customerBasedEntity = wxCustomerDao.getCustomerByCustID(custID);
        if(customerBasedEntity==null)
            return custMaintainEntityList;
        List<MaintainEntity> maintainEntityList = maintainDao.getMaintainListByCustID(custID);
        List<MaintainEntity> input = new ArrayList<>();
        if(maintainEntityList.size()==1){
            MaintainEntity maintainEntity = maintainEntityList.get(0);
            int state = maintainEntity.getMaintainType();
            if(state==1){
                input.add(maintainEntity);input.add(new MaintainEntity());
            }else{
                input.add(new MaintainEntity());input.add(maintainEntity);
            }
        }else{
            input = maintainEntityList;
        }
        CustMaintainEntity custMaintainEntity = CustMaintainEntity.builder().customerBasedEntity(customerBasedEntity).maintainEntityList(input).build();
        custMaintainEntityList.add(custMaintainEntity);
        return custMaintainEntityList;

    }

    public int updateMaintain(Integer maintainUserID, String maintainTime, Integer developUserID, String logTime, Integer custID){
        String currentTime = TimeUtil.getCurrentTime();
        MaintainEntity developer = MaintainEntity.builder().custID(custID).userID(developUserID).createTime(logTime).updateTime(currentTime).maintainType(1).build();
        MaintainEntity maintainer = MaintainEntity.builder().custID(custID).userID(maintainUserID).createTime(maintainTime).updateTime(currentTime).maintainType(2).build();
        int developCount = maintainDao.getMaintainCount(developer);
        int maintainCount = maintainDao.getMaintainCount(maintainer);
        int developState=0;
        int maintainState=0;
        if(developCount==0){
            developState = maintainDao.createMaintain(developer);
        }else{
            developState = maintainDao.updateMaintain(developer);
        }

        if(maintainCount==0){
            maintainState = maintainDao.createMaintain(maintainer);
        }else{
            maintainState = maintainDao.updateMaintain(maintainer);
        }

        int developLogState = maintainLogDao.insertMaintainLog(developer);
        int maintainLogState = maintainLogDao.insertMaintainLog(maintainer);


        return (developState!=0&&maintainState!=0&&developLogState!=0&&maintainLogState!=0)? 1 : 0;
    }



}

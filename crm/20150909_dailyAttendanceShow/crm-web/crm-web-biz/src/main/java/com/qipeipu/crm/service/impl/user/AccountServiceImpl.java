package com.qipeipu.crm.service.impl.user;

import com.qipeipu.crm.dao.AccountDao;
import com.qipeipu.crm.dao.AreaDao;
import com.qipeipu.crm.dao.UserAreaDao;
import com.qipeipu.crm.dao.UserDutyDao;
import com.qipeipu.crm.dtos.basedata.AreaDetailEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.AccountEntity;
import com.qipeipu.crm.dtos.user.UserAreaEntity;
import com.qipeipu.crm.service.auth.AuthService;
import com.qipeipu.crm.service.user.AccountService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDao accountDao;

    @Autowired
    private UserAreaDao userAreaDao;

    @Autowired
    private AreaDao areaDao;

    @Autowired
    private UserDutyDao userDutyDao ;



    @Override
    public int createAccount(AccountEntity accountEntity) {
        Integer areaID = accountEntity.getAreaId();
        Integer dutyID = accountEntity.getDutyId();
        String createTime = accountEntity.getCreateTime();
        int i = accountDao.createAccount(accountEntity);
        Integer userID = accountEntity.getUserId();
        int j = userAreaDao.createUserArea(userID, areaID, createTime);
        int k = userDutyDao.createUserDuty(userID, dutyID, createTime);
//        int k = authService.insertRelationUserPlayRoleByUserId(userID, dutyID);
        return (i==1&&j==1&&k==1)? 1 : 0;
    }

    @Override
    public int updateAccount(AccountEntity accountEntity) {
        Integer userID = accountEntity.getUserId();
        Integer areaID = accountEntity.getAreaId();
        Integer dutyID = accountEntity.getDutyId();
        String updateTime = accountEntity.getUpdateTime();
        int i = accountDao.updateAccount(accountEntity);
        List<UserAreaEntity> userAreaEntities = userAreaDao.findByUserIdForUpdate(userID);
        List<Integer> dutys = userDutyDao.findByUserId(userID);
//        List<Integer> dutys = new ArrayList<>() ;
//        authService.findRoleIdsByUserId(userID , dutys) ;

        int j,k;
        if(CollectionUtils.isEmpty(userAreaEntities)){
            j = userAreaDao.createUserArea(userID, areaID, updateTime);
        }else{
            j = userAreaDao.updateUserArea(userID, areaID, updateTime);
        }

        if(CollectionUtils.isEmpty(dutys)){
            k = userDutyDao.createUserDuty(userID, dutyID, updateTime);
//            k = authService.insertRelationUserPlayRoleByUserId(userID , dutyID) ;
        }else{
            k = userDutyDao.updateUserDuty(userID, dutyID, updateTime);
//            k = authService.updateRelationUserPlayRoleByUserId(userID , dutyID) ;
        }
        return (i==1&&j==1&&k==1)? 1 : 0;
    }

    @Override
    public void getAccountList(VoModel<?, ?> vo, String key) {
        List<AccountEntity> accountEntityList = accountDao.getAccountList(vo, key);
        if (CollectionUtils.isEmpty(accountEntityList)) {
            accountEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(accountDao.getAccountListCount(key));
        }
        vo.setModel(accountEntityList);
    }

    @Override
    public List<AccountEntity> getAccountByID(Integer userID) {
        List<AccountEntity> accountEntityList = accountDao.getAccountByID(userID);
        for(AccountEntity accountEntity : accountEntityList){
            Integer areaID = accountEntity.getAreaId();
            List<AreaDetailEntity> areaDetailEntities = areaDao.getDetailByAreaID(areaID);
            AreaDetailEntity areaDetailEntity = CollectionUtils.isEmpty(areaDetailEntities)?null:areaDetailEntities.get(0);
            accountEntity.setAreaDetailEntity(areaDetailEntity);
        }
        return accountEntityList;
    }

    @Override
    public int delAccount(Integer userID){
        int i = accountDao.delAccountByID(userID);
        int j = userAreaDao.delUserAreaByUserID(userID);
        int k = userDutyDao.delUserDuty(userID);
//        int k = authService.deleteRelationUserPlayRoleByUserId(userID) ;
        return (i==1&&j==1&&k==1)? 1 : 0;
    }

    @Override
    public int resetPwd(Integer userID, String pwd) {
        return accountDao.resetPwd(userID, pwd);
    }

}

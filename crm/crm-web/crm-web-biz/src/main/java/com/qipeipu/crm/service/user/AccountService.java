package com.qipeipu.crm.service.user;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.AccountEntity;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public interface AccountService {

    public int createAccount(AccountEntity accountEntity);

    public int updateAccount(AccountEntity accountEntity);

    public void getAccountList(VoModel<?, ?> vo, String key);

    public List<AccountEntity> getAccountByID(Integer userID);

    public int delAccount(Integer userID);

    public int resetPwd(Integer userID,String pwd);
}

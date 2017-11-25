package com.qipeipu.crm.service.impl.customer;

import com.qipeipu.crm.dao.OrgFilterDao;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.statistics.QpuUserDao;
import com.qipeipu.crm.dtos.customer.QpuOrgDetailVo;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.service.customer.OrgService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/5/25.
 */
@Slf4j
@Service
public class OrgServiceImpl implements OrgService {

    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private OrgFilterDao orgFilterDao;
    @Autowired
    private QpuUserDao qpuUserDao;

    private static final Logger logger = Logger
            .getLogger(OrgServiceImpl.class);

    /**
     * 分页查询汽修厂管理
     * @param key
     * @param vo
     */
    @Override
    public void getOrgDetailForPage(String key, VoModel<?, ?> vo){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuOrgEntity> qpuOrgEntities = qpuOrgDao.getOrgDetailForPage(key, vo);
        if (CollectionUtils.isEmpty(qpuOrgEntities)) {
            qpuOrgEntities = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(qpuOrgDao.getOrgCount(key));
        }
        vo.setModel(qpuOrgEntities);
        MultipleDataSource.setDataSourceKey("dataSource");
    }
    /**
     * 查询指定id的汽修厂管理
     * @param orgID
     * @return
     */
    @Override
    public QpuOrgDetailVo getOrgDetailByID(String orgID){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuOrgEntity> qpuOrgEntities = qpuOrgDao.getOrgDetailByID(orgID);
        if(BaseJudgeUtil.isEmpty(qpuOrgEntities)){
            return null;
        }
        QpuOrgEntity qpuOrgEntity = qpuOrgEntities.get(0);
        QpuOrgDetailVo result = new QpuOrgDetailVo();
        String facadePics = qpuOrgEntity.getFacadePics();
        result.setQpuOrgEntity(qpuOrgEntity);
        if(facadePics!=null){
            result.setOrgFacadePics(facadePics.split(","));
        }
        MultipleDataSource.setDataSourceKey("dataSource");
        int count = orgFilterDao.countOrgByID(qpuOrgEntity.getOrgID());
        if(count>=1){
            result.setFilter(true);
        }else{
            result.setFilter(false);
        }
        return result;
    }
    /**
     * 修改汽修厂详情（汽修厂管理）
     * @param qpuOrgDetailVo
     * @return
     */
    @Override
    public int updateOrgDetail(QpuOrgDetailVo qpuOrgDetailVo) throws Exception {
        QpuOrgEntity qpuOrgEntity = qpuOrgDetailVo.getQpuOrgEntity();
        boolean isFilter = qpuOrgDetailVo.isFilter();
        String[] facadePics = qpuOrgDetailVo.getOrgFacadePics();
        StringBuilder sbForPics = new StringBuilder();
        if (!BaseJudgeUtil.isEmpty(facadePics)) {
            for (int i = 0; i < facadePics.length; i++) {
                sbForPics.append(facadePics[i]).append(",");
            }
            String pics = sbForPics.toString().substring(0, sbForPics.toString().length() - 1);
            qpuOrgEntity.setFacadePics(pics);
        }
        int insertOrDelFilterOrgState = 0;
        int updateOrgDetailState = 0;
        if (isFilter) {
            int filterCount = orgFilterDao.countOrgByID(qpuOrgEntity.getOrgID());
            if (filterCount == 0) {
                insertOrDelFilterOrgState = orgFilterDao.insertFilterOrg(qpuOrgEntity.getOrgID());
            }
        } else {
            insertOrDelFilterOrgState = orgFilterDao.delFilterOrg(qpuOrgEntity.getOrgID());
        }
        MultipleDataSource.setDataSourceKey("mainDataSource");
        updateOrgDetailState = qpuOrgDao.updateOrgDetail(qpuOrgEntity);
        MultipleDataSource.setDataSourceKey("dataSource");
        return (insertOrDelFilterOrgState>0&&updateOrgDetailState>0) ? 1 : 0;
    }
    /**
     * 获取指定厂的帐号列表
     * @param orgID
     * @param vo
     */
    @Override
    public void getSpecifyMfctyForAccount(String orgID, VoModel<?, ?> vo){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuUserEntity> qpuUserEntities = qpuUserDao.getUserListByMfctyID(orgID, vo);
        if (CollectionUtils.isEmpty(qpuUserEntities)) {
            qpuUserEntities = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(qpuUserDao.getUserListByMfctyIDCount(orgID));
        }
        vo.setModel(qpuUserEntities);
        MultipleDataSource.setDataSourceKey("dataSource");
    }
    /**
     * 删除指定汽修厂的用户id
     * @param userID
     * @return
     */
    @Override
    public int delQpuUserByID(String userID){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int delState = qpuUserDao.delQpuUserByID(userID);
        MultipleDataSource.setDataSourceKey("dataSource");
        return delState;
    }
    /**
     * 插入新用户
     * @param qpuUserEntity
     * @return
     */
    @Override
    public int insertQpuUser(QpuUserEntity qpuUserEntity){

        MultipleDataSource.setDataSourceKey("mainDataSource");
        int result = qpuUserDao.insertQpuUser(qpuUserEntity);
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }
    /**
     * 批量更新用户
     * @param qpuUserEntities
     * @return
     */
    @Override
    public int batchUpdateQpuUser(List<QpuUserEntity> qpuUserEntities){
        if(BaseJudgeUtil.isEmpty(qpuUserEntities)){
            return 1;
        }
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int result = 0;
        for(QpuUserEntity qpuUserEntity:qpuUserEntities) {
            result = qpuUserDao.batchUpdateQpuUser(qpuUserEntity);
        }
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }
    /**
     * 重置用户密码
     * @param userID
     * @param pwd
     * @return
     */
    @Override
    public int resetPwd(String userID, String pwd){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int result = qpuUserDao.resetQpuUserPasswordByUserID(userID, pwd);
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }
    /**
     * 获取指定用户的详细信息
     * @param userID
     * @return
     */
    @Override
    public QpuUserEntity getUserByUserID(String userID) {
        MultipleDataSource.setDataSourceKey("mainDataSource");
        QpuUserEntity result =  qpuUserDao.getUserByUserID(userID);
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }

    /**
     * 判断该账户是否存在
     * @param loginKey
     * @return
     */
    @Override
    public boolean countExistAccount(String loginKey, String userID){

        int isHasExistAccountInDataBase = qpuUserDao.countExistAccountByUserID(loginKey, userID);
        if(isHasExistAccountInDataBase>0)
            return false;

        int result = qpuUserDao.countExistAccount(loginKey);
        if(result>0){
            return true;
        }else{
            return false;
        }
    }

    //获取组织用户的名字
    @Override
    public int findOrgNameById(String id, List<String> orgNames) {
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<String> tmp =  qpuOrgDao.getMfctyNameByMfctyID(id);
        MultipleDataSource.setDataSourceKey("dataSource");
        for(String i : tmp) orgNames.add(i) ;

        return 0;
    }

}

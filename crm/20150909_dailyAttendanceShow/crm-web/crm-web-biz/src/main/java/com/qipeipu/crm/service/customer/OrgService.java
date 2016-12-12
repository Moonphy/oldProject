package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dtos.customer.QpuOrgDetailVo;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by laiyiyu on 2015/5/25.
 */
public interface OrgService {
    /**
     * 分页查询汽修厂管理
     * @param key
     * @param vo
     */
    public void getOrgDetailForPage(@Param("key") String key, @Param("vo") VoModel<?, ?> vo);
    /**
     * 查询指定id的汽修厂管理
     * @param orgID
     * @return
     */
    public QpuOrgDetailVo getOrgDetailByID(String orgID);
    /**
     * 修改汽修厂详情（汽修厂管理）
     * @param qpuOrgDetailVo
     * @return
     */
    @Transactional(readOnly =  false , rollbackFor =  Exception.class)
    public int updateOrgDetail(QpuOrgDetailVo qpuOrgDetailVo) throws Exception;
    /**
     * 获取指定厂的帐号列表
     * @param orgID
     * @param vo
     */
    public void getSpecifyMfctyForAccount(String orgID, VoModel<?, ?> vo);
    /**
     * 删除指定汽修厂的用户id
     * @param userID
     * @return
     */
    public int delQpuUserByID(String userID);
    /**
     * 插入新用户
     * @param qpuUserEntity
     * @return
     */
    public int insertQpuUser(QpuUserEntity qpuUserEntity);
    /**
     * 批量更新用户
     * @param qpuUserEntities
     * @return
     */
    public int batchUpdateQpuUser(List<QpuUserEntity> qpuUserEntities);
    /**
     * 重置用户密码
     * @param userID
     * @param pwd
     * @return
     */
    public int resetPwd(String userID, String pwd);
    /**
     * 获取指定用户的详细信息
     * @param userID
     * @return
     */
    public QpuUserEntity getUserByUserID(String userID);
    /**
     * 判断该账户是否存在
     * @param loginKey
     * @return
     */
    public boolean countExistAccount(String loginKey, String userID);

    /**
     * 获取组织用户的名字
     * @param id 组织id
     * @param orgNames 返回用户名字列表
     * @return 运行信息
     */
    public int findOrgNameById(String id , List<String> orgNames) ;
}

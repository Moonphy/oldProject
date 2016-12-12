package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dao.bean.EggRoleRecord;
import com.qipeipu.crm.dao.bean.SuperEggPlayerRecord;
import com.qipeipu.crm.dtos.customer.OrgForHitEggEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserHitEggDTO;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/3.
 */
public interface HitEggService {
    /**
     * 获取砸蛋等级列表
     * @param key
     * @param vo
     */
    public void getHitEggLevelList(String key, VoModel<?, ?> vo);
    /**
     * 修改指定厂的砸蛋等级
     * @param orgForHitEggEntity
     * @return
     */
    public int updateOrgLevel(OrgForHitEggEntity orgForHitEggEntity);

    /**
     * 获取汽修厂的相关帐号的砸蛋信息列表
     * @param orgId 组织id
     * @param vo 分页数据模型
     * @return 错误信息
     */
    public int getUserHitEggLevelList(long orgId, VoModel vo);

    /**
     * 更新相关帐号的砸蛋信息
     * @param userHitEggDTO 帐号砸蛋信息
     * @return 错误信息
     */
    public int updateUserLevel(UserHitEggDTO userHitEggDTO);

    /**
     * 获取汽修厂的相关砸蛋信息
     * @param orgIds ids
     * @param res 结果
     * @return 错误信息
     */
    public int getCorrespondingLevelsByOrgIDs(List<Long> orgIds , List<Integer> res) ;

    /**
     * 通过用户id查询相关砸蛋信息
     * @param userId 用户id
     * @return 结果模型
     */
    public ResultDTO<SuperEggPlayerRecord> findSuperEggPlayerRecordByUserId(long userId);

    /**
     * 将砸蛋规则修改操作录入系统操作日志
     * @param operator 操作人信息
     * @param oldRe 更改前信息
     * @param newRe 更改后信息
     * @return 错误信息
     */
    int addEditOperationInfo2SysLog(UserDTO operator , SuperEggPlayerRecord oldRe, SuperEggPlayerRecord newRe);

    /**
     * 获取所有砸蛋等级信息
     * @param res 返回所有记录
     * @return 错误信息
     */
    int findEggRoleList(List<EggRoleRecord> res);
}

package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dtos.customer.OrgForVipVo;
import com.qipeipu.crm.dtos.customer.OrgVipEntity;
import com.qipeipu.crm.dtos.global.VoModel;

/**
 * Created by laiyiyu on 2015/6/3.
 */
public interface VipService {
    /**
     * 查询vip用户列表
     * @param key
     * @param vo
     * @param isVip
     */
    public void getOrgForVipList(String key, VoModel<?, ?> vo, Boolean isVip);
    /**
     * 查询指定vip用户
     * @param orgID
     * @return
     */
    public OrgForVipVo getOrgForVipVoByOrgID(String orgID);
    /**
     * 删除指定vip用户
     * @param orgID
     * @return
     */
    public int delVipByOrgID(String orgID);
    /**
     * 更新指定vip用户
     * @param orgVipEntity
     * @return
     */
    public int updateVipByOrg(OrgVipEntity orgVipEntity);
    /**
     * 添加vip用户
     * @param orgVipEntity
     * @return
     */
    public int addVip(OrgVipEntity orgVipEntity);
    /**
     * 设置vip用户
     * @param orgVipEntity
     * @return
     */
    public int setVip(OrgVipEntity orgVipEntity);
}

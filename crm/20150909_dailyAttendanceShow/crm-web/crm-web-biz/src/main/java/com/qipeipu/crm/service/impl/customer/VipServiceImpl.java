package com.qipeipu.crm.service.impl.customer;

import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.VipForOrgDao;
import com.qipeipu.crm.dtos.customer.OrgForVipVo;
import com.qipeipu.crm.dtos.customer.OrgVipEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.service.customer.VipService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@Service
public class VipServiceImpl implements VipService {

    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private VipForOrgDao vipForOrgDao;

    /**
     * 查询vip用户列表
     * @param key
     * @param vo
     * @param isVip
     */
    @Override
    public void getOrgForVipList(String key, VoModel<?, ?> vo, Boolean isVip){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        String currentTime = TimeUtil.getCurrentTime();
        List<OrgForVipVo> orgForVipVos = qpuOrgDao.getOrgForVipList(key, vo, isVip, currentTime);
        if (CollectionUtils.isEmpty(orgForVipVos)) {
            orgForVipVos = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(qpuOrgDao.getOrgForVipListForCount(key, isVip, currentTime));
        }
        fillOrgForVipVoListDetail(orgForVipVos, isVip);
        vo.setModel(orgForVipVos);
        MultipleDataSource.setDataSourceKey("dataSource");
    }

    private void fillOrgForVipVoListDetail(List<OrgForVipVo> input, Boolean isVip){
        String currentTime = TimeUtil.getCurrentTime();
        for(OrgForVipVo orgForVipVo : input){
            if(isVip!=null) {
                orgForVipVo.setVip(isVip);
            }else{
                Integer levelID = orgForVipVo.getLevelID();
                if(levelID==null){
                    orgForVipVo.setVip(false);
                }else{
                    if(orgForVipVo.getStartTime()!=null&&orgForVipVo.getEndTime()!=null&&currentTime.compareTo(orgForVipVo.getStartTime())>0&&currentTime.compareTo(orgForVipVo.getEndTime())<0){
                        orgForVipVo.setVip(true);
                    }else{
                        orgForVipVo.setVip(false);
                    }
                }
            }
        }
    }

    /**
     * 查询指定vip用户
     * @param orgID
     * @return
     */
    @Override
    public OrgForVipVo getOrgForVipVoByOrgID(String orgID){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        String currentTime = TimeUtil.getCurrentTime();
        OrgForVipVo orgForVipVo = qpuOrgDao.getOrgForVipByOrgID(orgID);
        Integer levelID = orgForVipVo.getLevelID();
        if(levelID==null){
            orgForVipVo.setVip(false);
        }else{
            if(orgForVipVo.getStartTime()!=null&&orgForVipVo.getEndTime()!=null&&currentTime.compareTo(orgForVipVo.getStartTime())>0&&currentTime.compareTo(orgForVipVo.getEndTime())<0){
                orgForVipVo.setVip(true);
            }else{
                orgForVipVo.setVip(false);
            }
        }
        MultipleDataSource.setDataSourceKey("dataSource");
        return orgForVipVo;
    }

    /**
     * 删除指定vip用户
     * @param orgID
     * @return
     */
    @Override
    public int delVipByOrgID(String orgID){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int state =  vipForOrgDao.delVipByOrgID(orgID);
        MultipleDataSource.setDataSourceKey("dataSource");
        return state;

    }

    /**
     * 更新指定vip用户
     * @param orgVipEntity
     * @return
     */
    @Override
    public int updateVipByOrg(OrgVipEntity orgVipEntity){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        orgVipEntity.setUpdateTime(TimeUtil.getCurrentTime());
        int state = vipForOrgDao.updateVipByOrgID(orgVipEntity);
        MultipleDataSource.setDataSourceKey("dataSource");
        return state;
    }

    /**
     * 添加vip用户
     * @param orgVipEntity
     * @return
     */
    @Override
    public int addVip(OrgVipEntity orgVipEntity){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        orgVipEntity.setCreateTime(TimeUtil.getCurrentTime());
        int state = vipForOrgDao.addVip(orgVipEntity);
        MultipleDataSource.setDataSourceKey("dataSource");
        return state;
    }

    /**
     * 设置vip用户
     * @param orgVipEntity
     * @return
     */
    @Override
    public int setVip(OrgVipEntity orgVipEntity){
        String orgID = orgVipEntity.getOrgID();
        int result = 0;
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int num = vipForOrgDao.countVipByOrgID(orgID);
        if(num>0){
            result = vipForOrgDao.updateVipByOrgID(orgVipEntity);
        }else{
            result = vipForOrgDao.addVip(orgVipEntity);
        }
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }


}

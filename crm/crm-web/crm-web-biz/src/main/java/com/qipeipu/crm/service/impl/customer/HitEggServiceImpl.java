package com.qipeipu.crm.service.impl.customer;

import com.google.common.collect.Lists;
import com.qipeipu.crm.constant.HitEggConst;
import com.qipeipu.crm.dao.EggRoleDAO;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.SupperEggPlayerDAO;
import com.qipeipu.crm.dao.bean.EggRoleRecord;
import com.qipeipu.crm.dao.bean.OrgHitEggLevelRecord;
import com.qipeipu.crm.dao.bean.SuperEggPlayerRecord;
import com.qipeipu.crm.dao.bean.SysOperationLogRecord;
import com.qipeipu.crm.dao.statistics.OrgLevelForEggDao;
import com.qipeipu.crm.dao.statistics.QpuUserDao;
import com.qipeipu.crm.dtos.customer.OrgForHitEggEntity;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.QpuUserEntity;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.dtos.user.UserHitEggDTO;
import com.qipeipu.crm.service.customer.HitEggService;
import com.qipeipu.crm.service.log.SysOperationLogService;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.bean.tools.GUtils;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by laiyiyu on 2015/6/3.
 */
@Service
public class HitEggServiceImpl implements HitEggService {

    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private OrgLevelForEggDao orgLevelForEggDao;
    @Autowired
    private QpuUserDao qpuUserDao;
    @Autowired
    private SupperEggPlayerDAO supperEggPlayerDAO ;
    @Autowired
    private EggRoleDAO eggRoleDAO ;
    @Autowired
    private SysOperationLogService sysOperationLogService ;


    //更新DTO
    public int updateDTO(UserHitEggDTO dto ,
                         QpuUserEntity userRe ,
                         OrgHitEggLevelRecord orgHitEggLevelRe ,
                         EggRoleRecord eggRoleRe) {
        //生效时间
        //String startTime = (null == r2.getUpdateTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(r2.getUpdateTime())) ;

        dto.setOrgId(GUtils.isEmptyOrNull(userRe.getOrgID()) ? 0 : Long.parseLong(userRe.getOrgID()));
        dto.setUserName(userRe.getUserName());
        dto.setUserId(GUtils.isEmptyOrNull(userRe.getUserID()) ? 0 : Long.parseLong(userRe.getUserID()));
        dto.setUserName(userRe.getUserName());
        dto.setUserLoginName(userRe.getLoginName());
        dto.setUserLoginMobile(userRe.getLoginMobile());
        dto.setUserLoginEmail(userRe.getLoginEmail());
        dto.setRuleLevel(orgHitEggLevelRe.getState());
        dto.setRuleLevelName(HitEggConst.getRoleName(orgHitEggLevelRe.getState()));
        dto.setRatio(eggRoleRe.getRatio());
        //dto.setStartTime(startTime);
        dto.setStartTime("");
        dto.setEndTime("");

        return 0 ;
    }
    public int updateDTO(UserHitEggDTO dto , SuperEggPlayerRecord eggPlayerRe) {
        //生效时间
        String startTime = (null == eggPlayerRe.getStartTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(eggPlayerRe.getStartTime())) ;
        //失效时间
        String endTime = (null == eggPlayerRe.getEndTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(eggPlayerRe.getEndTime())) ;

        dto.setOrgId(eggPlayerRe.getOrgId());
        dto.setUserId(eggPlayerRe.getUserId());
        dto.setStartTime(startTime);
        dto.setEndTime(endTime);
        dto.setRuleLevel(eggPlayerRe.getLevel());
        dto.setRuleLevelName(HitEggConst.getRoleName(eggPlayerRe.getLevel()));
        dto.setRatio(eggPlayerRe.getRatio());

        return 0 ;
    }
    private int updateDTO(OrgForHitEggEntity dto,
                          QpuOrgEntity r1,
                          QpuUserEntity r2,
                          Integer r3) {
        //登录帐号名
        String loginAccount = r2.getLoginName() ;
        if (null != r2.getLoginEmail()) loginAccount = r2.getLoginEmail() ;
        if (null != r2.getLoginMobile()) loginAccount = r2.getLoginMobile() ;

        dto.setOrgID(r1.getOrgID());
        dto.setMfctyName(r1.getMfctyName());
        dto.setAddress(r1.getAddress());
        dto.setCityName(r1.getCityName());
        dto.setAuditTime(r1.getAuditTime());
        dto.setRuleLevel(r3);
        dto.setLoginAccount(loginAccount);

        return 0;
    }



    /**
     * 获取砸蛋等级列表
     * @param key
     * @param vo
     */
    @Override
    public void getHitEggLevelList(String key, VoModel<?, ?> vo){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuOrgEntity> qpuOrgEntities = qpuOrgDao.getOrgDetailForPage(key, vo);
        if (CollectionUtils.isEmpty(qpuOrgEntities)) {
            qpuOrgEntities = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(qpuOrgDao.getOrgCount(key));
        }
        MultipleDataSource.setDataSourceKey("dataSource");

        List<OrgForHitEggEntity> orgForHitEggEntities = QpuOrgEntitiesToOrgForHitEggEntities(qpuOrgEntities);
        vo.setModel(orgForHitEggEntities);
    }

    //获取汽修厂s的相关砸蛋信息
    @Override
    public int getCorrespondingLevelsByOrgIDs(List<Long> orgIds , List<Integer> res) {
        if (orgIds.isEmpty()) return 1 ;
        List<OrgHitEggLevelRecord> tmpRes = orgLevelForEggDao.getOrgIDsWithLevelsByOrgIDs(orgIds);

        //映射
        Map<Long , Integer> id2LevelMap = new HashMap<>() ;
        for(OrgHitEggLevelRecord i : tmpRes) id2LevelMap.put(i.getOrgId() , i.getState()) ;

        //录入
        for(Long i : orgIds) {
            Integer tmp = id2LevelMap.get(i) ;
            res.add(null == tmp ? -1 : tmp) ;
        }

        return 0 ;
    }

    //通过用户id查询相关砸蛋信息
    @Override
    public ResultDTO<SuperEggPlayerRecord> findSuperEggPlayerRecordByUserId(long userId) {
        if (userId <= 0) return ResultDTO.failResult(1 , "userId应为正整数") ;
        List<SuperEggPlayerRecord> tmpRes = supperEggPlayerDAO.findByUserIds(Lists.newArrayList(userId)) ;
        if (tmpRes.isEmpty()) return ResultDTO.failResult(2 , "找不到该用户的砸蛋记录") ;
        return ResultDTO.successResult(tmpRes.get(0)) ;
    }

    @Override
    public int addEditOperationInfo2SysLog(UserDTO operator , SuperEggPlayerRecord oldRe, SuperEggPlayerRecord newRe) {
        if (oldRe == newRe) return 0 ;

        //更改的用户id
        long userId = (long) 0 ;
        if (null != oldRe.getUserId()) userId = oldRe.getUserId() ;
        if (null != newRe.getUserId() && ! newRe.getUserId().equals(userId)) return 2 ;
        if (userId <= 0) return 1 ;

        //用户名称
        MultipleDataSource.setDataSourceKey("mainDataSource");
        QpuUserEntity qpuUserEntity = qpuUserDao.getUserByUserID(userId + "") ;
        MultipleDataSource.setDataSourceKey("dataSource");
        String userName = qpuUserEntity.getUserName() ;

        //记录初始化
        SysOperationLogRecord tmp = new SysOperationLogRecord() ;
        tmp.setOperatorId(null == operator.getUserId() ? 0 : operator.getUserId().longValue());
        tmp.setOperatorName(null == operator.getUserName() ? "未知" : operator.getUserName()) ;
        tmp.setOperationTypeId(3);                  //修改
        tmp.setBizModelTypeId((long) 2);            //2:用户砸蛋规则管理
        tmp.setBizModelName("用户砸蛋规则管理");    //2:用户砸蛋规则管理
        tmp.setBizModelKey(userId);                 //用户id

        //描述头
        String decHead = userName + "的砸蛋规则:" ;

        //中奖规则等级变化
        int oldLevel = (null == oldRe.getLevel() ? HitEggConst.HitEggRole.MID.getLevel() : oldRe.getLevel()) ;
        int newLevel = (null == newRe.getLevel() ? HitEggConst.HitEggRole.MID.getLevel() : newRe.getLevel());
        if (0 != Integer.compare(oldLevel , newLevel)) {
            String dec = "中奖规则等级变化:"+ HitEggConst.getRoleName(oldLevel) + "->" + HitEggConst.getRoleName(newLevel) + ";" ;
            tmp.setDescription(decHead + dec);
            sysOperationLogService.addRecord(tmp) ;
        }

        //中奖金额比率(千分比)变化
        EggRoleRecord defaultRe = eggRoleDAO.findByLevel(HitEggConst.HitEggRole.MID.getLevel()) ;
        int oldRatio = (null == oldRe.getRatio() ? defaultRe.getRatio() : oldRe.getRatio()) ;
        int newRatio = (null == newRe.getRatio() ? defaultRe.getRatio() : newRe.getRatio());
        if (0 != Integer.compare(oldRatio , newRatio)) {
            String dec = "中奖金额比率(千分比)变化:"+ oldRatio + "->" + newRatio + ";" ;
            tmp.setDescription(decHead + dec);
            sysOperationLogService.addRecord(tmp) ;
        }

        //起始时间变化
        String oldStartTime = (null == oldRe.getStartTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(oldRe.getStartTime())) ;
        String newStartTime = (null == newRe.getStartTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(newRe.getStartTime())) ;
        if (0 != oldStartTime.compareTo(newStartTime)) {
            String dec = "起始时间变化:"+ oldStartTime + "->" + newStartTime + ";" ;
            tmp.setDescription(decHead + dec);
            sysOperationLogService.addRecord(tmp) ;
        }

        //终止时间变化
        String oldEndTime = (null == oldRe.getEndTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(oldRe.getEndTime())) ;
        String newEndTime = (null == newRe.getEndTime() ? "" : TimeUtil.dateToyyyyMMddHHmmss(newRe.getEndTime())) ;
        if (0 != oldEndTime.compareTo(newEndTime)) {
            String dec = "终止时间变化:"+ oldEndTime + "->" + newEndTime + ";" ;
            tmp.setDescription(decHead + dec);
            sysOperationLogService.addRecord(tmp) ;
        }

        return 0;
    }

    //获取所有砸蛋等级信息
    @Override
    public int findEggRoleList(List<EggRoleRecord> res) {
        List<EggRoleRecord> tmpRes = eggRoleDAO.findAllEggRoleLevelAndEggRoleName() ;
        for(EggRoleRecord i : tmpRes) res.add(i) ;
        return 0;
    }

    /**
     * 获取汽修厂s的主帐号信息（不应该放这里）
     * @param orgIds ids
     * @param res 结果
     * @return 错误信息
     */
    private int getCorrespondingMainUserByOrgIDs(List<Long> orgIds , List<QpuUserEntity> res) {
        if (orgIds.isEmpty()) return 1 ;
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuUserEntity> tmpRes = qpuUserDao.getMainUsersByOrgIds(orgIds);
        MultipleDataSource.setDataSourceKey("dataSource");

        //映射
        Map<Long , QpuUserEntity> orgId2UserMap = new HashMap<>() ;
        for(QpuUserEntity i : tmpRes)
            if (! GUtils.isEmptyOrNull(i.getOrgID()))
                orgId2UserMap.put(Long.parseLong(i.getOrgID()) , i) ;

        //录入
        for(Long i : orgIds) {
            QpuUserEntity tmp = orgId2UserMap.get(i) ;
            res.add(null == tmp ? new QpuUserEntity() : tmp) ;
        }

        return 0 ;
    }


    private List<OrgForHitEggEntity> QpuOrgEntitiesToOrgForHitEggEntities(List<QpuOrgEntity> input){
        List<OrgForHitEggEntity> result = new ArrayList<>();

        //获取汽修厂的主帐号
        List<Long> orgIds = new ArrayList<>() ;
        for(QpuOrgEntity i : input)
            orgIds.add(GUtils.isEmptyOrNull(i.getOrgID()) ? 0 : Long.parseLong(i.getOrgID())) ;
        List<QpuUserEntity> users = new ArrayList<>() ;
        getCorrespondingMainUserByOrgIDs(orgIds , users) ;

        //汽修厂的砸蛋规则
        List<Integer> levels = new ArrayList<>() ;
        getCorrespondingLevelsByOrgIDs(orgIds , levels) ;
        //插入新汽修厂的默认砸蛋规则
        for(int i = 0 ; i < input.size() ; i ++)
            if (levels.get(i) == -1) {
                levels.set(i , 3) ;
                OrgForHitEggEntity tmp = OrgForHitEggEntity.builder()
                        .orgID(input.get(i).getOrgID())
                        .ruleLevel(levels.get(i))
                        .createTime(TimeUtil.getCurrentTime())
                        .build() ;
                orgLevelForEggDao.addOrgLevel(tmp);
            }

        for(int i = 0 ; i < input.size() ; i ++) {
            OrgForHitEggEntity tmp = new OrgForHitEggEntity() ;
            updateDTO(tmp, input.get(i), users.get(i) , levels.get(i)) ;
            result.add(tmp) ;
        }

//        for(QpuOrgEntity orgEntity : input){
//            String orgID = orgEntity.getOrgID();
//            OrgForHitEggEntity orgForHitEggEntity = OrgForHitEggEntity.builder().address(orgEntity.getAddress()).cityName(orgEntity.getCityName())
//                    .mfctyName(orgEntity.getMfctyName()).auditTime(orgEntity.getAuditTime()).orgID(orgID).build();
//
//            //Integer superEggPlayerCount = supperEggPlayerDAO.getCountByOrgID(orgID);
//            //orgForHitEggEntity.setSuperEggPlayerCount(superEggPlayerCount);
//            Integer level = orgLevelForEggDao.getLevelByOrgID(orgID);
//            if(level==null){
//                level = 3;
//                orgForHitEggEntity.setRuleLevel(level);
//                String currentTime = TimeUtil.getCurrentTime();
//                orgForHitEggEntity.setCreateTime(currentTime);
//                orgLevelForEggDao.addOrgLevel(orgForHitEggEntity);
//            }else {
//                orgForHitEggEntity.setRuleLevel(level);
//            }
//            MultipleDataSource.setDataSourceKey("mainDataSource");
//            List<QpuUserEntity> qpuUserEntities = qpuUserDao.getUserListByMfctyIDForHitEgg(orgID);
//            MultipleDataSource.setDataSourceKey("dataSource");
//            if(!BaseJudgeUtil.isEmpty(qpuUserEntities)){
//                QpuUserEntity qpuUserEntity = qpuUserEntities.get(0);
//                if(!BaseJudgeUtil.isEmpty(qpuUserEntity.getLoginMobile())){
//                    orgForHitEggEntity.setLoginAccount(qpuUserEntity.getLoginMobile());
//                }else{
//                    orgForHitEggEntity.setLoginAccount(qpuUserEntity.getLoginEmail());
//                }
//            }
//            result.add(orgForHitEggEntity);
//        }
//        MultipleDataSource.setDataSourceKey("dataSource");

        return result;
    }

    /**
     * 修改指定厂的砸蛋等级
     * @param orgForHitEggEntity
     * @return
     */
    @Override
    public int updateOrgLevel(OrgForHitEggEntity orgForHitEggEntity){
        if (GUtils.isEmptyOrNull(orgForHitEggEntity.getOrgID())) return -1 ;
        Integer level = orgLevelForEggDao.getLevelByOrgID(orgForHitEggEntity.getOrgID());
        if (null == level) {
            orgForHitEggEntity.setCreateTime(TimeUtil.getCurrentTime());
            return orgLevelForEggDao.addOrgLevel(orgForHitEggEntity) ;
        }
        return orgLevelForEggDao.updateOrgLevelByOrg(orgForHitEggEntity);
    }

    //获取汽修厂的相关帐号的砸蛋信息列表
    @Override
    public int getUserHitEggLevelList(long orgId, VoModel vo) {
        List<UserHitEggDTO> userHitEggDTOs = new ArrayList<>() ;

        //获取汽修厂帐户列表(分页)
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuUserEntity> users = new ArrayList<>() ;
        List tmpRe = qpuUserDao.getUserListByMfctyID(orgId + "" , vo) ;
        MultipleDataSource.setDataSourceKey("dataSource");
        for(Object i : tmpRe) users.add((QpuUserEntity)i) ;

        //获取汽修厂砸蛋规则等级
        OrgHitEggLevelRecord orgHitEggLevelRecord = orgLevelForEggDao.findByOrgID(orgId) ;
        if (null == orgHitEggLevelRecord) orgHitEggLevelRecord = OrgHitEggLevelRecord.builder().state(0).build() ;

        //获取规则等级信息
        EggRoleRecord eggRoleRecord = eggRoleDAO.findByLevel(orgHitEggLevelRecord.getState()) ;
        if (null == eggRoleRecord) eggRoleRecord = new EggRoleRecord() ;

        //获取特殊用户信息
        List<SuperEggPlayerRecord> superEggPlayerRecords = supperEggPlayerDAO.findByOrgId(orgId) ;
        Map<Long , SuperEggPlayerRecord> id2ReMap = new HashMap<>() ;
        for(SuperEggPlayerRecord i : superEggPlayerRecords)
            if (null != i.getUserId()) id2ReMap.put(i.getUserId() , i) ;

        //数据录入
        for(QpuUserEntity i : users) {
            if (null == i.getUserID()) continue ;

            UserHitEggDTO tmp = new UserHitEggDTO() ;
            updateDTO(tmp , i , orgHitEggLevelRecord , eggRoleRecord) ;
            SuperEggPlayerRecord superRe = id2ReMap.get(Long.parseLong(i.getUserID())) ;
            if (null != superRe) updateDTO(tmp , superRe) ;

            userHitEggDTOs.add(tmp) ;
        }
        vo.setModel(userHitEggDTOs) ;

        return 0;
    }

    //更新相关帐号的砸蛋信息
    @Override
    public int updateUserLevel(UserHitEggDTO userHitEggDTO) {
        if (null == userHitEggDTO.getUserId()) return -1 ;
        MultipleDataSource.setDataSourceKey("mainDataSource");
        QpuUserEntity tmpQpuUser = qpuUserDao.getUserByUserID(userHitEggDTO.getUserId() + "") ;
        MultipleDataSource.setDataSourceKey("dataSource");
        if (null == tmpQpuUser) return -1 ;

        //开始结束时间
        Date startTime = (GUtils.isEmptyOrNull(userHitEggDTO.getStartTime()) ?
                new Date() : TimeUtil.yyyyMMddHHmmssToDate(userHitEggDTO.getStartTime())) ;
        Date endTime = (GUtils.isEmptyOrNull(userHitEggDTO.getEndTime()) ?
                new Date() : TimeUtil.yyyyMMddHHmmssToDate(userHitEggDTO.getEndTime())) ;

        //录入数据
        SuperEggPlayerRecord tmpRe = SuperEggPlayerRecord.builder()
                .userId(userHitEggDTO.getUserId())
                .orgId((long) Integer.parseInt(tmpQpuUser.getOrgID()))
                .startTime(startTime)
                .endTime(endTime)
                .level(userHitEggDTO.getRuleLevel())
                .ratio(null == userHitEggDTO.getRatio() ? 0 : userHitEggDTO.getRatio())
                .build() ;

        return supperEggPlayerDAO.insertOrUpDateSuperEggPlayer(tmpRe) ;
    }


}


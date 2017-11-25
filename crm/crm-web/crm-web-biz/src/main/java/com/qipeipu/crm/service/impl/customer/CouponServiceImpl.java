package com.qipeipu.crm.service.impl.customer;

import com.alibaba.dubbo.common.utils.StringUtils;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.mchange.lang.IntegerUtils;
import com.qipeipu.crm.constant.CouponConst;
import com.qipeipu.crm.dao.CouponDao;
import com.qipeipu.crm.dao.CouponTypeDAO;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dao.bean.CouponTypeRecord;
import com.qipeipu.crm.dao.bean.SysOperationLogRecord;
import com.qipeipu.crm.dtos.customer.CouponEntity;
import com.qipeipu.crm.dtos.customer.CouponTotalEntity;
import com.qipeipu.crm.dtos.customer.OrgForCouponEntity;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.service.base.CouponTypeService;
import com.qipeipu.crm.service.customer.CouponService;
import com.qipeipu.crm.service.customer.OrgService;
import com.qipeipu.crm.service.log.SysOperationLogService;
import com.qipeipu.crm.service.transformer.OrgForCouponEntityTransformer;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import freemarker.template.utility.NumberUtil;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by laiyiyu on 2015/6/2.
 */
@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private QpuOrgDao qpuOrgDao;
    @Autowired
    private CouponDao couponDao;
    @Autowired
    private SysOperationLogService sysOperationLogService ;
    @Autowired
    private OrgService orgService ;
    @Autowired
    private CouponTypeDAO couponTypeDAO ;
    @Autowired
    private CouponTypeService couponTypeService ;

    private int findCouponTypeByCouponTypeIds(List<Integer> ids , List<CouponTypeRecord> res) {
        if (ids.isEmpty()) return 1 ;
        List<CouponTypeRecord> tmpRe = couponTypeDAO.findByIds(ids) ;

        //映射
        Map<Integer , CouponTypeRecord> id2ReMap = new HashMap<>() ;
        for(CouponTypeRecord i : tmpRe) id2ReMap.put(i.getCouponTypeId() , i) ;

        //录入
        CouponTypeRecord empty = new CouponTypeRecord() ;
        for(Integer i : ids) {
            CouponTypeRecord tmp = id2ReMap.get(i) ;
            res.add(null == tmp ? empty : tmp) ;
        }

        return 0 ;
    }

    /**
     * 获取汽修厂优惠券汇总列表
     * @param key
     * @param vo
     */
    @Override
    public void getCouponForMfctyList(String key, VoModel<?, ?> vo){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuOrgEntity> qpuOrgEntities = qpuOrgDao.getOrgDetailForPage(key, vo);
        if (CollectionUtils.isEmpty(qpuOrgEntities)) {
            qpuOrgEntities = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(qpuOrgDao.getOrgCount(key));
        }
        vo.setModel(qpuOrgEntities);
        List<OrgForCouponEntity> result = Lists.newArrayList(Lists.transform(qpuOrgEntities, OrgForCouponEntityTransformer.INSTANCE));
        fillOrgForCouponEntityDetail(result);
        vo.setModel(result);
        MultipleDataSource.setDataSourceKey("dataSource");
    }


    private void fillOrgForCouponEntityDetail(List<OrgForCouponEntity> input){
        for(OrgForCouponEntity orgForCouponEntity : input){
            String mfctyID = orgForCouponEntity.getOrgID();
            String currentTime = TimeUtil.getCurrentTime();
            List<CouponEntity> couponEntities = couponDao.getCouponsByMfctyID(mfctyID, currentTime);
            int totalCouponMoney = 0;
            Integer totalUsedCouponMoney;
            for(CouponEntity couponEntity : couponEntities){
                Double money = couponEntity.getMoney();
                if(money != null) {
                    totalCouponMoney += money;
                }
            }

            totalUsedCouponMoney = couponDao.getUsedCouponByOrgIDAndTime(mfctyID, currentTime);
            totalUsedCouponMoney = (totalUsedCouponMoney==null)?0 : totalUsedCouponMoney;
            orgForCouponEntity.setTotalCouponMoney(totalCouponMoney);
            orgForCouponEntity.setUsedCouponMoney(totalUsedCouponMoney);
        }
    }

    /**
     * 能否重置优惠券
     * @param mfctyID 汽修厂id
     * @return 判断结果
     */
    @Override
    public boolean isValidReset(String mfctyID){
        String currentTime = TimeUtil.getCurrentTime();
        MultipleDataSource.setDataSourceKey("mainDataSource");
        int num = couponDao.countCoupon(mfctyID, currentTime);
        MultipleDataSource.setDataSourceKey("dataSource");
        return (num <= 0);
    }

    //往系统操作日志中添加修改记录
    @Override
    public int addEditOperationInfo2SysLog(UserDTO user ,
                                           String orgID ,
                                           List<CouponEntity> oldCouponEntities ,
                                           List<CouponEntity> newCouponEntities) {
        //获得更新前后的统计数据
        List<CouponTotalEntity> oldCouponTotalEntities = couponEntitiesToCouponTotalEntities(oldCouponEntities);
        List<CouponTotalEntity> newCouponTotalEntities = couponEntitiesToCouponTotalEntities(newCouponEntities);

        //用户信息
        if (null == user) user = new UserDTO() ;
        //获取org名称
        List<String> tmpNames = new ArrayList<>() ;
        orgService.findOrgNameById(orgID , tmpNames) ;
        String orgName = (tmpNames.isEmpty() ? "" : tmpNames.get(0)) ;

        //记录初始化
        SysOperationLogRecord tmp = new SysOperationLogRecord() ;
        tmp.setOperatorId(null == user.getUserId() ? 0 : user.getUserId().longValue());
        tmp.setOperatorName(null == user.getUserName() ? "未知" : user.getUserName()) ;
        tmp.setOperationTypeId(3);                  //修改
        tmp.setBizModelTypeId((long) 1);            //1:优惠券管理
        tmp.setBizModelName("优惠券管理");           //1:优惠券管理
        tmp.setBizModelKey(Long.valueOf(orgID));    //汽修厂id

        //记录各种优惠券的变化
        for(int i = 0 ; i < oldCouponTotalEntities.size() ; i ++) {
            CouponTotalEntity oldTmp = oldCouponTotalEntities.get(i) ;
            CouponTotalEntity newTmp = newCouponTotalEntities.get(i) ;
            //描述头
            String decHead = orgName + "的"+ oldTmp.getMoney() +"元优惠券:" ;

            //未使用张数变化
            if (0 != Integer.compare(oldTmp.getUnUsedNum() , newTmp.getUnUsedNum())) {
                Integer totalNum = CouponConst.getMaxUnusedNum(oldTmp.getMoney() , couponTypeService) ;
                String dec = "(最大张数:" + totalNum + ")" + "未使用张数变化:" +
                        oldTmp.getUnUsedNum() + "->" + newTmp.getUnUsedNum() + ";" ;
                tmp.setDescription(decHead + dec);
                sysOperationLogService.addRecord(tmp) ;
            }
            //限额变化
            if (0 != Double.compare(oldTmp.getQuota(), newTmp.getQuota())) {
                String dec = "限额变化:"+ oldTmp.getQuota() + "->" + newTmp.getQuota() + ";" ;
                tmp.setDescription(decHead + dec);
                sysOperationLogService.addRecord(tmp) ;
            }
            //生效时间变化
            if (0 != oldTmp.getCreateTime().compareTo(newTmp.getCreateTime())) {
                String dec = "生效日期变化:"+ oldTmp.getCreateTime() + "->" + newTmp.getCreateTime() + ";" ;
                tmp.setDescription(decHead + dec);
                sysOperationLogService.addRecord(tmp) ;
            }
            //失效时间变化
            if (0 != oldTmp.getExpiryDate().compareTo(newTmp.getExpiryDate())) {
                String dec = "失效日期变化:"+ oldTmp.getExpiryDate() + "->" + newTmp.getExpiryDate() + ";" ;
                tmp.setDescription(decHead + dec);
                sysOperationLogService.addRecord(tmp) ;
            }
        }

        //映射
//        Set<Double> moneySet = new HashSet<>() ;
//        Map<Double , String> newMoney2CreateTimeMap = new HashMap<>() ;
//        Map<Double , String> newMoney2ExpiryDateMap = new HashMap<>() ;
//        Map<Double , Integer> newMoney2UnusedNumMap = new HashMap<>() ;
//        for(CouponEntity i : newCouponEntities) {
//            if (null == i.getMoney()) continue ;
//            if (! moneySet.contains(i.getMoney())) moneySet.add(i.getMoney()) ;
//            if (null != i.getCreateTime()) newMoney2CreateTimeMap.put(i.getMoney() , i.getCreateTime()) ;
//            if (null != i.getExpiryDate()) newMoney2ExpiryDateMap.put(i.getMoney() , i.getExpiryDate()) ;
//            Integer tmp = newMoney2UnusedNumMap.get(i.getMoney()) ;
//            if (null == tmp) tmp = 0 ;
//            tmp ++ ;
//            newMoney2UnusedNumMap.put(i.getMoney() , tmp) ;
//        }
//        Map<Double , String> oldMoney2CreateTimeMap = new HashMap<>() ;
//        Map<Double , String> oldMoney2ExpiryDateMap = new HashMap<>() ;
//        Map<Double , Integer> oldMoney2UnusedNumMap = new HashMap<>() ;
//        for(CouponEntity i : oldCouponEntities) {
//            if (null == i.getMoney()) continue ;
//            if (! moneySet.contains(i.getMoney())) moneySet.add(i.getMoney()) ;
//            if (null != i.getCreateTime()) oldMoney2CreateTimeMap.put(i.getMoney() , i.getCreateTime()) ;
//            if (null != i.getExpiryDate()) oldMoney2ExpiryDateMap.put(i.getMoney() , i.getExpiryDate()) ;
//            Integer tmp = oldMoney2UnusedNumMap.get(i.getMoney()) ;
//            if (null == tmp) tmp = 0 ;
//            tmp ++ ;
//            oldMoney2UnusedNumMap.put(i.getMoney() , tmp) ;
//        }

        //获取总张数
//        Map<Double , Integer> money2TotalNumMap = new HashMap<>() ;
//        money2TotalNumMap.put(20.0, 5) ;
//        money2TotalNumMap.put(50.0, 6) ;
//        money2TotalNumMap.put(100.0, 7) ;
//        money2TotalNumMap.put(200.0, 7) ;
//        money2TotalNumMap.put(500.0, 3) ;
//        money2TotalNumMap.put(1000.0, 1) ;

//        for(Double i : moneySet) {
//            Integer oldUnusedNum = oldMoney2UnusedNumMap.get(i) ;
//            if (null == oldUnusedNum) oldUnusedNum = 0 ;
//            Integer newUnusedNum = newMoney2UnusedNumMap.get(i) ;
//            if (null == newUnusedNum) newUnusedNum = 0 ;
//            if (! oldUnusedNum.equals(newUnusedNum)) {
//                String dec = orgName + "的"+ i +"元优惠券:" ;
//                Integer totalNum = ??? ;
//                dec += "(总张数:" + (null == totalNum ? "" : totalNum) + ")" ;
//                dec += "未使用张数变化:"+ oldUnusedNum + "->" + newUnusedNum + ";" ;
//                tmp.setDescription(dec);
//                sysOperationLogDAO.addRecord(tmp) ;
//            }
//            String newCreateTime = newMoney2CreateTimeMap.get(i) ;
//            if (null == newCreateTime) newCreateTime = "无" ;
//            String oldCreateTime = oldMoney2CreateTimeMap.get(i) ;
//            if (null == oldCreateTime) oldCreateTime = "无" ;
//            if (! oldCreateTime.equals(newCreateTime)) {
//                String dec = orgName + "的"+ i +"元优惠券:" ;
//                dec += "生效日期变化:"+ oldCreateTime + "->" + newCreateTime + ";" ;
//                tmp.setDescription(dec);
//                sysOperationLogDAO.addRecord(tmp) ;
//            }
//            String newExpiryDate = newMoney2ExpiryDateMap.get(i) ;
//            if (null == newExpiryDate) newExpiryDate = "无" ;
//            String oldExpiryDate = oldMoney2ExpiryDateMap.get(i) ;
//            if (null == oldExpiryDate) oldExpiryDate = "无" ;
//            if (! oldExpiryDate.equals(newExpiryDate)){
//                String dec = orgName + "的"+ i +"元优惠券:" ;
//                dec += "失效日期变化:"+ oldExpiryDate + "->" + newExpiryDate + ";" ;
//                tmp.setDescription(dec);
//                sysOperationLogDAO.addRecord(tmp) ;
//            }
//        }

        return 0;
    }

    //获取汽修厂所有未使用优惠券
    @Override
    public List<CouponEntity> findUnusedCouponsByMfctyID(String orgID) {
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<CouponEntity> couponEntities =
                couponDao.getCouponsByMfctyID(orgID , TimeUtil.getCurrentTime()) ;
        MultipleDataSource.setDataSourceKey("dataSource");
        return couponEntities ;
    }

    /**
     * 获取指定厂的优惠券详情
     * @param mfctyID 组织id
     * @return 该组织的优惠券详情
     */
    @Override
    public OrgForCouponEntity getOrgForCouponDetailByMfctyID(String mfctyID){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<QpuOrgEntity> qpuOrgEntities = qpuOrgDao.getOrgDetailByID(mfctyID);
        if(BaseJudgeUtil.isEmpty(qpuOrgEntities)){
            return null;
        }
        List<OrgForCouponEntity> orgForCouponEntities = Lists.newArrayList(Lists.transform(qpuOrgEntities, OrgForCouponEntityTransformer.INSTANCE));
        OrgForCouponEntity result = orgForCouponEntities.get(0);
        String currentTime = TimeUtil.getCurrentTime();
        List<CouponEntity> couponEntities = couponDao.getCouponsByMfctyID(mfctyID, currentTime);
        MultipleDataSource.setDataSourceKey("dataSource");

        List<CouponTotalEntity> couponTotalEntities = couponEntitiesToCouponTotalEntities(couponEntities);

        result.setCouponTotalEntityList(couponTotalEntities);
        return result;
    }

    //各面额优惠券统计
    private List<CouponTotalEntity> couponEntitiesToCouponTotalEntities(List<CouponEntity> input){
        List<CouponTotalEntity> result = new ArrayList<>();

        //映射，按面额分类
        Multimap<Double, CouponEntity> moneyToCouponEntityMap = HashMultimap.create();
        for (CouponEntity i : input)
            if (i.getMoney() != null) moneyToCouponEntityMap.put(i.getMoney(), i);
        Map<Double, Collection<CouponEntity>> idToCouponEntityListMap = moneyToCouponEntityMap.asMap();

        //获取各面额优惠券的金额
        List<Double> couponValues = new ArrayList<>() ;
        for(CouponConst.CouponType i : CouponConst.CouponType.values()) couponValues.add(i.getValue()) ;

        //统计各面额优惠券的拥有情况
        for(Double i : couponValues) {
            //拥有张数
            Collection<CouponEntity> couponEntities = idToCouponEntityListMap.get(i) ;
            if (null == couponEntities) couponEntities = new HashSet<>() ;

            //最大张数
            int maxNum = CouponConst.getMaxUnusedNum(i , couponTypeService) ;
            if (CouponConst.defaultMaxUnusedNum == maxNum) maxNum = couponEntities.size() ;
            //未使用张数和当前最低使用额度
            int unusedCoupon = 0 ;
            double quota = CouponConst.getQuota(i , couponTypeService) ;
            for(CouponEntity j : couponEntities) {
                if (0 == j.getState()) unusedCoupon ++ ;
                if (null == j.getQuota()) continue ;
                if (Math.abs(j.getQuota() - quota) > 0.001)
                    quota = (quota < j.getQuota() ? quota : j.getQuota()) ;
            }
            //期限
            String createTime = "" ;
            String expiryDate = "" ;
            if (! couponEntities.isEmpty()) {
                CouponEntity tmp = couponEntities.iterator().next() ;
                createTime = tmp.getCreateTime() ;
                expiryDate = tmp.getExpiryDate() ;
            }

            //录入
            CouponTotalEntity tmp = CouponTotalEntity.builder()
                    .couponNum(maxNum)
                    .money(i)
                    .createTime(createTime)
                    .expiryDate(expiryDate)
                    .unUsedNum(unusedCoupon)
                    .quota(quota)
                    .standardQuota(CouponConst.getQuota(i, couponTypeService))
                    .build();
            result.add(tmp);
        }

        return result;
    }

    /**
     * 批量修改指定汽修厂优惠券
     * @param mfctyID 组织id
     * @param couponTotalEntityList 要修改的优惠券种类列表
     * @return sql返回信息
     */
    @Override
    public int updateOrgForCouponDetail(String mfctyID, List<CouponTotalEntity> couponTotalEntityList) {
        MultipleDataSource.setDataSourceKey("mainDataSource");

        String currentTime = TimeUtil.getCurrentTime();

        for(CouponTotalEntity i : couponTotalEntityList){
            //设置汽修厂id
            i.setMfctyID(mfctyID) ;
            //设置限额
            double quota = CouponConst.getQuota(i.getMoney() , couponTypeService) ;
            i.setQuota(quota);

            //限制未使用张数的申请数量
            int havingUnusedNum = couponDao.countUnUsedNumByMfctyIDAndMoney(mfctyID, i.getMoney() , currentTime);
            int maxUnusedNum = CouponConst.getMaxUnusedNum(i.getMoney() , couponTypeService) ;
            if (CouponConst.defaultMaxUnusedNum == maxUnusedNum) maxUnusedNum = havingUnusedNum ;
            int unUsedNumForReq = (i.getUnUsedNum() < maxUnusedNum ? i.getUnUsedNum() : maxUnusedNum) ;
            //未使用张数变化值
            unUsedNumForReq -= havingUnusedNum ;

            if(0 == unUsedNumForReq) continue ;
            if (unUsedNumForReq > 0) {//添加优惠券
                for(int j=0;j<unUsedNumForReq;j++){
                    couponDao.addCoupon(i);
                }
            } else if (unUsedNumForReq < 0) {//消除优惠券
                int cancelNum = 0 - unUsedNumForReq ;
                List<Long> cancelIds = new ArrayList<>() ;
                List<Long> tmpIds = couponDao.findUnusedCouponIdsByOrgIdAndMoneyAndState(Long.valueOf(mfctyID) , i.getMoney());
                for(int j = 0 ; j < cancelNum ; j ++) cancelIds.add(tmpIds.get(j)) ;

                couponDao.cancelCouponByIds(cancelIds , 2);
            }

            //一旦优惠券的张数有变化，则未使用有效的该面额优惠券的限额则全部变为标准限额（老用户）
            couponDao.updateUnusedCouponByOrgIdAndMoneyAndState(i) ;
        }

        MultipleDataSource.setDataSourceKey("dataSource");
        return 0;
    }

    /**
     * 重置优惠券(加满优惠券？)
     * @param mfctyID 组织id
     */
    @Override
    public void resetCoupon(String mfctyID){
        String currentTime = TimeUtil.getCurrentTime();
        List<CouponTotalEntity> target = new ArrayList<>();
        for(CouponConst.CouponType i : CouponConst.CouponType.values()) {
            CouponTotalEntity tmp = CouponTotalEntity.builder()
                    .money(i.getValue())
                    .unUsedNum(CouponConst.getMaxUnusedNum(i.getValue(), couponTypeService))
                    .createTime(currentTime)
                    .expiryDate(TimeUtil.getNextDayForX(currentTime, CouponConst.getLimitDays(i.getValue(), couponTypeService)))
                    .build() ;
            target.add(tmp) ;
        }

//        CouponTotalEntity couponTotalEntity1 = CouponTotalEntity.builder().money(20.0).unUsedNum(5).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        CouponTotalEntity couponTotalEntity2 = CouponTotalEntity.builder().money(50.0).unUsedNum(6).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        CouponTotalEntity couponTotalEntity3 = CouponTotalEntity.builder().money(100.0).unUsedNum(7).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        CouponTotalEntity couponTotalEntity4 = CouponTotalEntity.builder().money(200.0).unUsedNum(7).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        CouponTotalEntity couponTotalEntity5 = CouponTotalEntity.builder().money(500.0).unUsedNum(3).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        CouponTotalEntity couponTotalEntity6 = CouponTotalEntity.builder().money(1000.0).unUsedNum(1).createTime(currentTime).expiryDate(endTime).mfctyID(mfctyID).build();
//        target.add(couponTotalEntity1);target.add(couponTotalEntity2);target.add(couponTotalEntity3);target.add(couponTotalEntity4);target.add(couponTotalEntity5);target.add(couponTotalEntity6);

        updateOrgForCouponDetail(mfctyID, target);
    }

}

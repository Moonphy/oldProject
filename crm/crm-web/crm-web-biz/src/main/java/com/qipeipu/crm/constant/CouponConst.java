package com.qipeipu.crm.constant;

import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.CouponTypeDAO;
import com.qipeipu.crm.dao.bean.CouponTypeRecord;
import com.qipeipu.crm.service.base.CouponTypeService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 */
public class CouponConst {
    //优惠券类型枚举类
    public enum CouponType {
        C20("20元优惠券(老用户)" , 1 , 20.0) ,
        C50("50元优惠券(老用户)" , 2 , 50.0) ,
        C100("100元优惠券(老用户)" , 3 , 100.0) ,
        C200("200元优惠券(老用户)" , 4 , 200.0) ,
        C500("500元优惠券(老用户)" , 5 , 500.0) ,
        C1000("1000元优惠券(老用户)" , 6 , 1000.0) ,
        ;

        private String context ;
        private int id ;
        private double value ;

        private CouponType(String context , int id , double value){
            this.context = context;
            this.id = id ;
            this.value = value ;
        }
        public String getContext(){ return context ; }
        public int getId(){ return id ; }
        public double getValue(){ return value ; }
    }



    //优惠券类型映射
    private static final Map<Double , CouponType> value2CouponTypeMap ;
    //优惠券类型数据映射(这里数据库更新时，内存内并不会更新，只有服务进程重启了，才会更新数据)
    private static Map<Double , CouponTypeRecord> value2CouponTypeRecordMap ;
    static {
        Map<Double , CouponType> tmp = new HashMap<>() ;
        for(CouponType i : CouponType.values()) tmp.put(i.getValue() , i) ;
        value2CouponTypeMap = tmp ;
        value2CouponTypeRecordMap = new HashMap<>() ;
    }




    //获取优惠券类型名称
    public static final String defaultCouponName = "未知" ;
    public static String getCouponName(Double value) {
        if (null == value) return defaultCouponName ;
        CouponType re = value2CouponTypeMap.get(value) ;
        return (null == re ? defaultCouponName : re.getContext()) ;
    }

    //获取优惠券类型id
    public static final int defaultCouponId = 0 ;
    public static int getCouponId(Double value) {
        if (null == value) return defaultCouponId ;
        CouponType re = value2CouponTypeMap.get(value) ;
        return (null == re ? defaultCouponId : re.getId()) ;
    }






    //获取优惠券类型的记录
    public static final CouponTypeRecord defaultCouponTypeRecord = CouponTypeRecord.builder().build() ;
    public static CouponTypeRecord getCouponTypeRecord(Double value , CouponTypeService couponTypeService) {
        if (null == value) return defaultCouponTypeRecord ;

        CouponTypeRecord re = value2CouponTypeRecordMap.get(value) ;
        if (null != re) return re ;

        CouponType tmp = value2CouponTypeMap.get(value) ;
        if (null == tmp) return defaultCouponTypeRecord ;

        List<CouponTypeRecord> tmpRes = new ArrayList<>();
        couponTypeService.findByIds(Lists.newArrayList(tmp.getId()) , tmpRes) ;
        if (tmpRes.isEmpty()) return defaultCouponTypeRecord ;

        re = tmpRes.iterator().next() ;
        value2CouponTypeRecordMap.put(value , re) ;

        return re ;
    }

    //获取优惠券的未使用最大持有数
    public static final int defaultMaxUnusedNum = 0 ;
    public static int getMaxUnusedNum(Double value , CouponTypeService couponTypeService) {
        if (null == value) return defaultMaxUnusedNum ;
        CouponTypeRecord re = getCouponTypeRecord(value, couponTypeService) ;
        return (null == re.getMaxUnusedNum() ? defaultMaxUnusedNum : re.getMaxUnusedNum()) ;
    }

    //获取优惠券的限额
    public static final double defaultQuota = 0.0 ;
    public static double getQuota(Double value , CouponTypeService couponTypeService) {
        if (null == value) return defaultQuota ;
        CouponTypeRecord re = getCouponTypeRecord(value, couponTypeService) ;
        return (null == re.getQuota() ? value : re.getQuota()) ;
    }

    //获取优惠券的期限
    public static final int defaultLimitDays = 60 ;
    public static int getLimitDays(Double value , CouponTypeService couponTypeService) {
        if (null == value) return defaultLimitDays ;
        CouponTypeRecord re = getCouponTypeRecord(value, couponTypeService) ;
        return (null == re.getLimitDays() ? defaultLimitDays : re.getLimitDays()) ;
    }
}

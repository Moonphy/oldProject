package com.qipeipu.crm.service.impl.base;

import com.qipeipu.crm.dao.CouponTypeDAO;
import com.qipeipu.crm.dao.bean.CouponTypeRecord;
import com.qipeipu.crm.service.base.CouponTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 *
 */
@Service("CouponTypeServiceImpl")
public class CouponTypeServiceImpl implements CouponTypeService {
    @Autowired
    private CouponTypeDAO couponTypeDAO ;

    //通过ids查优惠券类型信息
    @Override
    public int findByIds(List<Integer> ids , List<CouponTypeRecord> res) {
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
}

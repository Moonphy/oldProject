package com.qipeipu.crm.service.base;

import com.qipeipu.crm.dao.bean.CouponTypeRecord;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 *
 */
public interface CouponTypeService {
    /**
     * 通过ids查优惠券类型信息
     * @param ids ids
     * @param res 结果
     * @return 错误信息
     */
    public int findByIds(List<Integer> ids , List<CouponTypeRecord> res) ;
}

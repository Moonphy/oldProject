package com.qipeipu.crm.dao;

import com.qipeipu.crm.dao.bean.CouponTypeRecord;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 *
 */

public interface CouponTypeDAO {
    //通过ids查优惠券类型信息
    @Select({"<script>",
                " SELECT * " ,
                " FROM t_coupon_type ct " ,
                " WHERE ct.couponTypeId IN ",
                    "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                        "#{id}",
                    "</foreach>",
            "</script>"})
    public List<CouponTypeRecord> findByIds(@Param("ids") List<Integer> ids) ;
}

package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.customer.CouponEntity;
import com.qipeipu.crm.dtos.customer.CouponTotalEntity;
import com.qipeipu.crm.provider.CouponProvider;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/2.
 */
public interface CouponDao {

    @Select("select * from pt_mfcty_coupon where mfctyId=#{mfctyID} and createTime<=#{currentTime} and expiryDate>=#{currentTime} and state=0")
    public List<CouponEntity> getCouponsByMfctyID(@Param("mfctyID") String mfctyID, @Param("currentTime")String currentTime);

    @SelectProvider(type = CouponProvider.class, method = "getCouponsByMfctyIDAndStateAndMoney")
    public List<CouponEntity> getCouponsByMfctyIDAndStateAndMoney(@Param("mfctyID") String mfctyID, @Param("state")Integer state, @Param("money")Double money);


    @SelectProvider(type = CouponProvider.class, method = "countUnUsedNumByMfctyIDAndMoney")
    public int countUnUsedNumByMfctyIDAndMoney(@Param("mfctyID") String mfctyID, @Param("money")Double money, @Param("currentTime")String currentTime);

    //通过汽修厂id和优惠金额和停用数获取部分ids
    @Select(" SELECT mc.fctyCouponId " +
            " FROM pt_mfcty_coupon mc " +
            " WHERE mc.state = 0 " +
            " AND mc.createTime <= now() " +
            " AND mc.expiryDate >= now() " +
            " AND mc.mfctyId = #{mfctyID} " +
            " AND mc.money= #{money} ")
    public List<Long> findUnusedCouponIdsByOrgIdAndMoneyAndState(@Param("mfctyID") Long mfctyID,
                                                                 @Param("money")Double money) ;

//    @Update("update pt_mfcty_coupon set state=#{state},createTime=#{couponEntity.createTime},updateTime=#{couponEntity.updateTime},expiryDate=#{couponEntity.expiryDate} where fctyCouponId=#{couponEntity.fctyCouponId}")
//    public int updateCoupon(@Param("couponEntity") CouponEntity couponEntity, @Param("state")int state);
//    @Update("update pt_mfcty_coupon set state=#{couponEntity.state} where fctyCouponId=#{couponEntity.fctyCouponId}")
//    public int updateCoupon(@Param("couponEntity") CouponEntity couponEntity);
//    @Update("update pt_mfcty_coupon set createTime=#{createTime},updateTime=#{updateTime},expiryDate=#{expiryDate} where mfctyId=#{mfctyID} and money=#{money}")
//    public int updateCouponTime(@Param("mfctyID") String mfctyID, @Param("money") Double money, @Param("createTime") String createTime, @Param("updateTime")String updateTime, @Param("expiryDate")String expiryDate);

    //更新汽修厂该面额的未使用有效优惠券的信息
    @Update(" UPDATE pt_mfcty_coupon " +
            " SET updateTime = now() , " +
                " createTime = #{cte.createTime} , " +
                " expiryDate = #{cte.expiryDate} , " +
                " quota = #{cte.quota} " +
            " WHERE mfctyId = #{cte.mfctyID} " +
                " AND money = #{cte.money} " +
                " AND state = 0 " +
                " AND createTime <= now() " +
                " AND expiryDate >= now() "
    )
    public int updateUnusedCouponByOrgIdAndMoneyAndState(@Param("cte") CouponTotalEntity couponTotalEntity);

    //通过优惠券ids停用优惠券
    @Update({"<script>",
            " UPDATE pt_mfcty_coupon ",
            " SET state=#{state} ",
            " WHERE fctyCouponId IN ",
                "<foreach item='id' index='index' collection='ids' open='(' separator=',' close=')'>",
                    "#{id}",
                "</foreach>",
            "</script>"
    })
    public int cancelCouponByIds(@Param("ids") List<Long> ids , @Param("state") int state);


    @Insert("insert into pt_mfcty_coupon(mfctyID,money,createTime,expiryDate,origin,state,billId,orderNo,quota) values(#{couponTotalEntity.mfctyID},#{couponTotalEntity.money},#{couponTotalEntity.createTime},#{couponTotalEntity.expiryDate},2,0,2,null,#{couponTotalEntity.quota})")
    public int addCoupon(@Param("couponTotalEntity") CouponTotalEntity couponTotalEntity);


    @Select("select count(1) from pt_mfcty_coupon where mfctyId=#{mfctyID} and createTime<=#{currentTime} and expiryDate>=#{currentTime} and state=0")
    public int countCoupon(@Param("mfctyID") String mfctyID, @Param("currentTime")String currentTime);

    @Select("select sum(money) from pt_mfcty_coupon where mfctyId=#{mfctyID} and createTime<=#{currentTime} and expiryDate>=#{currentTime} and state=1")
    public Integer getUsedCouponByOrgIDAndTime(@Param("mfctyID") String mfctyID, @Param("currentTime") String currentTime);
}

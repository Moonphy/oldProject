package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dtos.customer.CouponEntity;
import com.qipeipu.crm.dtos.customer.CouponTotalEntity;
import com.qipeipu.crm.dtos.customer.OrgForCouponEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.UserDTO;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/2.
 */
public interface CouponService {
    /**
     * 获取汽修厂优惠券汇总列表
     * @param key
     * @param vo
     */
    public void getCouponForMfctyList(String key, VoModel<?, ?> vo);
    /**
     * 获取指定厂的优惠券详情
     * @param mfctyID
     * @return
     */
    public OrgForCouponEntity getOrgForCouponDetailByMfctyID(String mfctyID);

    /**
     * 批量修改指定汽修厂优惠券
     * @param mfctyID
     * @param couponTotalEntityList
     * @return
     */
    public int updateOrgForCouponDetail(String mfctyID, List<CouponTotalEntity> couponTotalEntityList);
    /**
     * 重置优惠券
     * @param mfctyID
     */
    public void resetCoupon(String mfctyID);
    /**
     * 能否重置优惠券
     * @param mfctyID
     * @return
     */
    public boolean isValidReset(String mfctyID);

    /**
     * 往系统操作日志中添加修改记录
     * @param user 操作人员
     * @param orgID 汽修厂
     * @param oldCouponEntities 更新前数据
     * @param newCouponEntities 更新后数据
     * @return 错误信息
     */
    int addEditOperationInfo2SysLog(UserDTO user,
                                    String orgID ,
                                    List<CouponEntity> oldCouponEntities ,
                                    List<CouponEntity> newCouponEntities) ;

    /**
     * 获取汽修厂所有未使用优惠券
     * @param orgID 汽修厂id
     * @return 优惠券列表
     */
    public List<CouponEntity> findUnusedCouponsByMfctyID(String orgID);
}

package com.qipeipu.crm.dao.statistics;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/22.
 */
public interface SupplyCertDao {
    /**
     * 获取汽修厂审核通过的时间
     * @param mfctyID
     * @return
     */
    @Select("select cmtTime from pt_supply_cert where entID=#{mfctyID} and AudResult=2")
    public List<String> getSupplyTimeByOrgID(@Param("mfctyID") String mfctyID);
}

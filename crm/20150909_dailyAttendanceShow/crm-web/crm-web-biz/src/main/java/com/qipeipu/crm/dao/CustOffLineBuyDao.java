package com.qipeipu.crm.dao;

import org.apache.ibatis.annotations.*;
import com.qipeipu.crm.dtos.customer.CustOfflineBuyDTO;

import java.util.List;

/**
 * Created by johnkim on 15-2-11.
 */
public interface CustOffLineBuyDao {

    /***
     * 删除当前客户的所有采购构成记录
     * @param custId 客户Id
     * @return
     */
    @Delete("delete from t_cust_offline_buy where CustId=#{custId}")
    @Options(flushCache = true)
    int del(@Param("custId") Integer custId);

    /***
     * 新增当前客户的采购构成记录
     * @param dto
     * @return
     */
    @Insert("INSERT INTO t_cust_offline_buy (CustId, CityID, Prior, CreateTime,UpdateTime,UserId) " +
            "VALUES (#{dto.custId},#{dto.cityId},#{dto.prior},#{dto.createTime},#{dto.updateTime},#{dto.userId})")
    @Options(useGeneratedKeys = true, keyProperty = "dto.id")
    int insert(@Param("dto") CustOfflineBuyDTO dto);

    /***
     * 根据客户ID查询
     * @param custId 客户ID
     * @return
     */
    @Select({ "<script>SELECT * from t_cust_offline_buy where custId=#{custId}</script>" })
    List<CustOfflineBuyDTO> findByCustId(Integer custId);

}

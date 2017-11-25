package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsReturnGoodsEntity;
import com.qipeipu.crm.provider.ReturnGoodsProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/20.
 */
public interface PtReturnGoodsDao {
    @Results(value = {
            @Result(column = "returnID", property = "returnID"),
            @Result(column = "returnCode", property = "returnCode"),
            @Result(column = "orderNo", property = "orderNo"),
            @Result(column = "applicantId", property = "mfctyID"),
            @Result(column = "applicant", property = "mfctyName"),
            @Result(column = "totalMoney", property = "totalMoney"),
            @Result(column = "applyTime", property = "applyTime")
    })
    @SelectProvider(type = ReturnGoodsProvider.class, method = "getReturnGoodsListByCondition")
    public List<StatisticsReturnGoodsEntity> getReturnGoodsListByCondition(@Param("dateRange")DateRange dateRange, @Param("mfctyIDs")List<Integer> mfctyIDs);
}

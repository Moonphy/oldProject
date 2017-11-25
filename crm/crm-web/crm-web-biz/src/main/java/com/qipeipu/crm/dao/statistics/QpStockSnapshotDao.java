package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dtos.visit.StockSnapShotEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/5/20.
 */
public interface QpStockSnapshotDao {
    @Select("select stockSnapShotId from qp_stock_snapshot where bizID=#{bizID}")
    public List<Integer> getStockSnapShotIDsByBizID(@Param("bizID")Integer bizID);

    @Results(value = {
            @Result(column = "stockSnapShotID", property = "stockSnapShotID"),
            @Result(column = "partsName", property = "partsName"),
            @Result(column = "unitPrice", property = "unitPrice"),
            @Result(column = "carTypeID", property = "carTypeID")
    })
    @Select("select stockSnapShotID,partsName,unitPrice,carTypeID from qp_stock_snapshot where stockSnapShotId=#{stockSnapShotID}")
    public List<StockSnapShotEntity> getStockSnapShotEntityBystockSnapShotID(@Param("stockSnapShotID") Integer stockSnapShotID);

}

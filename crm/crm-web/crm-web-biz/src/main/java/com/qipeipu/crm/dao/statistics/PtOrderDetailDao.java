package com.qipeipu.crm.dao.statistics;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public interface PtOrderDetailDao {

    @Select("select OrderMainID from pt_orderDetail where Dtlfrom=#{inqueryNo}")
    public List<String> getIDByInqueryNo(@Param("inqueryNo") String inqueryNo);


    @Select({"<script>select orderId FROM qp_orderdetail where stockSnapShotId in",
            "<foreach item='item' index='index' collection='stockSnapShotIDs'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<Integer> getOrderIDsByStockSnapShotIDs(@Param("stockSnapShotIDs") List<Integer> stockSnapShotIDs);

}

package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsOrderMainEntity;
import com.qipeipu.crm.provider.OrderMainProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public interface PtOrderMainDao {

    @Results(value = {
            @Result(column = "orderId", property = "orderMainID"),
            @Result(column = "orderNo", property = "orderMainNo"),
            @Result(column = "payTime", property = "payTime"),
            @Result(column = "actualAmount", property = "money"),
            @Result(column = "orgId", property = "mfctyID"),
            @Result(column = "name", property = "receiveName"),
            @Result(column = "address", property = "receiveAddress"),
            @Result(column = "state", property = "payStatus")
    })
    @SelectProvider(type = OrderMainProvider.class, method = "getOrderFormListByOrgID")
    public List<StatisticsOrderMainEntity> getOrderFormListByOrgID(@Param("dateRange")DateRange dateRange, @Param("mfctyIDs")List<Integer> mfctyIDs);

    @Select("select count(1) from qp_order where orderId=#{OrderMainID} and state=3")
    public int countSuccessTradeByInquery(@Param("OrderMainID") String orderMainID);

    @Select({"<script>select count(1) from qp_order where state=3 and orderId in",
            "<foreach item='item' index='index' collection='orderIDs'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public int countSuccessTradeByInqueryToOrders(@Param("orderIDs")List<Integer> orderIDs);

    @Select("select count(1) from (select orgId from main.qp_order where payTime is not null  GROUP BY orgID) t")
    public Integer countAllSuccessTrade();

    @Select("select sum(p.actualAmount) from main.qp_order p where state in (3,4,5,8)  and orgId=#{mfctyID} and  payTime<=#{date} ")
    public Double getHistoryTotalMoneyByDateAndID(@Param("date") String date, @Param("mfctyID") String mfctyID);

    @Select("select orgId FROM main.qp_order  where orgId is not null  group by orgId ")
    public List<String> getMfctyIDsGroupByMfctyIDs(@Param("dateRange")DateRange dateRange);

}

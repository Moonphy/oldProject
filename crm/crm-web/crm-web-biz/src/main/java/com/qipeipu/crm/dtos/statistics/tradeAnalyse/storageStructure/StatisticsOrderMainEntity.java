package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsOrderMainEntity implements Comparable<StatisticsOrderMainEntity>  {
    /**
     * 订单id
     */
    private String orderMainID;
    /**
     * 订单号
     */
    private String orderMainNo;
    /**
     * 单张订单总额
     */
    private Double money;
    /**
     * 厂id
     */
    private String mfctyID;
    /**
     * 生成时间
     */
    private String payTime;
    /**
     * 收货人
     */
    private String receiveName;
    /**
     * 收获地址
     */
    private String receiveAddress;
    /**
     * 3为成功
     */
    private Integer payStatus;
    /**
     * 订单明细集合
     */
    private List<StatisticsOrderDetailEntity> statisticsOrderDetailEntityList;

    @Override
    public int compareTo(StatisticsOrderMainEntity o) {
        int result = this.getPayTime().compareTo(o.getPayTime());
        if(result>0){
            return 1;
        }else if(result<0){
            return -1;
        }else{
            return 0;
        }
    }
}

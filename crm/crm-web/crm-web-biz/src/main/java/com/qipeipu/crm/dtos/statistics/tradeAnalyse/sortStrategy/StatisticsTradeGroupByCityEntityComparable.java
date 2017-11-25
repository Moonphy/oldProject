package com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsTradeGroupByCityEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Comparator;

/**
 * Created by laiyiyu on 2015/5/5.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsTradeGroupByCityEntityComparable implements Comparator<StatisticsTradeGroupByCityEntity> {
    /**
     * 升序或降序
     */
    private boolean sortASC = false;
    /**
     * 依据订单数排序
     */
    private boolean sortByOrderNum = false;
    /**
     * 默认依据订单金额排序
     */
    private boolean sortByTotalOrder = false;
    /**
     * 退单数排序
     */
    private boolean sortByTotalChargebackNum = false;
    /**
     * 依据退单金额排序
     */
    private boolean sortByTotalChargeback = false;

    @Override
    public int compare(StatisticsTradeGroupByCityEntity o1, StatisticsTradeGroupByCityEntity o2) {
        int result = 0;

        if(sortASC){
            if(sortByOrderNum){
                Integer orderNum1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getOrderNum();
                Integer orderNum2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getOrderNum();
                result = orderNum1.compareTo(orderNum2);
            }else if(sortByTotalOrder){
                Double totalOrder1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                Double totalOrder2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                result = totalOrder1.compareTo(totalOrder2);
            }else if(sortByTotalChargebackNum){
                Integer totalChargebackNum1 = o1.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargebackNum();
                Integer totalChargebackNum2 = o2.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargebackNum();
                result = totalChargebackNum1.compareTo(totalChargebackNum2);
            }else if(sortByTotalChargeback){
                Double totalChargeback1 = o1.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargeback();
                Double totalChargeback2 = o2.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargeback();
                result = totalChargeback1.compareTo(totalChargeback2);
            }else{
                Double totalOrder1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                Double totalOrder2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                result = totalOrder1.compareTo(totalOrder2);
            }
        }else{
            if(sortByOrderNum){
                Integer orderNum1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getOrderNum();
                Integer orderNum2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getOrderNum();
                result = -orderNum1.compareTo(orderNum2);
            }else if(sortByTotalOrder){
                Double totalOrder1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                Double totalOrder2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                result = -totalOrder1.compareTo(totalOrder2);
            }else if(sortByTotalChargebackNum){
                Integer totalChargebackNum1 = o1.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargebackNum();
                Integer totalChargebackNum2 = o2.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargebackNum();
                result = -totalChargebackNum1.compareTo(totalChargebackNum2);
            }else if(sortByTotalChargeback){
                Double totalChargeback1 = o1.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargeback();
                Double totalChargeback2 = o2.getStatisticsTradeEntity().getStatisticsReturnEntity().getTotalChargeback();
                result = -totalChargeback1.compareTo(totalChargeback2);
            }else{
                Double totalOrder1 = o1.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                Double totalOrder2 = o2.getStatisticsTradeEntity().getStatisticsOrderEntity().getTotalOrder();
                result = -totalOrder1.compareTo(totalOrder2);
            }
        }
    return result;
    }
}

package com.qipeipu.crm.dtos.statistics.tradeAnalyse.sortStrategy;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsMfctyEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Comparator;

/**
 * Created by laiyiyu on 2015/5/6.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsMfctyEntityComparable implements Comparator<StatisticsMfctyEntity> {

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
    private boolean sortByTotalOrder = true;
    /**
     * 退单数排序
     */
    private boolean sortByTotalChargebackNum = false;
    /**
     * 依据退单金额排序
     */
    private boolean sortByTotalChargeback = false;



    @Override
    public int compare(StatisticsMfctyEntity o1, StatisticsMfctyEntity o2) {
        int result = 0;

        if(sortASC){
            if(sortByOrderNum){
                Integer orderNum1 = o1.getOrderAllNum();
                Integer orderNum2 = o2.getOrderAllNum();
                result = orderNum1.compareTo(orderNum2);
            }else if(sortByTotalOrder){
                Double totalOrder1 = o1.getAllOrderMoney();
                Double totalOrder2 = o2.getAllOrderMoney();
                result = totalOrder1.compareTo(totalOrder2);
            }else if(sortByTotalChargebackNum){
                Integer totalChargebackNum1 = o1.getReturnGoodsNum();
                Integer totalChargebackNum2 = o2.getReturnGoodsNum();
                result = totalChargebackNum1.compareTo(totalChargebackNum2);
            }else if(sortByTotalChargeback){
                Double totalChargeback1 = o1.getReturnGoodsMenoy();
                Double totalChargeback2 = o2.getReturnGoodsMenoy();
                result = totalChargeback1.compareTo(totalChargeback2);
            }
        }else{
            if(sortByOrderNum){
                Integer orderNum1 = o1.getOrderAllNum();
                Integer orderNum2 = o2.getOrderAllNum();
                result = -orderNum1.compareTo(orderNum2);
            }else if(sortByTotalOrder){
                Double totalOrder1 = o1.getAllOrderMoney();
                Double totalOrder2 = o2.getAllOrderMoney();
                result = -totalOrder1.compareTo(totalOrder2);
            }else if(sortByTotalChargebackNum){
                Integer totalChargebackNum1 = o1.getReturnGoodsNum();
                Integer totalChargebackNum2 = o2.getReturnGoodsNum();
                result = -totalChargebackNum1.compareTo(totalChargebackNum2);
            }else if(sortByTotalChargeback){
                Double totalChargeback1 = o1.getReturnGoodsMenoy();
                Double totalChargeback2 = o2.getReturnGoodsMenoy();
                result = -totalChargeback1.compareTo(totalChargeback2);
            }
        }
        return result;
    }
}

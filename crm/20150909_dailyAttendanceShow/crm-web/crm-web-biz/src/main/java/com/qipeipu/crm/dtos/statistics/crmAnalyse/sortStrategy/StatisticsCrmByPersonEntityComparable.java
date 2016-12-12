package com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy;

import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsPersonalEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

import java.util.Comparator;


/**
 * Created by laiyiyu on 2015/5/18.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StatisticsCrmByPersonEntityComparable implements Comparator<StatisticsPersonalEntity> {

    private boolean sortASC = false;

    private boolean sortByTaskNum = false;

    private boolean sortByCreateMfctyNum = false;

    private boolean sortByVisitNum = false;


    @Override
    public int compare(StatisticsPersonalEntity o1, StatisticsPersonalEntity o2) {
        int result = 0;

        if(sortASC){
            if(sortByTaskNum){
                Integer taskNum1 = o1.getTaskNum();
                Integer taskNum2 = o2.getTaskNum();
                result = taskNum1.compareTo(taskNum2);
            }else if(sortByCreateMfctyNum){
                Integer createMfctyNum1 = o1.getCreateMfctyNum();
                Integer createMfctyNum2 = o2.getCreateMfctyNum();
                result = createMfctyNum1.compareTo(createMfctyNum2);
            }else if(sortByVisitNum){
                Integer visitNum1 = o1.getVisitCustNum();
                Integer visitNum2 = o2.getVisitCustNum();
                result = visitNum1.compareTo(visitNum2);
            }else{
                Integer taskNum1 = o1.getTaskNum();
                Integer taskNum2 = o2.getTaskNum();
                result = taskNum1.compareTo(taskNum2);
            }
        }else{
            if(sortByTaskNum){
                Integer taskNum1 = o1.getTaskNum();
                Integer taskNum2 = o2.getTaskNum();
                result = -taskNum1.compareTo(taskNum2);
            }else if(sortByCreateMfctyNum){
                Integer createMfctyNum1 = o1.getCreateMfctyNum();
                Integer createMfctyNum2 = o2.getCreateMfctyNum();
                result = -createMfctyNum1.compareTo(createMfctyNum2);
            }else if(sortByVisitNum){
                Integer visitNum1 = o1.getVisitCustNum();
                Integer visitNum2 = o2.getVisitCustNum();
                result = -visitNum1.compareTo(visitNum2);
            }else{
                Integer taskNum1 = o1.getTaskNum();
                Integer taskNum2 = o2.getTaskNum();
                result = -taskNum1.compareTo(taskNum2);
            }
        }
        return result;
    }
}

package com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy;

import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmGroupByCityEntity;
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
public class StatisticsCrmGroupByCityEntityComparable implements Comparator<StatisticsCrmGroupByCityEntity> {
    /**
     * 升序或降序
     */
    private boolean sortASC = false;

    private boolean sortByUserCrmNum = false;

    private boolean sortByTaskNum = false;

    private boolean sortByVisitNum = false;

    private boolean sortByCreateMfctyNum = false;

    @Override
    public int compare(StatisticsCrmGroupByCityEntity o1, StatisticsCrmGroupByCityEntity o2) {
        int result = 0;



        if(sortASC){
            if(sortByUserCrmNum){
                Integer userCrmNum1 = o1.getStatisticsCrmEntity().getTotalUseCrm();
                Integer userCrmNum2 = o2.getStatisticsCrmEntity().getTotalUseCrm();
                result = userCrmNum1.compareTo(userCrmNum2);
            }else if(sortByTaskNum){
                Integer taskNum1 = o1.getStatisticsCrmEntity().getTotalTaskNum();
                Integer taskNum2 = o2.getStatisticsCrmEntity().getTotalTaskNum();
                result = taskNum1.compareTo(taskNum2);
            }else if(sortByVisitNum){
                Integer visitNum1 = o1.getStatisticsCrmEntity().getTotalVisitNum();
                Integer visitNum2 = o2.getStatisticsCrmEntity().getTotalVisitNum();
                result = visitNum1.compareTo(visitNum2);
            }else if(sortByCreateMfctyNum){
                Integer createMfctyNum1 = o1.getStatisticsCrmEntity().getTotalCreateNum();
                Integer createMfctyNum2 = o2.getStatisticsCrmEntity().getTotalCreateNum();
                result = createMfctyNum1.compareTo(createMfctyNum2);
            }else{
                Integer userCrmNum1 = o1.getStatisticsCrmEntity().getTotalUseCrm();
                Integer userCrmNum2 = o2.getStatisticsCrmEntity().getTotalUseCrm();
                result = userCrmNum1.compareTo(userCrmNum2);
            }
        }else{
            if(sortByUserCrmNum){
                Integer userCrmNum1 = o1.getStatisticsCrmEntity().getTotalUseCrm();
                Integer userCrmNum2 = o2.getStatisticsCrmEntity().getTotalUseCrm();
                result = -userCrmNum1.compareTo(userCrmNum2);
            }else if(sortByTaskNum){
                Integer taskNum1 = o1.getStatisticsCrmEntity().getTotalTaskNum();
                Integer taskNum2 = o2.getStatisticsCrmEntity().getTotalTaskNum();
                result = -taskNum1.compareTo(taskNum2);
            }else if(sortByVisitNum){
                Integer visitNum1 = o1.getStatisticsCrmEntity().getTotalVisitNum();
                Integer visitNum2 = o2.getStatisticsCrmEntity().getTotalVisitNum();
                result = -visitNum1.compareTo(visitNum2);
            }else if(sortByCreateMfctyNum){
                Integer createMfctyNum1 = o1.getStatisticsCrmEntity().getTotalCreateNum();
                Integer createMfctyNum2 = o2.getStatisticsCrmEntity().getTotalCreateNum();
                result = -createMfctyNum1.compareTo(createMfctyNum2);
            }else{
                Integer userCrmNum1 = o1.getStatisticsCrmEntity().getTotalUseCrm();
                Integer userCrmNum2 = o2.getStatisticsCrmEntity().getTotalUseCrm();
                result = -userCrmNum1.compareTo(userCrmNum2);
            }

        }
        return result;
    }
}

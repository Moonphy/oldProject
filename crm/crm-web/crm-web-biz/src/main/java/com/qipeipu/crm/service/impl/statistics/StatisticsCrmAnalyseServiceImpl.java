package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.TaskDao;
import com.qipeipu.crm.dao.UserVisitDao;
import com.qipeipu.crm.dao.WxCustomerDao;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsCrmEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.StatisticsPersonalEntity;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.VisitDetailEntity;
import com.qipeipu.crm.service.statistics.StatisticsCrmAnalyseService;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by laiyiyu on 2015/5/8.
 */
@Service
public class StatisticsCrmAnalyseServiceImpl implements StatisticsCrmAnalyseService {

    @Autowired
    private UserVisitDao userVisitDao;
    @Autowired
    private TaskDao taskDao;
    @Autowired
    private WxCustomerDao wxCustomerDao;

    public void statisticsCrmByAllMfcty(DateRange dateRange, List<Integer> userIDs, StatisticsCrmEntity input){
        List<StatisticsPersonalEntity> statisticsPersonalEntities = input.getPersonalEntityList();
        if(statisticsPersonalEntities==null){
            statisticsPersonalEntities = new ArrayList<>();
        }
        statisticsCrmAnalyseBase(dateRange, userIDs, statisticsPersonalEntities);
        int userNum = 0;
        int taskNum = 0;
        int visitNum = 0;
        int createMfctyNum = 0;
        for(StatisticsPersonalEntity statisticsPersonalEntity : statisticsPersonalEntities){
            if(statisticsPersonalEntity.isUserCrm()){
                userNum++;
            }
            taskNum += statisticsPersonalEntity.getTaskNum();
            visitNum += statisticsPersonalEntity.getVisitCustNum();
            createMfctyNum += statisticsPersonalEntity.getCreateMfctyNum();
        }
        input.setPersonalEntityList(statisticsPersonalEntities);
        input.setTotalCreateNum(createMfctyNum);
        input.setTotalTaskNum(taskNum);
        input.setTotalUseCrm(userNum);
        input.setTotalVisitNum(visitNum);
        //System.out.println("createNum:"+input.getTotalCreateNum()+"-totoalTask:"+input.getTotalTaskNum()+"-totalVisit:"+input.getTotalVisitNum());
    }


    private void statisticsCrmAnalyseBase(DateRange dateRange, List<Integer> userIDs, List<StatisticsPersonalEntity> personalEntityList){

        List<Integer> removeUserIDs = Lists.newArrayList(63,64,65,66,67,68,69,70,87,90,118,120,124,126,127);
        userIDs.removeAll(removeUserIDs);
        if(BaseJudgeUtil.isEmpty(userIDs)){
            return;
        }
        List<VisitDetailEntity> visitDetailEntities = userVisitDao.statisticsVistDetail(userIDs, dateRange);

        Multimap<Integer, VisitDetailEntity> userIDToDetailMap = HashMultimap.create();

        for(VisitDetailEntity visitDetailEntity : visitDetailEntities){
            if(visitDetailEntity.getUserID()!=null){
                userIDToDetailMap.put(visitDetailEntity.getUserID(), visitDetailEntity);
            }
        }


        Map<Integer, Collection<VisitDetailEntity>> visitDetailEntityMap = userIDToDetailMap.asMap();
        for(Map.Entry<Integer, Collection<VisitDetailEntity>> entry : visitDetailEntityMap.entrySet()){
            StatisticsPersonalEntity statisticsPersonalEntity = StatisticsPersonalEntity.builder().build();
            personalEntityList.add(statisticsPersonalEntity);
            Integer userID = entry.getKey();
            statisticsPersonalEntity.setUserID(userID);

            int taskNum = taskDao.statisticsUserByTaskNumByUserAndTime(dateRange, Lists.newArrayList(userID));
            statisticsPersonalEntity.setTaskNum(taskNum);

            int createMfctyNum = wxCustomerDao.countMfctyNumByUserID(dateRange, Lists.newArrayList(userID));
            statisticsPersonalEntity.setCreateMfctyNum(createMfctyNum);

            Collection<VisitDetailEntity> visitDetailEntitiyCollection = entry.getValue();
            int visitNum = visitDetailEntitiyCollection.size();
            statisticsPersonalEntity.setVisitCustNum(visitNum);

            if(visitNum>0||taskNum>0){
                statisticsPersonalEntity.setUserCrm(true);
            }else{
                statisticsPersonalEntity.setUserCrm(false);
            }
            fillWorkDayAndWorkTimeForPerMan(visitDetailEntitiyCollection, statisticsPersonalEntity);

        }
    }

    private void fillWorkDayAndWorkTimeForPerMan(Collection<VisitDetailEntity> visitDetailEntities, StatisticsPersonalEntity statisticsPersonalEntity){
        List<VisitDetailEntity> visitDetailEntityList = new ArrayList<>();

        Map<String, String> workDayMap = new HashMap<>();
        long totalWorkTime = 0;
        for(VisitDetailEntity visitDetailEntity : visitDetailEntities){
            visitDetailEntityList.add(visitDetailEntity);
            String enterTime = visitDetailEntity.getEnterTime();
            String leaveTime = visitDetailEntity.getLeaveTime();
            totalWorkTime += TimeUtil.getTimeDifferenceForMillions(enterTime, leaveTime);
            workDayMap.put(enterTime.substring(0, 10), enterTime.substring(0, 10));
        }
        String workTime = TimeUtil.getTimeDifferenceForDayAndHourAndMin(totalWorkTime);
        statisticsPersonalEntity.setWorkTimeForLong(totalWorkTime);
        statisticsPersonalEntity.setWorkDay(workDayMap.size());
        statisticsPersonalEntity.setWorkTime(workTime);
        statisticsPersonalEntity.setVisitDetailEntityList(visitDetailEntityList);
    }

}

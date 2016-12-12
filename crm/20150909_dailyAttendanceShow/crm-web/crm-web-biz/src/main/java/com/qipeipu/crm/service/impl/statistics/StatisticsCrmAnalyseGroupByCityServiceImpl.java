package com.qipeipu.crm.service.impl.statistics;

import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.AccountDao;
import com.qipeipu.crm.dao.TaskDao;
import com.qipeipu.crm.dao.UserVisitDao;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.*;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmByPersonEntityComparable;
import com.qipeipu.crm.dtos.statistics.crmAnalyse.sortStrategy.StatisticsCrmGroupByCityEntityComparable;
import com.qipeipu.crm.dtos.task.TaskEntity;
import com.qipeipu.crm.dtos.user.AccountEntity;
import com.qipeipu.crm.service.impl.statistics.utilInterface.StatisticsCrmGroupByCityMethod;
import com.qipeipu.crm.service.statistics.StatisticsCrmAnalyseGroupByCityService;
import com.qipeipu.crm.service.statistics.StatisticsCrmAnalyseService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.service.transformer.StatisticsCrmGroupByCityVoTransformer;
import com.qipeipu.crm.service.transformer.StatisticsPersonalVoTransformer;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import com.qipeipu.crm.utils.statistics.BaseJudgeUtil;
import com.qipeipu.crm.utils.statistics.DateRange;
import com.qipeipu.crm.utils.statistics.ExcelUtil;
import com.qipeipu.crm.utils.statistics.PageUtil;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.util.*;

/**
 * Created by laiyiyu on 2015/5/18.
 */
@Service
public class StatisticsCrmAnalyseGroupByCityServiceImpl implements StatisticsCrmAnalyseGroupByCityService {

    @Autowired
    private StatisticsCrmGroupByCityMethod statisticsCrmGroupByCityMethod;
    @Autowired
    private StatisticsCrmAnalyseService statisticsCrmAnalyseService;
    @Autowired
    private AccountDao accountDao;
    @Autowired
    private UserVisitDao userVisitDao;
    @Autowired
    private TaskDao taskDao;

    /**
     * 按地区划分统计crm工作情况
     * @param statisticsQuneryConditionEntity
     * @param vo
     */
    @Override
    public void statisticsCrmGroupByCity(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, VoModel<?, ?> vo){
        List<StatisticsCrmGroupByCityEntity> result = new ArrayList<>();
        StatisticsCrmGroupByCityEntityComparable statisticsCrmGroupByCityEntityComparable = statisticsQuneryConditionEntity.getStatisticsCrmGroupByCityEntityComparable();
        DateRange dateRange = statisticsQuneryConditionEntity.getTimeConditionEntity().getDateRange();
        Map<CityDTO, Collection<Integer>> cityDTOCollectionMap = statisticsCrmGroupByCityMethod.cityToUserIDsMapGroupBy(statisticsQuneryConditionEntity.getAreaConditionEntity());
        for(Map.Entry<CityDTO, Collection<Integer>> entry : cityDTOCollectionMap.entrySet()){
            CityDTO cityDTO = entry.getKey();
            List<Integer> userIDs = Lists.newArrayList(entry.getValue());
            StatisticsCrmEntity statisticsCrmEntity = StatisticsCrmEntity.builder().build();
            statisticsCrmAnalyseService.statisticsCrmByAllMfcty(dateRange, userIDs, statisticsCrmEntity);
            if(statisticsCrmEntity.getTotalVisitNum()==0&&statisticsCrmEntity.getTotalTaskNum()==0&&statisticsCrmEntity.getTotalCreateNum()==0&&statisticsCrmEntity.getTotalUseCrm()==0)continue;
            statisticsCrmEntity.setPersonalEntityList(null);
            StatisticsCrmGroupByCityEntity statisticsCrmGroupByModelEntity = new StatisticsCrmGroupByCityEntity();
            //System.out.println("createNum:"+statisticsCrmEntity.getTotalCreateNum()+"-visitNum:"+statisticsCrmEntity.getTotalVisitNum());
            statisticsCrmGroupByModelEntity.setCityDTO(cityDTO);
            statisticsCrmGroupByModelEntity.setStatisticsCrmEntity(statisticsCrmEntity);
            //System.out.println("cityName:" + statisticsCrmGroupByModelEntity.getCityDTO().getCityName());
            result.add(statisticsCrmGroupByModelEntity);
        }
        Collections.sort(result, statisticsCrmGroupByCityEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsCrmGroupByCityEntity> pageUtil = new PageUtil<StatisticsCrmGroupByCityEntity>();
        vo.setModel(pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize()));
    }


    /**
     * 按地区划分统计crm工作情况导出excel
     * @param statisticsQuneryConditionEntity
     */
    @Override
    public void statisticsCrmGroupByCityExportExcel(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity, OutputStream ops){
        VoModel<?, ?> vo = new VoModel<>();
        vo.setSize(100000);
        statisticsCrmGroupByCity(statisticsQuneryConditionEntity, vo);
        List<StatisticsCrmGroupByCityEntity> statisticsCrmGroupByCityEntities = (List<StatisticsCrmGroupByCityEntity>) vo.getModel();
        List<StatisticsCrmGroupByCityVo> result = Lists.newArrayList(Lists.transform(statisticsCrmGroupByCityEntities, StatisticsCrmGroupByCityVoTransformer.INSTANCE));
        String title = "统计crm工作情况";
        String[] heads = {"地区", "使用人数", "任务数", "拜访次数", "新建汽修厂数"};
        ExcelUtil.exportExcel(title, heads, result, ops);
    }


    /**
     * 统计指定地区详情工作统计
     * @param cityID
     * @param dateRange
     * @param vo
     */
    @Override
    public void statisticsOrderAndReturnByCityID(StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, Integer cityID, DateRange dateRange, VoModel<?, ?> vo){

        AreaConditionEntity areaConditionEntity = AreaConditionEntity.builder().cityID(cityID).build();
        Map<CityDTO, Collection<Integer>> cityDTOCollectionMap = statisticsCrmGroupByCityMethod.cityToUserIDsMapGroupBy(areaConditionEntity);
        StatisticsCrmEntity statisticsCrmEntity = StatisticsCrmEntity.builder().build();
        for(Map.Entry<CityDTO, Collection<Integer>> entry : cityDTOCollectionMap.entrySet()){
            CityDTO cityDTO = entry.getKey();
            List<Integer> userIDs = Lists.newArrayList(entry.getValue());
            statisticsCrmAnalyseService.statisticsCrmByAllMfcty(dateRange, userIDs, statisticsCrmEntity);
            //System.out.println("createNum:"+statisticsCrmEntity.getTotalCreateNum()+"-visitNum:"+statisticsCrmEntity.getTotalVisitNum());
        }

        List<StatisticsPersonalEntity> result = statisticsCrmEntity.getPersonalEntityList();
        if(result==null){
            return;
        }
        Collections.sort(result, statisticsCrmByPersonEntityComparable);
        vo.setTotal(result.size());
        PageUtil<StatisticsPersonalEntity> pageUtil = new PageUtil<StatisticsPersonalEntity>();
        result = pageUtil.getPagedFilterPartsList( result, vo.getCurrent(), vo.getSize());
        fillUserName(result);
        vo.setModel(result);
    }

    /**
     * 统计指定地区详情工作统计导出excel
     * @param cityID
     * @param dateRange
     * @param ops
     */
    @Override
    public void statisticsOrderAndReturnByCityIDExportExcel(StatisticsCrmByPersonEntityComparable statisticsCrmByPersonEntityComparable, Integer cityID, DateRange dateRange, OutputStream ops){
        VoModel<?, ?> vo = new VoModel<>();
        vo.setSize(100000);
        statisticsOrderAndReturnByCityID(statisticsCrmByPersonEntityComparable, cityID, dateRange, vo);
        List<StatisticsPersonalEntity> statisticsPersonalEntities = (List<StatisticsPersonalEntity>) vo.getModel();
        List<StatisticsPersonalVo> result = Lists.newArrayList(Lists.transform(statisticsPersonalEntities, StatisticsPersonalVoTransformer.INSTANCE));
        String title = "指定城市统计crm工作情况";
        String[] heads = {"姓名", "任务数", "拜访客户数", "新建汽修厂数", "工作天数", "工作时长"};
        ExcelUtil.exportExcel(title, heads, result, ops);
    }

    private void fillUserName(List<StatisticsPersonalEntity> input){
        for(StatisticsPersonalEntity statisticsPersonalEntity : input){
            Integer userID = statisticsPersonalEntity.getUserID();
            List<AccountEntity> accountEntityList = accountDao.getUserDetailByID(userID);
            String userName = BaseJudgeUtil.isEmpty(input)?"无名" : accountEntityList.get(0).getUserName();
            statisticsPersonalEntity.setUserName(userName);
        }
    }


    public void getVisitDetailForPerUser(Integer userID, DateRange dateRange, VoModel<?, ?> vo){
        List<VisitDetailEntity> visitDetailEntities = userVisitDao.getVistDetailForPage(userID, dateRange, vo);
        if (CollectionUtils.isEmpty(visitDetailEntities)) {
            visitDetailEntities = Collections.emptyList();
            vo.setTotal(0);
        } else {
            fillVisitDetail(visitDetailEntities);
            vo.setTotal(userVisitDao.getVistDetailForCount(userID, dateRange, vo));
        }
        vo.setModel(visitDetailEntities);
    }

    private void fillVisitDetail(List<VisitDetailEntity> input){
        for(VisitDetailEntity visitDetailEntity : input){
            Integer taskID = visitDetailEntity.getTaskID();
            List<TaskEntity> taskEntities = taskDao.getTaskByTaskID(taskID);
            if(!BaseJudgeUtil.isEmpty(taskEntities))
                visitDetailEntity.setMfctyName(taskEntities.get(0).getMfctyName());

        }
    }

    @Override
    public StatisticsCrmEntity getYesterdayCrmAnalyse(){
        String today = TimeUtil.getCurrentTime().substring(0, 10);
        String yesterday = TimeUtil.getYesterday(today);
        DateRange dateRange = new DateRange(yesterday, today);
        List<Integer> userIDs = accountDao.getAllUserIDs();
        StatisticsCrmEntity statisticsCrmEntity = StatisticsCrmEntity.builder().build();
        statisticsCrmAnalyseService.statisticsCrmByAllMfcty(dateRange, userIDs, statisticsCrmEntity);
        statisticsCrmEntity.setPersonalEntityList(null);
        return statisticsCrmEntity;
    }



}

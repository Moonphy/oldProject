package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.statistics.TransformUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/5/5.
 */
@Service
public class StatisticsMfctyByQueryConditionMethodImpl implements  StatisticsMfctyByQueryConditionMethod {

    @Autowired
    private QpuOrgDao qpuOrgDao;

    @Override
    public List<Integer> getMfctyIDsByQueryCondition(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity){
        List<Integer> result = new ArrayList<>();
        if(statisticsQuneryConditionEntity.getMfctyID()!=null){
            result.add(statisticsQuneryConditionEntity.getMfctyID());
        }else if(statisticsQuneryConditionEntity.getAreaConditionEntity()!=null){
            result.addAll(getMfctyIDsByAreaCondition(statisticsQuneryConditionEntity.getAreaConditionEntity()));
        }
        return result;
    }


    private List<Integer> getMfctyIDsByAreaCondition(AreaConditionEntity areaConditionEntity){
        List<Integer> result = new ArrayList<Integer>();
        List<String> orgIDs = new ArrayList<String>();
        MultipleDataSource.setDataSourceKey("mainDataSource");
        if(areaConditionEntity.getAreaID()!=null){
            orgIDs = qpuOrgDao.getMfctyIDsByAreaID(areaConditionEntity.getAreaID());
        }else if(areaConditionEntity.getCityID()!=null){
            orgIDs = qpuOrgDao.getMfctyIDsByCityID(areaConditionEntity.getCityID());
        }else if(areaConditionEntity.getProvinceID()!=null){
            orgIDs = qpuOrgDao.getMfctyIDsByProvinceID(areaConditionEntity.getProvinceID());
        }
        result.addAll(TransformUtil.StringToIntegerList(orgIDs));
        MultipleDataSource.setDataSourceKey("dataSource");
        return result;
    }

}

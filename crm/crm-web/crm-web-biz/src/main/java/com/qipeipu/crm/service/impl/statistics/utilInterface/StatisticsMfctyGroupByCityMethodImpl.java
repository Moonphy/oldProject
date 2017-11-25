package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.CityDao;
import com.qipeipu.crm.dao.QpuOrgDao;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.OrgForCityEntity;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/29.
 */
@Service
public class StatisticsMfctyGroupByCityMethodImpl implements StatisticsMfctyGroupByCityMethod {

    @Autowired
    private CityDao cityDao;
    @Autowired
    private QpuOrgDao qpuOrgDao;

    @Override
    public  Map<CityDTO, List<Integer>> cityToMfctyIDsMapGroupBy(AreaConditionEntity areaCondition){
        Map<CityDTO, List<Integer>> cityToMfctyIDsMap = Maps.newHashMap();
        List<CityDTO> selectCityDTOs;
        MultipleDataSource.setDataSourceKey("dataSource");

        if(areaCondition.getCityID()!=null){
            selectCityDTOs = cityDao.findCitysById(areaCondition.getCityID());
        }else if(areaCondition.getProvinceID()!=null){
            selectCityDTOs = cityDao.findCityByProId(areaCondition.getProvinceID());
        }else{
            selectCityDTOs = cityDao.findAllCity();
        }

        MultipleDataSource.setDataSourceKey("mainDataSource");

        Multimap<CityDTO, String> orgForCityToStatisticsOrderMultimap = HashMultimap.create();
        List<OrgForCityEntity> cityIDForCusts = qpuOrgDao.getMfctysByCityIDs(selectCityDTOs);
        for(OrgForCityEntity orgForCityEntity : cityIDForCusts){
            CityDTO cityDTO = CityDTO.builder().cityId(orgForCityEntity.getCityID()).cityName(orgForCityEntity.getCityName()).build();
            orgForCityToStatisticsOrderMultimap.put(cityDTO, orgForCityEntity.getMfctyID());
        }
        Map<CityDTO, Collection<String>> cityToMfctyCollectionMap = orgForCityToStatisticsOrderMultimap.asMap();
        for(Map.Entry<CityDTO, Collection<String>> entry : cityToMfctyCollectionMap.entrySet()){
            List<Integer> mfctyIDs = new ArrayList<>();
            for(String id : entry.getValue()){
                mfctyIDs.add(Integer.parseInt(id));
            }
            cityToMfctyIDsMap.put(entry.getKey(), mfctyIDs);
        }
        MultipleDataSource.setDataSourceKey("dataSource");
        return cityToMfctyIDsMap;
    }

    @Override
    public List<Integer> cityToMfctyIDs(AreaConditionEntity areaCondition){
        List<Integer> result = new ArrayList<>();
        Map<CityDTO, List<Integer>> map = cityToMfctyIDsMapGroupBy(areaCondition);
        for(Map.Entry<CityDTO, List<Integer>> entry : map.entrySet()){
            if(!CollectionUtils.isEmpty(entry.getValue())){
                result.addAll(entry.getValue());
            }
        }

        return result;
    }

}

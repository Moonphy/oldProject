package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.Multimap;
import com.qipeipu.crm.dao.AccountDao;
import com.qipeipu.crm.dao.CityDao;
import com.qipeipu.crm.dao.UserAreaDao;
import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.user.UserAreaDTO;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/11.
 */
@Service
public class StatisticsCrmGroupByCityMethodImpl implements StatisticsCrmGroupByCityMethod {

    @Autowired
    private CityDao cityDao;
    @Autowired
    private UserAreaDao userAreaDao;
    @Autowired
    private AccountDao accountDao;

    @Override
    public Map<CityDTO, Collection<Integer>> cityToUserIDsMapGroupBy(AreaConditionEntity areaCondition){
        Map<CityDTO, Collection<Integer>> cityToUserIDsMap;
        List<CityDTO> selectCityDTOs;

        if(areaCondition.getCityID()!=null){
            selectCityDTOs = cityDao.findCitysById(areaCondition.getCityID());
        }else if(areaCondition.getProvinceID()!=null){
            selectCityDTOs = cityDao.findCityByProId(areaCondition.getProvinceID());
        }else{
            selectCityDTOs = cityDao.findAllCity();
        }

        Map<Integer, CityDTO> cityIDToCityDTOMap = new HashMap<>();
        for(CityDTO cityDTO : selectCityDTOs){
            cityIDToCityDTOMap.put(cityDTO.getCityId(), cityDTO);
        }

        List<AreaDTO> areaDTOs = userAreaDao.getAreasByCitys(selectCityDTOs);
        Map<Integer, CityDTO> areaIDToCityDTOMap = new HashMap<>();
        for(AreaDTO areaDTO : areaDTOs){
            areaIDToCityDTOMap.put(areaDTO.getAreaId(), cityIDToCityDTOMap.get(areaDTO.getCityId()));
        }

        List<UserAreaDTO> userAreaDTOs = accountDao.getUsersByAreas(areaDTOs);

        Multimap<CityDTO, Integer> cityToUserMultimap = HashMultimap.create();
        for(UserAreaDTO userAreaDTO : userAreaDTOs){
            cityToUserMultimap.put(areaIDToCityDTOMap.get(userAreaDTO.getAreaId()), userAreaDTO.getUserId());
        }

        cityToUserIDsMap = cityToUserMultimap.asMap();
        return cityToUserIDsMap;
    }

}

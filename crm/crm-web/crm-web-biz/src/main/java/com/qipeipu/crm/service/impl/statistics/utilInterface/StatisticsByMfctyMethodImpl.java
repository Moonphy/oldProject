package com.qipeipu.crm.service.impl.statistics.utilInterface;

import com.qipeipu.crm.dao.UserAreaDao;
import com.qipeipu.crm.dao.UserDutyDao;
import com.qipeipu.crm.dao.WxCustomerDao;
import com.qipeipu.crm.service.auth.AuthService;
import com.qipeipu.crm.service.statistics.param.AreaConditionEntity;
import com.qipeipu.crm.service.statistics.param.StatisticsQuneryConditionEntity;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@Service
public class StatisticsByMfctyMethodImpl implements StatisticsByMfctyMethod {

    @Autowired
    private WxCustomerDao wxCustomerDao;
    @Autowired
    private UserAreaDao userAreaDao;
    @Autowired
    private UserDutyDao userDutyDao ;


    @Override
    public List<Integer> getMfctyIDsByQueryCondition(StatisticsQuneryConditionEntity statisticsQuneryConditionEntity) {
        List<Integer> result;


        List<Integer> mfctysByAreaConditionList;

        Integer authority = userDutyDao.getAuthorityByUserID(statisticsQuneryConditionEntity.getUserID()) ;
//        List<Integer> authorities = new ArrayList<>() ;
//        authService.findRoleIdsByUserId(statisticsQuneryConditionEntity.getUserID() , authorities) ;
//        Integer authority = (authorities.isEmpty() ? 0 : authorities.get(0));


        result = getMfctyIDsByAuthorityAndUserID(authority, statisticsQuneryConditionEntity.getUserID());
        if(statisticsQuneryConditionEntity.getAreaConditionEntity()!=null){
            mfctysByAreaConditionList = getMfctyByAreaQueryCondition(statisticsQuneryConditionEntity.getAreaConditionEntity());
            if(CollectionUtils.isEmpty(mfctysByAreaConditionList)){
                return Collections.EMPTY_LIST;
            }
            result.retainAll(mfctysByAreaConditionList);
        }

        return result;
    }

    private List<Integer> getMfctyByAreaQueryCondition(AreaConditionEntity areaConditionEntity){
        List<Integer> result = null;
        if(areaConditionEntity.getCityID()!=null){
            result = wxCustomerDao.getMfctyIDSByCityID(areaConditionEntity.getCityID());
            return result;
        }else if(areaConditionEntity.getProvinceID()!=null){
            result = wxCustomerDao.getMfctyIDSByProvinceID(areaConditionEntity.getProvinceID());
            return result;
        }
        return result;
    }

    private List<Integer> getMfctyIDsByAuthorityAndUserID(Integer authority, Integer userID){
        MultipleDataSource.setDataSourceKey("dataSource");
        List<Integer> mfctyIDs = new ArrayList<Integer>();
        Integer cityID ;

        switch (authority){
            //总监
            case 1 : mfctyIDs = wxCustomerDao.getAllMfctyID();
                break;
            //城市经理
            case 2 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            //市场经理
            case 3 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            //主管
            case 4 :
                cityID = userAreaDao.getCityIDByUserIDAno(userID);
                mfctyIDs = wxCustomerDao.getMfctyIDSByCityID(cityID);
                break;
            default : ;

        }
        return mfctyIDs;
    }

}

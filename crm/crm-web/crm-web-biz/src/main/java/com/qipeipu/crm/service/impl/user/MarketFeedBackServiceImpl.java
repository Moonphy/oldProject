package com.qipeipu.crm.service.impl.user;

import com.qipeipu.crm.dao.MarketFeedBackDao;
import com.qipeipu.crm.dao.PlatTypeDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MarketFeedBackEntity;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.service.user.MarketFeedBackService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Created by Administrator on 2015/4/13.
 */
@Service
public class MarketFeedBackServiceImpl implements MarketFeedBackService {

    @Autowired
    private MarketFeedBackDao marketFeedBackDao;

    @Autowired
    private PlatTypeDao platTypeDao;

    @Override
    public void getMarketFeedBackList(Integer userID, VoModel<?, ?> vo) {
        List<MarketFeedBackEntity> marketFeedBackDaoAccountList = marketFeedBackDao.getAllMarketFeedBackByuserID(userID, vo);
        if (CollectionUtils.isEmpty(marketFeedBackDaoAccountList)) {
            marketFeedBackDaoAccountList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(marketFeedBackDao.getAllMarketFeedBackCountByuserID(userID));
        }
        vo.setModel(marketFeedBackDaoAccountList);
    }

    @Override
    public List<MarketFeedBackEntity> getMarketFeedBackByFeedBackID(Integer feedBackID) {
        return marketFeedBackDao.getMarketFeedBackByFeedBackID(feedBackID);
    }

    @Override
    public int createMarketFeedBack(MarketFeedBackEntity marketFeedBackEntity) {
        return marketFeedBackDao.createMarketFeedBack(marketFeedBackEntity);
    }

    @Override
    public int delMarketFeedBack(Integer feedBackID) {
        return marketFeedBackDao.delMarketFeedBack(feedBackID);
    }

    @Override
    public List<PlatTypeEntity> getAllPlatType() {
        List<PlatTypeEntity> platTypeEntityList = platTypeDao.getAllPlatType();
        return (platTypeEntityList.size()>0)?platTypeEntityList:null;
    }
}

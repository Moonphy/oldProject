package com.qipeipu.crm.service.impl.visit;

import com.qipeipu.crm.dao.PlatTypeDao;
import com.qipeipu.crm.dao.WxPlatFormQuestionDao;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.PlatformQuestionEntity;
import com.qipeipu.crm.service.visitAll.WxPlatFormQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/25.
 */
@Service
public class WxPlatFormQuestionServiceImpl implements WxPlatFormQuestionService {

    @Autowired
    private WxPlatFormQuestionDao wxPlatFormQuestionDao;

    @Autowired
    private PlatTypeDao platTypeDao;

    @Override
    public List<PlatformQuestionEntity> getPlatformQuestionByFeedBackID(Integer feedBackID) {
        List<PlatformQuestionEntity> platformQuestionEntityList = wxPlatFormQuestionDao.getPlatformQuestionByFeedBackID(feedBackID);
        return (platformQuestionEntityList.size()>0)? platformQuestionEntityList : null;
    }

    @Override
    public int createPlatFormQuestion(PlatformQuestionEntity platformQuestionEntity) {
        return wxPlatFormQuestionDao.createPlatFormQuestion(platformQuestionEntity);
    }

    @Override
    public int delPlatFormQuestion(Integer feedBackID) {
        return wxPlatFormQuestionDao.delPlatFormQuestion(feedBackID);
    }

    @Override
    public List<PlatTypeEntity> getAllPlatType() {
        List<PlatTypeEntity> platTypeEntityList = platTypeDao.getAllPlatType();
        return (platTypeEntityList.size()>0)?platTypeEntityList:null;
    }
}

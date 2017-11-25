package com.qipeipu.crm.service.impl.visit;

import com.qipeipu.crm.dao.ReturnGoodsQuestionDao;
import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.visit.ReturnGoodsQuestionEntity;
import com.qipeipu.crm.service.visitAll.ReturnGoodsQuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
@Service("returnGoodsQuestionServiceImpl")
public class ReturnGoodsQuestionServiceImpl implements ReturnGoodsQuestionService {

    @Autowired
    private ReturnGoodsQuestionDao returnGoodsQuestionDao;

    @Override
    public List<ReturnGoodsQuestionEntity> getReturnGoodsQuestionByReturnGoodsID(Integer returnGoodsID) {
        List<ReturnGoodsQuestionEntity> returnGoodsQuestionEntityList = returnGoodsQuestionDao.getReturnGoodsQuestionByReturnGoodsID(returnGoodsID);
        return (returnGoodsQuestionEntityList.size()>0)? returnGoodsQuestionEntityList : null;
    }

    @Override
    public int createsReturnGoodsQuestion(ReturnGoodsQuestionEntity returnGoodsQuestionEntity) {
        return returnGoodsQuestionDao.createReturnGoodsQuestion(returnGoodsQuestionEntity);
    }

    @Override
    public int delReturnGoodsQuestion(Integer returnGoodsID) {
        return returnGoodsQuestionDao.delReturnGoodsQuestion(returnGoodsID);
    }


    @Override
    public List<PlatTypeEntity> getAllPlatType() {
        List<PlatTypeEntity> platTypeEntityList = returnGoodsQuestionDao.getAllPlatType();
        return (platTypeEntityList.size()>0)?platTypeEntityList:null;
    }
}

package com.qipeipu.crm.service.impl.visit;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.qipeipu.crm.dao.WxAccidentCarRemainDao;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.AccidentCarEntity;
import com.qipeipu.crm.dtos.visit.AccidentCarRemainEntity;
import com.qipeipu.crm.dtos.visit.AccidentRemainEntity;
import com.qipeipu.crm.service.visitAll.WxAccidentCarRemainService;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;

/**
 * Created by laiyiyu on 2015/3/27.
 */
@Slf4j
@Service("wxAccidentCarRemainServiceImpl")
public class WxAccidentCarRemainServiceImpl implements WxAccidentCarRemainService {
    @Autowired
    private WxAccidentCarRemainDao wxAccidentCarRemainDao;

    @Override
    public void getCurrentRemain(Integer userID, String searchKey , VoModel<?, ?> vo) {
        List<AccidentRemainEntity> accidentRemainEntityList = wxAccidentCarRemainDao.getAccidentRemainListSql(userID, searchKey, vo);
        if (CollectionUtils.isEmpty(accidentRemainEntityList)) {
            accidentRemainEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxAccidentCarRemainDao.getAccidentRemainListCountSql(userID, searchKey));
        }
        vo.setModel(accidentRemainEntityList);
    }

    @Override
    public List<AccidentRemainEntity> getAccidentCarDetailList(Integer taskID) {
        AccidentRemainEntity accidentRemainEntity = wxAccidentCarRemainDao.getAccidentRemainByTaskID(taskID);
        if(accidentRemainEntity==null){
            return null;
        }
        List<AccidentCarEntity> accidentCarEntityList = wxAccidentCarRemainDao.getAccidentCarListByTaskID(taskID);
        accidentRemainEntity.setAccidentCarEntityList(accidentCarEntityList);
        List<AccidentRemainEntity> accidentRemainEntityList = new ArrayList<AccidentRemainEntity>();
        accidentRemainEntityList.add(accidentRemainEntity);
        return accidentRemainEntityList;
    }

    @Override
    public void getRemainCarList(Integer userID, String searchKey, VoModel<?, ?> vo) {
        List<AccidentCarRemainEntity> accidentCarRemainEntityList = wxAccidentCarRemainDao.getRemainCarList(userID, searchKey, vo);
        if (CollectionUtils.isEmpty(accidentCarRemainEntityList)) {
            accidentCarRemainEntityList = Collections.emptyList();
            vo.setTotal(0);
        } else {
            vo.setTotal(wxAccidentCarRemainDao.getRemainCarListCount(userID, searchKey));
        }
        vo.setModel(accidentCarRemainEntityList);
    }

    public Integer readAccidentCar(Integer accidentCarID){
        return wxAccidentCarRemainDao.readAccidentCar(accidentCarID);
    }

    @Override
    public Integer hasNewAccidentCar(Integer userID) {
    	Integer nResult = 0;
        Date dateNow = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateTime = sdf.format(dateNow);
        try {
			Date dateStart = sdf.parse(dateTime);
			Date dateEnd = TimeUtil.getAddDay(dateStart);
	        nResult = wxAccidentCarRemainDao.hasNewAccidentCar(userID, dateStart, dateEnd);
		} catch (ParseException e) {
			log.error("hasNewAccident", e);
		}
        return nResult;
    }


}

package com.qipeipu.crm.service.impl.visit;

import com.qipeipu.crm.dao.*;
import com.qipeipu.crm.dtos.visit.AccidentCarEntity;
import com.qipeipu.crm.dtos.visit.MaintainEntity;
import com.qipeipu.crm.dtos.visit.WxMessageDetailEntity;
import com.qipeipu.crm.service.visitAll.WxMessageDetailService;
import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/26.
 */
@Service
public class WxMessageDetailServiceImpl implements WxMessageDetailService {
    @Autowired
    private WxMessageDetailDao wxMessageDetailDao;

    @Autowired
    private TaskDao taskDao;

    @Autowired
    private MaintainDao maintainDao;

    @Autowired
    private MaintainLogDao maintainLogDao;

    @Autowired
    private WxAccidentCarRemainDao wxAccidentCarRemainDao;

    @Override
    public List<WxMessageDetailEntity> getDetailByVisitID(Integer visitID) {
        List<WxMessageDetailEntity> wxMessageDetailEntityList = wxMessageDetailDao.getDetailByVisitID(visitID);
        if(wxMessageDetailEntityList.size()==0) return null;
        WxMessageDetailEntity wxMessageDetailEntity = wxMessageDetailEntityList.get(0);
        Integer taskID = wxMessageDetailEntity.getTaskID();
        String subTime = "%"+wxMessageDetailEntity.getCreateTime().substring(0, 10)+"%";
        List<AccidentCarEntity> accidentCarEntityList = wxAccidentCarRemainDao.getAccidentCarListByTaskIDAndTime(taskID, subTime);
        wxMessageDetailEntity.setAccidentCarEntityList(accidentCarEntityList);
        return wxMessageDetailEntityList;
    }

    @Override
    public int delDetailMessage(Integer visitID) {
        return wxMessageDetailDao.delDetailMessage(visitID);
    }

    @Override
    public int batchInsertAccidentCar(List<AccidentCarEntity> accidentCarEntityList) {
        return wxAccidentCarRemainDao.batchInsertAccidentCar(accidentCarEntityList);
    }

    @Override
    public int insertMessageDetail(WxMessageDetailEntity wxMessageDetailEntity, Integer userID) {
        String currentTime = TimeUtil.getCurrentTime();
        Integer custID = taskDao.getCustIDByTaskID(wxMessageDetailEntity.getTaskID());
        MaintainEntity maintainer = MaintainEntity.builder().maintainType(2).createTime(currentTime).updateTime(currentTime).custID(custID).userID(userID).build();
        Integer maintainID = maintainDao.getMaintainByCustIDAndType(maintainer);
        if(maintainID==null){
            //MaintainEntity developer = MaintainEntity.builder().maintainType(1).createTime(currentTime).updateTime(currentTime).custID(custID).userID(userID).build();
            //maintainDao.createMaintain(developer);
            maintainDao.createMaintain(maintainer);
            //maintainLogDao.insertMaintainLog(developer);
            maintainLogDao.insertMaintainLog(maintainer);
        }else {
            Integer maintainIDByUserID = maintainDao.getMaintainByCustIDAndTypeAndUserID(maintainer);
            if (maintainIDByUserID == null) {
                maintainDao.updateMaintain(maintainer);
                maintainLogDao.insertMaintainLog(maintainer);
            }
        }
        return wxMessageDetailDao.insertMessageDetail(wxMessageDetailEntity);
    }

    @Override
    public Integer getVisitCount(Integer taskID) {
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String subTime = "%"+sdf.format(date).substring(0,10)+"%";
        //System.out.println(subTime);
        return wxMessageDetailDao.getVisitCount(taskID, subTime);
    }
}

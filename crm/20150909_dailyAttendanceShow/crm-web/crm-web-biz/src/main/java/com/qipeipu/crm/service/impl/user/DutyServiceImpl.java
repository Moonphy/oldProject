package com.qipeipu.crm.service.impl.user;

import com.qipeipu.crm.dao.DutyDao;
import com.qipeipu.crm.dao.RoleDAO;
import com.qipeipu.crm.dtos.user.DutyEntity;
import com.qipeipu.crm.service.user.DutyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/10.
 */
@Service
public class DutyServiceImpl implements DutyService {

    @Autowired
    private DutyDao dutyDao;

    @Override
    public List<DutyEntity> getDutyList() {
        return dutyDao.getDutyList();
    }
}

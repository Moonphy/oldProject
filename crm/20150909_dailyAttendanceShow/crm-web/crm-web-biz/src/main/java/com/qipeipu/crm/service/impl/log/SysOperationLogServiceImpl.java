package com.qipeipu.crm.service.impl.log;

import com.qipeipu.crm.dao.bean.SysOperationLogRecord;
import com.qipeipu.crm.dao.log.SysOperationLogDAO;
import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.service.log.SysOperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by Administrator:LiuJunyong on 2015/7/31.
 *
 */
@Service("SysOperationLogServiceImpl")
public class SysOperationLogServiceImpl implements SysOperationLogService {
    @Autowired
    private SysOperationLogDAO sysOperationLogDAO ;

    //更新操作的用户信息
    @Override
    public int UpdateSysOperationLogRecord(SysOperationLogRecord re, UserDTO user) {
        re.setOperatorId(user.getUserId().longValue());
        re.setOperatorName(user.getUserName());
        return 0;
    }

    //添加记录
    @Override
    public int addRecord(SysOperationLogRecord re) {
        return sysOperationLogDAO.addRecord(re) ;
    }
}

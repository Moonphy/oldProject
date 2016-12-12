package com.qipeipu.crm.service.log;

import com.qipeipu.crm.dao.bean.SysOperationLogRecord;
import com.qipeipu.crm.dtos.user.UserDTO;

/**
 * Created by Administrator:LiuJunyong on 2015/7/31.
 *
 */
public interface SysOperationLogService {
    /**
     * 更新操作的用户信息
     * @param re 返回记录
     * @param user 用户信息
     * @return 错误信息
     */
    public int UpdateSysOperationLogRecord(SysOperationLogRecord re , UserDTO user) ;

    /**
     * 添加记录
     * @param re 记录
     * @return 错误信息
     */
    public int addRecord(SysOperationLogRecord re) ;
}

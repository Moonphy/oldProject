package com.qipeipu.crm.dao.log;

import com.qipeipu.crm.dao.bean.SysOperationLogRecord;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/7/16.
 */
public interface SysOperationLogDAO {

    //添加系统操作记录
    @Insert(" INSERT INTO crm_log_sys_operation(" +
                "createTime," +
                "operatorId," +
                "operatorName," +
                "operationTypeId," +
                "bizModelTypeId," +
                "bizModelName," +
                "bizModelKey," +
                "description) " +
            " VALUES(" +
                "now()," +
                "#{rec.operatorId}," +
                "#{rec.operatorName}," +
                "#{rec.operationTypeId}," +
                "#{rec.bizModelTypeId}," +
                "#{rec.bizModelName}," +
                "#{rec.bizModelKey}," +
                "#{rec.description})"
    )
    public int addRecord(@Param("rec") SysOperationLogRecord record) ;

    //通过时间查看操作日志记录
    @Select(" SELECT * " +
            " FROM crm_log_sys_operation clso " +
            " WHERE #{startTime} <= clso.createTime AND clso.createTime <= #{endTime} "
    )
    public List<SysOperationLogRecord> findByCreatetime(@Param("startTime") String startTime,
                                                        @Param("endTime")String endTime);
}

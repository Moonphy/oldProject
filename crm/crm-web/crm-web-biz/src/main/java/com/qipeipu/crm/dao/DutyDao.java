package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.user.DutyEntity;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by Administrator:LiuJunyong on 2015/8/7.
 *
 */
public interface DutyDao {
    @Results(value = {
            @Result(column = "dutyID", property = "dutyID"),
            @Result(column = "dutyName", property = "dutyName"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("select * from t_duty")
    public List<DutyEntity> getDutyList();
}

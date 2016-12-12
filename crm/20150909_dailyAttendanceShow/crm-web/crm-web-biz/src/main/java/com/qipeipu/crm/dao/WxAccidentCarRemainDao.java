package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.AccidentCarEntity;
import com.qipeipu.crm.dtos.visit.AccidentCarRemainEntity;
import com.qipeipu.crm.dtos.visit.AccidentRemainEntity;
import com.qipeipu.crm.provider.WxAccidentCarRemainProvider;
import org.apache.ibatis.annotations.*;

import java.util.Date;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/27.
 */
public interface WxAccidentCarRemainDao {

    @Insert("<script>" +
            "insert into t_user_accidentcar (TaskId,cartype,num,preBuyTime,state,createTime) values " +
            "<foreach item='item' index='index' collection='accidentCarEntityList' separator=','>" +
            "(#{item.taskID},#{item.carType},#{item.num},#{item.preBuyTime},0,#{item.createTime})" +
            "</foreach></script>")
    public int batchInsertAccidentCar(@Param("accidentCarEntityList") List<AccidentCarEntity> accidentCarEntityList);


    @Results(value = {
            @Result(column = "accidentcarid", property = "accidentCarID"),
            @Result(column = "taskid", property = "taskID"),
            @Result(column = "cartype", property = "carType"),
            @Result(column = "num", property = "num"),
            @Result(column = "preBuyTime", property = "preBuyTime"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "updateTime", property = "updateTime")
    })
    @Select("select accidentcarid,taskid,cartype,num,preBuyTime,createTime,updateTime from t_user_accidentcar where taskid=#{taskID} and createTime like #{subTime}")
    public List<AccidentCarEntity> getAccidentCarListByTaskIDAndTime(@Param("taskID") Integer taskID, @Param("subTime") String subTime);


    @Results(value = {
            @Result(column = "taskid", property = "taskID"),
            @Result(column = "MfctyName", property = "mfctyName"),
            @Result(column = "allnum", property = "allNum"),
            @Result(column = "preBuyTime", property = "preBuyTime")
    })
    @SelectProvider(type = WxAccidentCarRemainProvider.class, method = "getAccidentRemainListSql")
    public List<AccidentRemainEntity> getAccidentRemainListSql(@Param("userID") Integer userID, @Param("searchKey")String searchKey, @Param("vo")VoModel<?, ?> vo);

    @SelectProvider(type = WxAccidentCarRemainProvider.class, method = "getAccidentRemainListCountSql")
    public Integer getAccidentRemainListCountSql(@Param("userID") Integer userID, @Param("searchKey")String searchKey);

    @SelectProvider(type = WxAccidentCarRemainProvider.class, method = "getAccidentRemainByTaskID")
    public AccidentRemainEntity getAccidentRemainByTaskID(@Param("taskID")Integer taskID);


    @Results(value = {
            @Result(column = "carType", property = "carType"),
            @Result(column = "num", property = "num")
    })
    @Select("select carType,num from t_user_accidentcar where taskID=#{taskID}")
    public List<AccidentCarEntity> getAccidentCarListByTaskID(@Param("taskID") Integer taskID);


    @Results(value = {
            @Result(column = "taskid", property = "taskID"),
            @Result(column = "MfctyName", property = "mfctyName"),
            @Result(column = "allnum", property = "allNum"),
            @Result(column = "preBuyTime", property = "preBuyTime"),
            @Result(column = "cartype", property = "carType")
    })
    @SelectProvider(type = WxAccidentCarRemainProvider.class, method = "getRemainCarList")
    public List<AccidentCarRemainEntity> getRemainCarList(@Param("userID") Integer userID, @Param("searchKey")String searchKey, @Param("vo")VoModel<?, ?> vo);

    @SelectProvider(type = WxAccidentCarRemainProvider.class, method = "getRemainCarListCount")
    public Integer getRemainCarListCount(@Param("userID") Integer userID, @Param("searchKey")String searchKey);


    @Update("update t_user_accidentcar set state=1 where accidentCarID=#{accidentCarID}")
    public Integer readAccidentCar(@Param("accidentCarID") Integer accidentCarID);

    @Select("select 1 from t_user_accidentcar tua LEFT JOIN t_user_task tut on tua.TaskId=tut.TaskId "
    		+ " where tut.UserId=#{userID} and tua.preBuyTime >= #{preTimeStart} and tua.preBuyTime < #{preTimeEnd} and tua.state=0 LIMIT 0,1")
    public Integer hasNewAccidentCar(@Param("userID") Integer userID, @Param("preTimeStart") Date preTimeStart, @Param("preTimeEnd") Date preTimeEnd);

    @Delete("delete from t_user_accidentcar where taskID=#{taskID}")
    public Integer delAccidentCarByTask(@Param("taskID")Integer taskID);

}

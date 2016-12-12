package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/13.
 */
public interface PlatTypeDao {

    @Results(value = {
            @Result(column = "PlatTypeId", property = "typeID"),
            @Result(column = "PlatTypeName", property = "typeName")
    })
    @Select("select PlatTypeId,PlatTypeName from t_plattype")
    public List<PlatTypeEntity> getAllPlatType();

}

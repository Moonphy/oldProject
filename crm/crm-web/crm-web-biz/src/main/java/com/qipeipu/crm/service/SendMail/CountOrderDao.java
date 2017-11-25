package com.qipeipu.crm.service.SendMail;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

/**
 * Created by Administrator on 2015/4/23.
 */
public interface CountOrderDao {


    @Results(value = {
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "allNum", property = "allNum"),
            @Result(column = "money", property = "money")
    })
    @SelectProvider(type = CountOrderDaoProvider.class, method = "CountAll")
    public List<CountOrderForMailEntity> CountAll(@Param("mfctyIDs") List<Integer> mfctyIDs);

    @Results(value = {
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "orgName", property = "orgName"),
            @Result(column = "money", property = "money"),
            @Result(column = "payTime", property = "time"),
    })
    public List<CountOrderForMailDetailEntity> CountAllDetail(@Param("mfctyIDs") List<Integer> mfctyIDs);
}

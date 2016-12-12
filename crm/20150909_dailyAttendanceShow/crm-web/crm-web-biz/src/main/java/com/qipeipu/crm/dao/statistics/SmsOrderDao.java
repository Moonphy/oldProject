package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.service.SendMail.CountOrderDaoProvider;
import com.qipeipu.crm.service.SendMail.CountOrderForMailDetailEntity;
import com.qipeipu.crm.service.SendMail.CountOrderForMailEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.SelectProvider;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/23.
 */
public interface SmsOrderDao {



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
    @SelectProvider(type = CountOrderDaoProvider.class, method = "CountAllDetail")
    public List<CountOrderForMailDetailEntity> CountAllDetail(@Param("mfctyIDs") List<Integer> mfctyIDs);
}

package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MarketFeedBackEntity;
import com.qipeipu.crm.provider.MarketFeedBackProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by Administrator on 2015/4/13.
 */
public interface MarketFeedBackDao {


    @Results(value = {
            @Result(column = "feedBackID", property = "feedBackID"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "platTypeName", property = "platTypeName"),
            @Result(column = "platTypeID", property = "platTypeID"),
            @Result(column = "content", property = "content"),
            @Result(column = "createTime", property = "createTime")
    })
    @SelectProvider(type = MarketFeedBackProvider.class, method = "getAllMarketFeedBackByuserID")
    public List<MarketFeedBackEntity> getAllMarketFeedBackByuserID(@Param("userID") Integer userID, @Param("vo") VoModel<?, ?> vo);

    @SelectProvider(type = MarketFeedBackProvider.class, method = "getAllMarketFeedBackCountByuserID")
    public int getAllMarketFeedBackCountByuserID(@Param("userID") Integer userID);

    @Results(value = {
            @Result(column = "feedBackID", property = "feedBackID"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "platTypeName", property = "platTypeName"),
            @Result(column = "platTypeID", property = "platTypeID"),
            @Result(column = "content", property = "content"),
            @Result(column = "createTime", property = "createTime")
    })
    @Select("select tmf.FeedBackId,tmf.userId,tmf.content,tmf.createTime,tp.PlatTypeName,tmf.PlatTypeId from t_market_feedback tmf LEFT JOIN t_plattype tp on tmf.PlatTypeId = tp.PlatTypeId where feedBackId=#{feedBackId}")
    public List<MarketFeedBackEntity> getMarketFeedBackByFeedBackID(@Param("feedBackId") Integer feedBackID);


    @Insert("insert into t_market_feedback (userID,PlatTypeId,content,createTime) values (#{marketFeedBackEntity.userID},#{marketFeedBackEntity.platTypeID},#{marketFeedBackEntity.content},#{marketFeedBackEntity.createTime})")
    public int createMarketFeedBack(@Param("marketFeedBackEntity") MarketFeedBackEntity marketFeedBackEntity);

    @Delete("delete from t_market_feedback where feedBackId=#{feedBackId}")
    public int delMarketFeedBack(@Param("feedBackId") Integer feedBackID);


}

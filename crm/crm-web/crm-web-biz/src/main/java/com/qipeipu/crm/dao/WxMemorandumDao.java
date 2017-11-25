package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.user.MemorandumEntity;
import com.qipeipu.crm.provider.MemorandumProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/9.
 */
public interface WxMemorandumDao {

    @Results(value = {
            @Result(column = "noteID", property = "noteID"),
            @Result(column = "content", property = "content"),
            @Result(column = "planTime", property = "planTime"),
    })
    @SelectProvider(type = MemorandumProvider.class, method = "getMemorandumListByUserID")
    public List<MemorandumEntity> getMemorandumListByUserID(@Param("userID") Integer userID,@Param("searchKey") String searchKey, @Param("vo") VoModel<?, ?> vo);

    @SelectProvider(type = MemorandumProvider.class, method = "getMemorandumListCountByUserID")
    public int getMemorandumListCountByUserID(@Param("userID") Integer userID,@Param("searchKey") String searchKey);


    @Delete("delete from t_user_note where noteID=#{noteID}")
    public int delMemorandum(@Param("noteID") Integer noteID);

    @Results(value = {
            @Result(column = "noteID", property = "noteID"),
            @Result(column = "userID", property = "userID"),
            @Result(column = "content", property = "content"),
            @Result(column = "planTime", property = "planTime")
    })
    @Select("select * from t_user_note where noteID=#{noteID}")
    public List<MemorandumEntity> getMemorandumDetail(@Param("noteID") Integer noteID);

    @Insert("insert into t_user_note (userID,content,planTime,createTime) values (#{memorandumEntity.userID},#{memorandumEntity.content},#{memorandumEntity.planTime},#{memorandumEntity.createTime})")
    public int createMemorandum(@Param("memorandumEntity") MemorandumEntity memorandumEntity);









}

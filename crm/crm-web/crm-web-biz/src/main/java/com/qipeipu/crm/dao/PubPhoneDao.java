package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.provider.PhoneProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/14.
 */
public interface PubPhoneDao {

    @Insert("insert into t_pub_phone (contactMan,contactTypeID,phoneNo,memo,createTime,state) values (#{publicPhoneEntity.contactMan},#{publicPhoneEntity.contactTypeID},#{publicPhoneEntity.phoneNo},#{publicPhoneEntity.memo},#{publicPhoneEntity.createTime},0)")
    public int createPubPhone(@Param("publicPhoneEntity")PublicPhoneEntity publicPhoneEntity);

    @Results(value = {
            @Result(column = "contactId", property = "contactID"),
            @Result(column = "contactMan", property = "contactMan"),
            @Result(column = "phoneNo", property = "phoneNo"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "contactTypeName", property = "contactTypeName"),
            @Result(column = "contactTypeId", property = "contactTypeID")
    })
    @Select("select * from t_pub_phone where contactID=#{contactID} and state=0")
    public List<PublicPhoneEntity> getPubPhoneByID(@Param("contactID") Integer contactID);

    @Update("update t_pub_phone set contactMan=#{publicPhoneEntity.contactMan},contactTypeID=#{publicPhoneEntity.contactTypeID},phoneNo=#{publicPhoneEntity.phoneNo},memo=#{publicPhoneEntity.memo},updateTime=#{publicPhoneEntity.updateTime} where contactID=#{publicPhoneEntity.contactID}")
    public int updatePubPhone(@Param("publicPhoneEntity")PublicPhoneEntity publicPhoneEntity);

    @Results(value = {
            @Result(column = "contactId", property = "contactID"),
            @Result(column = "contactMan", property = "contactMan"),
            @Result(column = "phoneNo", property = "phoneNo"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "contactTypeName", property = "contactTypeName"),
            @Result(column = "contactTypeId", property = "contactTypeID")
    })
    @SelectProvider(type = PhoneProvider.class, method = "getAllPubPhoneByParamsSql")
    public List<PublicPhoneEntity> getAllPubPhoneByParamsSql(@Param("key") String key, @Param("vo") VoModel<?, ?> vo);

    @SelectProvider(type = PhoneProvider.class, method = "getAllPubPhoneByParamsSqlCount")
    public Integer getAllPubPhoneByParamsSqlCount(@Param("key") String key);

    @Delete("delete from t_pub_phone where contactID=#{contactID}")
    public int  delPub(@Param("contactID")Integer contactID);

}

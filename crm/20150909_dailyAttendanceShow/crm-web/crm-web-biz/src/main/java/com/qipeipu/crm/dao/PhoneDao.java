package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.visit.PlatTypeEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.phone.DepartDTO;
import com.qipeipu.crm.dtos.phone.PublicPhoneEntity;
import com.qipeipu.crm.dtos.phone.UserPhoneDTO;
import com.qipeipu.crm.dtos.phone.UserPhoneEntity;
import com.qipeipu.crm.provider.PhoneProvider;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/20.
 */


public interface PhoneDao {


    @Results(value = {
            @Result(column = "contactId", property = "contactID"),
            @Result(column = "contactMan", property = "contactMan"),
            @Result(column = "phoneNo", property = "phoneNo"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "contactTypeName", property = "contactTypeName"),
            @Result(column = "contactTypeId", property = "contactTypeID")
    })
    @SelectProvider(type = PhoneProvider.class, method = "getAllUserPhoneByParamsSql")
    public List<UserPhoneEntity> getAllUserPhoneByParamsSql(@Param("userId") Integer userId,
                                         @Param("key") String key, @Param("vo") VoModel<?, ?> vo);

    @SelectProvider(type = PhoneProvider.class, method = "getAllUserPhoneByParamsSqlCount")
    public Integer getAllUserPhoneByParamsSqlCount(@Param("userId") Integer userId,
                                        @Param("key") String key);

    @Results(value = {
            @Result(column = "contactId", property = "contactID"),
            @Result(column = "contactMan", property = "contactMan"),
            @Result(column = "phoneNo", property = "phoneNo"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "contactTypeName", property = "contactTypeName"),
            @Result(column = "contactTypeId", property = "contactTypeID")
    })
    @Select("select tup.contactId,tup.contactMan,tup.phoneNo,tup.memo,tct.contactTypeName  from t_user_phone as tup LEFT JOIN t_contact_type as tct on tup.ContactTypeId = tct.ContactTypeId where state=0 and contactID = #{contactID}")
    public List<UserPhoneEntity> getUserPhoneByContactID(@Param("contactID") Integer contactID);

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




    @Results(value = {
            @Result(column = "contactId", property = "contactID"),
            @Result(column = "contactMan", property = "contactMan"),
            @Result(column = "phoneNo", property = "phoneNo"),
            @Result(column = "memo", property = "memo"),
            @Result(column = "contactTypeName", property = "contactTypeName"),
            @Result(column = "contactTypeId", property = "contactTypeID")
    })
    @Select("select tct.ContactTypeName,tpp.contactId,tpp.ContacttypeId,tpp.contactMan,tpp.phoneNo,tpp.memo from t_pub_phone tpp LEFT JOIN t_contact_type tct on tpp.ContactTypeId = tct.ContactTypeId where state=0 AND contactID = #{contactID}")
    public List<PublicPhoneEntity> getPublicPhoneByContactID(@Param("contactID") Integer contactID);


    @Insert("INSERT INTO t_user_phone (userId, contactMan, phoneNo, memo, state, contactTypeId, CreateTime, UpdateTime) " +
            "VALUES (#{userPhoneDTO.userID},#{userPhoneDTO.contactMan},#{userPhoneDTO.phoneNo},#{userPhoneDTO.memo}," +
            "0,#{userPhoneDTO.contactTypeID},#{userPhoneDTO.createTime},#{userPhoneDTO.updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "userPhoneDTO.contactID")
    public int createUserPhone(@Param("userPhoneDTO") UserPhoneDTO userPhoneDTO);

    @Update("update  t_user_phone SET  contactMan=#{userPhoneDTO.contactMan},memo=#{userPhoneDTO.memo},phoneNo=#{userPhoneDTO.phoneNo},updateTime=#{userPhoneDTO.updateTime},contactTypeID=#{userPhoneDTO.contactTypeID} where contactId=#{userPhoneDTO.contactID}")
    public int updateUserPhone(@Param("userPhoneDTO") UserPhoneDTO userPhoneDTO);

    @Delete("delete from t_user_phone where contactID = #{userPhoneDTO.contactID}")
    public int delUserPhone(@Param("userPhoneDTO") UserPhoneDTO userPhoneDTO);


    @Insert("insert into t_user_depart (userID, deptID, createTime) values(#{departDTO.userID},#{departDTO.deptID},#{departDTO.createTime})")
    public int createDept(@Param("departDTO") DepartDTO departDTO);

    @Update("update t_user_depart t set t.updateTime = #{departDTO.updateTime},t.deptID = #{departDTO.deptID} where t.UserId = #{departDTO.userID}")
    public int updateDept(@Param("departDTO") DepartDTO departDTO);



    @Results(value = {
            @Result(column = "contacttypeID", property = "typeID"),
            @Result(column = "contactTypeName", property = "typeName")
    })
    @Select("select contacttypeID,contactTypeName from t_contact_type")
    public List<PlatTypeEntity> getAllPlatType();


}

package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.basedata.CityDTO;
import org.apache.ibatis.annotations.*;

import com.qipeipu.crm.dtos.user.UserAreaEntity;

import java.util.List;

public interface UserAreaDao {
	@Update({ "UPDATE t_user_area SET AreaId=#{areaId},updateTime=now() WHERE UserId=#{userId}" })
	Integer updateArea(@Param("areaId") Integer areaId,
			@Param("userId") Integer userId);

	@Insert({ "INSERT INTO t_user_area (UserId,AreaId,createTime,updateTime) VALUES (#{userId},#{areaId},now(),now())" })
	Integer addArea(@Param("areaId") Integer areaId,
			@Param("userId") Integer userId);

	@Select({ "SELECT * FROM t_user_area WHERE UserId=#{userId}" })
	UserAreaEntity findByUserId(@Param("userId") Integer userId);

	@Select({ "SELECT * FROM t_user_area WHERE UserId=#{userId}" })
	List<UserAreaEntity> findByUserIdForUpdate(@Param("userId") Integer userId);


	@Select("select  areaID  from t_user_area where userID=#{userID}")
	public List<Integer> getAreaIDByUserID(@Param("userID") Integer userID);

	@Select("select ta.cityId from t_user_area tua left join t_area ta on tua.AreaId = ta.areaId where tua.UserId=#{userID}")
	public List<Integer> getCityIDByUserID(@Param("userID") Integer userID);

	@Select("select ta.cityId from t_user_area tua left join t_area ta on tua.AreaId = ta.areaId where tua.UserId=#{userID}")
	public Integer getCityIDByUserIDAno(@Param("userID") Integer userID);


	@Update("update t_user_area set areaid=#{areaID},updateTime=#{updateTime} where userid=#{userID}")
	public int updateUserArea(@Param("userID") Integer userID, @Param("areaID") Integer areaID,@Param("updateTime") String updateTime);


	@Insert("insert into t_user_area (userID,areaID,createTime) values (#{userID},#{areaID},#{createTime})")
	public int createUserArea(@Param("userID") Integer userID, @Param("areaID") Integer areaID,@Param("createTime") String createTime);

	@Delete("delete from t_user_area where userID=#{userID}")
	public int delUserAreaByUserID(@Param("userID") Integer userID);


	@Results(value = { @Result(column = "cityid", property = "cityId"),
			@Result(column = "areaid", property = "areaId"),
			@Result(column = "areaName", property = "areaName") })
	@Select({"<script>select cityid,areaid,areaName from t_area where cityID is not null and cityid in",
			"<foreach item='item' index='index' collection='selectCityDTOs'",
			"open='(' separator=',' close=')'>",
			"#{item.cityId}",
			"</foreach>",
			"</script>"})
	public List<AreaDTO> getAreasByCitys(@Param("selectCityDTOs")List<CityDTO> selectCityDTOs);




}

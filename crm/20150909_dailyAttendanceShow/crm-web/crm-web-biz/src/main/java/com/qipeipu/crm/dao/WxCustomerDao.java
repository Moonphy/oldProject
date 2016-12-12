package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.visit.CustomerBasedDTO;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.dtos.visit.MaintainEntity;
import com.qipeipu.crm.provider.CustomerForMfctyProvider;
import com.qipeipu.crm.provider.MfctyProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.StatementType;

import java.util.List;

/**
 * Created by laiyiyu on 2015/3/24.
 */
public interface WxCustomerDao {


	@Select("select id from t_customer where mfctyid=#{id}")
	public List<Integer> getMfctyByMfctyID(@Param("id") Integer id);


	@Results(value = {
			@Result(column = "id", property = "id"),
			@Result(column = "mfctyID", property = "mfctyID"),
			@Result(column = "mfctyName", property = "mfctyName"),
			@Result(column = "cityID", property = "cityID"),
			@Result(column = "cactTel", property = "cactTel"),
			@Result(column = "cactMan", property = "cactMan"),
			@Result(column = "mp", property = "mp"),
			@Result(column = "email", property = "email"),
			@Result(column = "address", property = "address"),
			@Result(column = "createTime", property = "createTime"),
			@Result(column = "updateTime", property = "updateTime"),
			@Result(column = "memo", property = "memo"),
			@Result(column = "star", property = "star"),
			@Result(column = "userID", property = "userID"),
			@Result(column = "recordTime", property = "recordTime"),
			@Result(column = "weCharNo", property = "weCharNo"),
			@Result(column = "mfctyType", property = "mfctyType"),
			@Result(column = "onlineBuy", property = "onlineBuy"),
			@Result(column = "boothRoom", property = "boothRoom"),
			@Result(column = "liftingFrame", property = "liftingFrame"),
			@Result(column = "businessArea", property = "businessArea"),
			@Result(column = "areaId", property = "areaId")

	})
	@Select("select * from t_customer where id=#{id}")
	public List<CustomerBasedEntity> getCustomerBasedByID(@Param("id")Integer ID);


	@Results(value = {
			@Result(column = "id", property = "id"),
			@Result(column = "mfctyID", property = "mfctyID"),
			@Result(column = "mfctyName", property = "mfctyName"),
			@Result(column = "cityID", property = "cityID"),
			@Result(column = "cactTel", property = "cactTel"),
			@Result(column = "cactMan", property = "cactMan"),
			@Result(column = "mp", property = "mp"),
			@Result(column = "email", property = "email"),
			@Result(column = "address", property = "address"),
			@Result(column = "createTime", property = "createTime"),
			@Result(column = "updateTime", property = "updateTime"),
			@Result(column = "memo", property = "memo"),
			@Result(column = "star", property = "star"),
			@Result(column = "userID", property = "userID"),
			@Result(column = "recordTime", property = "recordTime"),
			@Result(column = "weCharNo", property = "weCharNo"),
			@Result(column = "mfctyType", property = "mfctyType"),
			@Result(column = "onlineBuy", property = "onlineBuy"),
			@Result(column = "boothRoom", property = "boothRoom"),
			@Result(column = "liftingFrame", property = "liftingFrame"),
			@Result(column = "businessArea", property = "businessArea"),
			@Result(column = "areaId", property = "areaId")

	})
	@SelectProvider(type = MfctyProvider.class, method = "getAllCustomerList")
	public List<CustomerBasedEntity> getAllCustomerList(@Param("nameSearch") String nameSearch, @Param("mfctyID")Integer mfctyID, @Param("vo") VoModel<?, ?> vo);

	@SelectProvider(type = MfctyProvider.class, method = "getAllCustomerListCount")
	public int getAllCustomerListCount(@Param("nameSearch") String nameSearch, @Param("mfctyID")Integer mfctyID);



	@Insert("insert into t_customer (MfctyId,MfctyName,CactMan,CactTel,Address,CreateTime,userID,email,cityID,areaid,mfctyType,provinceID) values (#{customerBasedEntity.mfctyID},#{customerBasedEntity.mfctyName},#{customerBasedEntity.cactMan},#{customerBasedEntity.cactTel},#{customerBasedEntity.address},#{customerBasedEntity.createTime},#{customerBasedEntity.userID},#{customerBasedEntity.email},#{customerBasedEntity.cityID},#{customerBasedEntity.areaId},#{customerBasedEntity.mfctyType},#{customerBasedEntity.provinceID})")
	@SelectKey(statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id", keyProperty = "customerBasedEntity.id", before = false, resultType = Integer.class)
	public int createMfcty(
			@Param("customerBasedEntity") CustomerBasedEntity customerBasedEntity);


	@Select("select mfctyID FROM t_customer where id=#{custID}")
	public Integer getmfctyIDByCustID(@Param("custID") Integer custID);




	@Select("select maintainid from t_customer_maintain_log where custID=#{maintainEntity.custID} and userid=#{maintainEntity.userID} and maintainType=#{maintainEntity.maintainType} ")
	public List<Integer> getMaintainLogByMaintain(@Param("maintainEntity") MaintainEntity maintainEntity );


	@Results(value = {
			@Result(column = "id", property = "id"),
			@Result(column = "mfctyID", property = "mfctyID"),
			@Result(column = "mfctyName", property = "mfctyName"),
			@Result(column = "cityID", property = "cityID"),
			@Result(column = "cactTel", property = "cactTel"),
			@Result(column = "cactMan", property = "cactMan"),
			@Result(column = "mp", property = "mp"),
			@Result(column = "email", property = "email"),
			@Result(column = "address", property = "address"),
			@Result(column = "createTime", property = "createTime"),
			@Result(column = "updateTime", property = "updateTime"),
			@Result(column = "memo", property = "memo"),
			@Result(column = "star", property = "star"),
			@Result(column = "userID", property = "userID"),
			@Result(column = "recordTime", property = "recordTime"),
			@Result(column = "weCharNo", property = "weCharNo"),
			@Result(column = "mfctyType", property = "mfctyType"),
			@Result(column = "onlineBuy", property = "onlineBuy"),
			@Result(column = "boothRoom", property = "boothRoom"),
			@Result(column = "liftingFrame", property = "liftingFrame"),
			@Result(column = "businessArea", property = "businessArea"),
			@Result(column = "areaId", property = "areaId")

	})
	@Select("select * from t_customer where ID=#{custID}")
	public CustomerBasedEntity getCustomerByCustID(@Param("custID") Integer custID);


	@Select("select mfctyID FROM t_customer where mfctyID is not null")
	public List<Integer> getAllMfctyID();


	@Select("select mfctyID from t_customer where mfctyID is not null and cityID = #{cityID}")
	public List<Integer> getMfctyIDSByCityID(@Param("cityID") Integer cityID);

	@Select("select mfctyID from t_customer where mfctyID is not null and provinceID = #{provinceID}")
	public List<Integer> getMfctyIDSByProvinceID(@Param("provinceID") Integer provinceID);

	@Update("update t_customer set mfctyType=#{customerBasedDTO.mfctyType},address=#{customerBasedDTO.address},cactTel=#{customerBasedDTO.cactTel},cactMan=#{customerBasedDTO.cactMan},liftingFrame=#{customerBasedDTO.liftingFrame},boothRoom=#{customerBasedDTO.boothRoom},businessArea=#{customerBasedDTO.businessArea} where id=#{customerBasedDTO.id} ")
	public int updateBasicSituation(@Param("customerBasedDTO")CustomerBasedDTO customerBasedDTO);

	@Select("select mfctyName from t_customer where mfctyID=#{mfctyID}")
	public List<String> getMfctyNameByMfctyID(@Param("mfctyID") Integer mfctyID);


	@SelectProvider(type = CustomerForMfctyProvider.class, method = "countMfctyNumByUserID")
	public int countMfctyNumByUserID(@Param("dateRange")DateRange dateRange, @Param("userIDs")List<Integer> userIDs);

}

package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.AreaDTO;
import com.qipeipu.crm.dtos.basedata.AreaDetailEntity;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface AreaDao {
	@Select({ "SELECT * FROM t_area WHERE cityId=#{cityId}" })
	List<AreaDTO> findAreaByCityId(@Param("cityId") Integer cityId);

	@Select({ "SELECT * FROM t_area WHERE areaId=#{areaId}" })
	AreaDTO findAreaById(@Param("areaId") Integer areaId);


	@Select("select  cityID  from t_area where areaID=#{areaID}")
	public Integer getCityIDByAreaID(@Param("areaID") Integer areaID);


	@Results(value = {
			@Result(column = "areaID", property = "areaID"),
			@Result(column = "areaName", property = "areaName"),
			@Result(column = "cityID", property = "cityID"),
			@Result(column = "cityName", property = "cityName"),
			@Result(column = "provinceID", property = "provinceID"),
			@Result(column = "provinceName", property = "provinceName")
	})
	@Select("select t.*,tp.ProvinceName from " +
			" (select ta.areaId,ta.areaName,tc.CityID,tc.CityName,tc.ProvinceID  from t_area ta LEFT JOIN t_city tc on ta.cityId=tc.CityID) t" +
			" LEFT JOIN t_province tp" +
			" on t.ProvinceID = tp.ProvinceID" +
			" where t.areaId=#{areaID}")
	public List<AreaDetailEntity> getDetailByAreaID(@Param("areaID")Integer areaID);

}

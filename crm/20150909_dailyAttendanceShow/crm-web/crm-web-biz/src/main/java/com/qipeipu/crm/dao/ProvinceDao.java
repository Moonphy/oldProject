package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.ProvinceDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface ProvinceDao {

	@Results(value = { @Result(column = "ProvinceID", property = "proId"),
			@Result(column = "RegionID", property = "reId"),
			@Result(column = "ProvinceCode", property = "proCode"),
			@Result(column = "ProvinceName", property = "proName") })
	@Select({ "SELECT * FROM t_province" })
	@Options(useCache = true, flushCache = false, timeout = 10000)
	List<ProvinceDTO> findAllPro();

	@Results(value = { @Result(column = "ProvinceID", property = "proId"),
			@Result(column = "RegionID", property = "reId"),
			@Result(column = "ProvinceCode", property = "proCode"),
			@Result(column = "ProvinceName", property = "proName") })
	@Select({ "SELECT * FROM t_province WHERE ProvinceID=#{provinceId}" })
	ProvinceDTO findProvinceById(@Param("provinceId") Integer provinceId);
}

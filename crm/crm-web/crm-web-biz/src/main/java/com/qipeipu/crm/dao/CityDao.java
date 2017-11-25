package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * Created by johnkim on 15-2-11.
 */
public interface CityDao {

	@Select({ "<script>SELECT * from t_city</script>" })
	List<CityDTO> findAllCity();

	@Select({ "SELECT * FROM t_city WHERE ProvinceID=#{proId}" })
	List<CityDTO> findCityByProId(@Param("proId") Integer proId);

	@Select({ "SELECT cityid FROM t_city WHERE ProvinceID=#{proId}" })
	public List<Integer> findCityIDsByProId(@Param("proId") Integer proId);

	@Select({ "SELECT * FROM t_city WHERE CityId=#{cityId}" })
	CityDTO findCityById(@Param("cityId") Integer cityId);

	@Select({ "SELECT * FROM t_city WHERE CityId=#{cityId}" })
	public List<CityDTO> findCitysById(@Param("cityId") Integer cityId);


	@Select("select provinceID from t_city where cityID=#{cityID}")
	public Integer getprovinceIDByCityID(@Param("cityID") Integer cityID);


}

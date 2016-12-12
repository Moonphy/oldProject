package com.qipeipu.crm.dao;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.customer.OrgForVipVo;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.MfctyByIDAndStatusEntity;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.OrgForCityEntity;
import com.qipeipu.crm.dtos.visit.CustomerBasedEntity;
import com.qipeipu.crm.provider.OrgProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/20.
 */
public interface QpuOrgDao {

    @Select("select orgName from qpu_org where orgid=#{mfctyID}")
    public List<String> getMfctyNameByMfctyID(@Param("mfctyID") String mfctyID);

    @Results(value = { @Result(column = "orgid", property = "mfctyID"),
            @Result(column = "orgName", property = "mfctyNmae"),
            @Result(column = "cityid", property = "cityID"),
            @Result(column = "auditTime", property = "auditTime"),
            @Result(column = "cityname", property = "cityName"),
            @Result(column = "status", property = "status") })
    @SelectProvider(type = OrgProvider.class, method = "getMfctyNameAndStatusByMfctyID")
    public List<MfctyByIDAndStatusEntity> getMfctyNameAndStatusByMfctyID(@Param("mfctyID") String mfctyID);

    @Select("select count(1) from qpu_org where status=2;")
    public int countAllRegister();

    @Results(value = { @Result(column = "orgid", property = "mfctyID"),
            @Result(column = "cityID", property = "cityID") })
    @Select({"<script>select cityID,orgid from qpu_org where cityID is not null and orgid in",
            "<foreach item='item' index='index' collection='mfctyIDs'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<MfctyByIDAndStatusEntity> getCityIDsByMfctyIDs(@Param("mfctyIDs") List<String> mfctyIDs);

    /*@Select({"<script>select count(1) from main.qpu_org where auditTime &gt;=#{dateRange.startDate} and auditTime &lt;=#{dateRange.endDate} and orgid in",
            "<foreach item='item' index='index' collection='mfctyIDs'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})*/
    @SelectProvider(type = OrgProvider.class, method = "getRegisterNumByMfctyIDsAndTime")
    public int getRegisterNumByMfctyIDsAndTime(@Param("mfctyIDs") List<Integer> mfctyIDs, @Param("dateRange")DateRange dateRange);


 /*   @Select({"<script>select orgid from qpu_org where cityID is not null and cityid in",
            "<foreach item='item' index='index' collection='cityIDs'",
            "open='(' separator=',' close=')'>",
            "#{item}",
            "</foreach>",
            "</script>"})
    public List<String> getMfctyIDsByCityIDs(@Param("cityIDs") List<Integer> cityIDs);
*/
    @Select("select orgid from qpu_org where countyID is not null and countyID=#{areaID}")
    public List<String> getMfctyIDsByAreaID(@Param("areaID") Integer areaID);

    @Select("select orgid from qpu_org where cityID is not null and cityid=#{cityID}")
    public List<String> getMfctyIDsByCityID(@Param("cityID") Integer cityID);

    @Select("select orgid from qpu_org where provinceID is not null and provinceID=#{provinceID}")
    public List<String> getMfctyIDsByProvinceID(@Param("provinceID") Integer provinceID);


    @Results(value = { @Result(column = "cityName", property = "cityName"),
            @Result(column = "orgid", property = "mfctyID"),
            @Result(column = "cityid", property = "cityID") })
    @SelectProvider(type = OrgProvider.class, method = "getMfctysByCityIDs")
    public List<OrgForCityEntity> getMfctysByCityIDs(@Param("cityDTOList")List<CityDTO> selectCityDTOs);

    @Select("select distinct orgid from main.qpu_org")
    public List<String> getAllIDs();


    @Results(value = { @Result(column = "orgID", property = "mfctyID"),
            @Result(column = "orgName", property = "mfctyName"),
            @Result(column = "contactPerson", property = "cactMan"),
            @Result(column = "contactMobile", property = "cactTel"),
            @Result(column = "address", property = "address"),
            @Result(column = "createTime", property = "createTime") })
    @SelectProvider(type = OrgProvider.class, method = "getSeachMfctyForMain")
    public List<CustomerBasedEntity> searchOrgByName(@Param("key") String key, @Param("vo") VoModel<?, ?> vo);

    @Results(value = { @Result(column = "orgID", property = "orgID"),
            @Result(column = "orgName", property = "mfctyName"),
            @Result(column = "orgType", property = "orgType"),
            @Result(column = "businessLicenseNo", property = "businessLicenseNo"),
            @Result(column = "businessLicensePic", property = "businessLicensePic"),
            @Result(column = "legalPerson", property = "legalPerson"),
            @Result(column = "identityNo", property = "identityNo"),
            @Result(column = "identityNoPic", property = "identityNoPic"),
            @Result(column = "contactPerson", property = "contactPerson"),
            @Result(column = "contactMobile", property = "contactMobile"),
            @Result(column = "businessTelephone", property = "businessTelephone"),
            @Result(column = "email", property = "email"),
            @Result(column = "businessType", property = "businessType"),
            @Result(column = "balance", property = "balance"),
            @Result(column = "status", property = "status"),
            @Result(column = "fax", property = "fax"),
            @Result(column = "countyID", property = "countyID"),
            @Result(column = "countyName", property = "countyName"),
            @Result(column = "cityID", property = "cityID"),
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "provinceID", property = "provinceID"),
            @Result(column = "provinceName", property = "provinceName"),
            @Result(column = "regionID", property = "regionID"),
            @Result(column = "regionName", property = "regionName"),
            @Result(column = "address", property = "address"),
            @Result(column = "facadePics", property = "facadePics"),
            @Result(column = "signTime", property = "signTime"),
            @Result(column = "updateTime", property = "updateTime"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "auditTime", property = "auditTime") })
    @SelectProvider(type = OrgProvider.class, method = "getOrg")
    public List<QpuOrgEntity> getOrgDetailForPage(@Param("key") String key, @Param("vo") VoModel<?, ?> vo);

    @SelectProvider(type = OrgProvider.class, method = "getOrgCount")
    public int getOrgCount(@Param("key") String key);

    @Results(value = { @Result(column = "orgID", property = "orgID"),
            @Result(column = "orgName", property = "mfctyName"),
            @Result(column = "orgType", property = "orgType"),
            @Result(column = "businessLicenseNo", property = "businessLicenseNo"),
            @Result(column = "businessLicensePic", property = "businessLicensePic"),
            @Result(column = "legalPerson", property = "legalPerson"),
            @Result(column = "identityNo", property = "identityNo"),
            @Result(column = "identityNoPic", property = "identityNoPic"),
            @Result(column = "contactPerson", property = "contactPerson"),
            @Result(column = "contactMobile", property = "contactMobile"),
            @Result(column = "businessTelephone", property = "businessTelephone"),
            @Result(column = "email", property = "email"),
            @Result(column = "businessType", property = "businessType"),
            @Result(column = "balance", property = "balance"),
            @Result(column = "status", property = "status"),
            @Result(column = "fax", property = "fax"),
            @Result(column = "countyID", property = "countyID"),
            @Result(column = "countyName", property = "countyName"),
            @Result(column = "cityID", property = "cityID"),
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "provinceID", property = "provinceID"),
            @Result(column = "provinceName", property = "provinceName"),
            @Result(column = "regionID", property = "regionID"),
            @Result(column = "regionName", property = "regionName"),
            @Result(column = "address", property = "address"),
            @Result(column = "facadePics", property = "facadePics"),
            @Result(column = "signTime", property = "signTime"),
            @Result(column = "updateTime", property = "updateTime"),
            @Result(column = "createTime", property = "createTime"),
            @Result(column = "auditTime", property = "auditTime") })
    @Select("select * from qpu_org where orgid=#{orgID}")
    public List<QpuOrgEntity> getOrgDetailByID(@Param("orgID") String orgID);

    @UpdateProvider(type = OrgProvider.class, method = "updateOrgDetail")
    public int updateOrgDetail(@Param("qpuOrgEntity")QpuOrgEntity qpuOrgEntity);


    @Results(value = { @Result(column = "orgID", property = "orgID"),
            @Result(column = "orgName", property = "mfctyName"),
            @Result(column = "contactPerson", property = "contactPerson"),
            @Result(column = "contactMobile", property = "contactMobile"),
            @Result(column = "address", property = "address"),
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "levelID", property = "levelID"),
            @Result(column = "startTime", property = "startTime"),
            @Result(column = "endTime", property = "endTime"),
            @Result(column = "auditTime", property = "auditTime") })
    @SelectProvider(type = OrgProvider.class, method = "getOrgForVipList")
    public List<OrgForVipVo> getOrgForVipList(@Param("key") String key, @Param("vo") VoModel<?, ?> vo, @Param("isVip")Boolean isVip, @Param("currentTime")String currentTime);

    @SelectProvider(type = OrgProvider.class, method = "getOrgForVipListForCount")
    public int getOrgForVipListForCount(@Param("key") String key, @Param("isVip")Boolean isVip, @Param("currentTime")String currentTime);

    @Results(value = { @Result(column = "orgID", property = "orgID"),
            @Result(column = "orgName", property = "mfctyName"),
            @Result(column = "contactPerson", property = "contactPerson"),
            @Result(column = "contactMobile", property = "contactMobile"),
            @Result(column = "address", property = "address"),
            @Result(column = "cityName", property = "cityName"),
            @Result(column = "levelID", property = "levelID"),
            @Result(column = "startTime", property = "startTime"),
            @Result(column = "endTime", property = "endTime"),
            @Result(column = "auditTime", property = "auditTime") })
    @Select("select  qo.orgID,qo.orgName,qo.cityName,qo.address,qo.contactMobile,qo.contactPerson,qo.auditTime,qom.LevelId,qom.startTime,qom.endTime  from qpu_org qo LEFT JOIN qpm_org_memberlevel qom ON qo.orgID=qom.OrgId where qo.orgID=#{orgID}")
    public OrgForVipVo getOrgForVipByOrgID(@Param("orgID")String orgID);

}

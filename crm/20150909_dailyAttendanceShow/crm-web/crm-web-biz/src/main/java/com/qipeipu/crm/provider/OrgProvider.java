package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.dtos.customer.QpuOrgEntity;
import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.utils.statistics.DateRange;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/11.
 */
public class OrgProvider {


    public String getOrg(Map<String, Object> map){

        String key = (String) map.get("key");
        StringBuilder sb = new StringBuilder();
        sb.append("select * from main.qpu_org where ").append(" 1=1 ");
        if(key!=null&&!key.trim().equals("")){
            sb.append( " and orgName like '%").append(key).append("%' ");
        }
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();
    }

    public String getOrgCount(Map<String, Object> map){
        String key = (String) map.get("key");
        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from main.qpu_org where ").append(" 1=1 ");
        if(key!=null&&!key.trim().equals("")){
            sb.append( " and orgName like '%").append(key).append("%' ");
        }
        return sb.toString();
    }

    public String getSeachMfctyForMain(Map<String, Object> map){

        String key = (String) map.get("key");
        StringBuilder sb = new StringBuilder();
        sb.append("select orgID,orgName,contactPerson,contactMobile,address,createTime from main.qpu_org where ").append(" 1=1 ");
        if(key!=null&&!key.trim().equals("")){
            sb.append( " and orgName like '%").append(key).append("%' ");
        }
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();

    }


    public String getMfctysByCityIDs(Map<String, Object> map){
        List<CityDTO> selectCityDTOs = (List<CityDTO>) map.get("cityDTOList");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<selectCityDTOs.size();i++){
            if(i==selectCityDTOs.size()-1) {
                ids.append(selectCityDTOs.get(i).getCityId());
            }else{
                ids.append(selectCityDTOs.get(i).getCityId()).append(",");
            }
        }
        if(selectCityDTOs.size()==0){
            ids.append("0");
        }
        StringBuilder sql = new StringBuilder();
        sql.append("select cityid,cityName,orgid from qpu_org where cityID is not null and cityid in (").append(ids).append(")");
        return sql.toString();
    }


    public String getMfctyNameAndStatusByMfctyID(Map<String, Object> map){
        String mfctyID = (String) map.get("mfctyID");
        StringBuilder sb = new StringBuilder();
        sb.append("select orgid,status,cityid,cityname,orgName,auditTime from main.qpu_org where status=2 and orgid=").append(mfctyID);
        return sb.toString();
    }

    public  String getRegisterNumByMfctyIDsAndTime(Map<String, Object> parameters){
        DateRange dateRange = (DateRange) parameters.get("dateRange");
        String endDate = null;
        String startDate = null;
        if(dateRange!=null) {
            endDate = dateRange.getEndDate();
            startDate = dateRange.getStartDate();
        }
        List<Integer> mfctyIDList = (List<Integer>) parameters.get("mfctyIDs");

        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }
        }
        if(mfctyIDList.size()==0){
            ids.append("0");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("select count(1) from main.qpu_org where orgid in").append(" (").append(ids).append(") ");

        if(endDate!=null&&startDate!=null){
            sb.append(" and auditTime>='").append(startDate).append("'").append(" and auditTime<='").append(endDate).append("'");
        }
        //System.out.println(sb.toString());
        return sb.toString();


    }

    public String updateOrgDetail(Map<String, Object> parameters){
        QpuOrgEntity qpuOrgEntity = (QpuOrgEntity) parameters.get("qpuOrgEntity");
        StringBuilder sb = new StringBuilder();
        sb.append("update main.qpu_org set ");
        sb.append("orgName='").append(qpuOrgEntity.getMfctyName()).append("',");
        sb.append("orgType='").append(qpuOrgEntity.getOrgType()).append("',");
        sb.append("businessLicenseNo='").append(qpuOrgEntity.getBusinessLicenseNo()).append("',");
        sb.append("businessLicensePic='").append(qpuOrgEntity.getBusinessLicensePic()).append("',");
        sb.append("legalPerson='").append(qpuOrgEntity.getLegalPerson()).append("',");
        sb.append("identityNo='").append(qpuOrgEntity.getIdentityNo()).append("',");
        sb.append("contactPerson='").append(qpuOrgEntity.getContactPerson()).append("',");
        sb.append("contactMobile='").append(qpuOrgEntity.getContactMobile()).append("',");
        sb.append("businessTelephone='").append(qpuOrgEntity.getBusinessTelephone()).append("',");
        sb.append("email='").append(qpuOrgEntity.getEmail()).append("',");
        sb.append("fax='").append(qpuOrgEntity.getFax()).append("',");
        sb.append("countyID='").append(qpuOrgEntity.getCountyID()).append("',");
        sb.append("countyName='").append(qpuOrgEntity.getCountyName()).append("',");
        sb.append("cityID='").append(qpuOrgEntity.getCityID()).append("',");
        sb.append("cityName='").append(qpuOrgEntity.getCityName()).append("',");
        sb.append("provinceID='").append(qpuOrgEntity.getProvinceID()).append("',");
        sb.append("provinceName='").append(qpuOrgEntity.getProvinceName()).append("',");
        sb.append("address='").append(qpuOrgEntity.getAddress()).append("',");
        sb.append("facadePics='").append(qpuOrgEntity.getFacadePics()).append("',");
        sb.append("updateTime='").append(qpuOrgEntity.getUpdateTime()).append("' ");
        sb.append(" where orgID=").append(qpuOrgEntity.getOrgID());
        //System.out.println(sb.toString());
        return sb.toString();
    }

    public String getOrgForVipList(Map<String, Object> map){


        String key = (String) map.get("key");
        Boolean isVip = (Boolean) map.get("isVip");
        String currentTime = (String) map.get("currentTime");
        StringBuilder sb = new StringBuilder();
        sb.append("select  qo.orgID,qo.orgName,qo.cityName,qo.address,qo.contactMobile,qo.contactPerson,qom.LevelId,qom.startTime,qom.endTime  from qpu_org qo LEFT JOIN qpm_org_memberlevel qom ON qo.orgID=qom.OrgId where ").append(" 1=1 ");
        if(key!=null&&!key.trim().equals("")){
            sb.append( " and orgName like '%").append(key).append("%' ");
        }
        if(isVip!=null){
            if(isVip){
                sb.append(" and qom.LevelId is not null ");
                sb.append(" and qom.startTime is not null and qom.endTime is not null and qom.startTime<='").append(currentTime)
                        .append("' and qom.endTime>='").append(currentTime).append("' ");

            }else{
                sb.append(" and ( qom.LevelId is null or qom.startTime is null and qom.endTime is null or '").append(currentTime).append("'<").append("qom.startTime or qom.endTime<'").append(currentTime).append("' ) ");
            }
        }
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        System.out.println(sb.toString());
        return sb.toString();

    }

    public String getOrgForVipListForCount(Map<String, Object> map){


        String key = (String) map.get("key");
        Boolean isVip = (Boolean) map.get("isVip");
        String currentTime = (String) map.get("currentTime");
        StringBuilder sb = new StringBuilder();
        sb.append("select  count(1)  from qpu_org qo LEFT JOIN qpm_org_memberlevel qom ON qo.orgID=qom.OrgId where ").append(" 1=1 ");
        if(key!=null&&!key.trim().equals("")){
            sb.append( " and orgName like '%").append(key).append("%' ");
        }
        if(isVip!=null){
            if(isVip){
                sb.append(" and qom.LevelId is not null ");
                sb.append(" and qom.startTime is not null and qom.endTime is not null and qom.startTime<='").append(currentTime)
                        .append("' and qom.endTime>='").append(currentTime).append("' ");

            }else{
                sb.append(" and ( qom.LevelId is null or qom.startTime is null and qom.endTime is null or '").append(currentTime).append("'<").append("qom.startTime or qom.endTime<'").append(currentTime).append("' ) ");
            }
        }
        return sb.toString();

    }

}

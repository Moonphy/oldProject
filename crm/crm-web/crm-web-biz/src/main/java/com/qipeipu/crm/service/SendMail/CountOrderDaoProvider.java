package com.qipeipu.crm.service.SendMail;

import com.qipeipu.crm.utils.bean.tools.TimeUtil;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/23.
 */

public class CountOrderDaoProvider {

    public String CountAll(Map<String, Object> parameters){
        List<Integer> mfctyIDList = (List<Integer>) parameters.get("mfctyIDs");
        StringBuilder ids = new StringBuilder();
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }
        }

        String currentTime = TimeUtil.getCurrentTime().substring(0, 10);
        StringBuilder sb = new StringBuilder("select b.cityname,sum(1) allnum,sum(o.actualAmount) as money from qp_order o left join");
        sb.append("(select m.orgid,c.cityid,c.cityname,m.orgType from `qpu_org` m,pt_city c where m.cityid=c.cityid  and c.provinceid=19) b on o.orgId=b.orgid");
        sb.append(" where  b.orgtype not in (30)   and   o.orgId not in (").append(ids).append(") and o.state in (3,4,5,8)  and o.paytime>='").append(currentTime).append("' group by b.cityname order by money desc");
        System.out.println(sb.toString()+"-");
        return sb.toString();
    }


    public String CountAllDetail(Map<String, Object> parameters){
        List<Integer> mfctyIDList = (List<Integer>) parameters.get("mfctyIDs");
        StringBuilder ids = new StringBuilder();
        String currentTime = TimeUtil.getCurrentTime().substring(0, 10);
        for(int i=0;i<mfctyIDList.size();i++){
            if(i==mfctyIDList.size()-1) {
                ids.append(mfctyIDList.get(i));
            }else{
                ids.append(mfctyIDList.get(i)).append(",");
            }
        }
        StringBuilder sb = new StringBuilder("select q.cityName,q.orgName,sum(p.actualAmount) as money,p.paytime from qpu_org q LEFT JOIN qp_order p on q.orgid = p.orgId where   q.orgtype not in (30) and  q.provinceid=19 and  p.state in (3,4,5,8) and p.paytime>='").append(currentTime).append("'");
        sb.append(" and p.orgid not in (").append(ids).append(") GROUP BY q.orgid order by q.cityName desc,actualAmount desc");
        //System.out.println(sb.toString());
        return sb.toString();
    }


}

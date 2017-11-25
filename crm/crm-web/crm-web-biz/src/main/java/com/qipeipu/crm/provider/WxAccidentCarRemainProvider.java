package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/3/27.
 */
public class WxAccidentCarRemainProvider {

    public String getAccidentRemainListSql(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder();
        sb.append("select t1.TaskId,t1.allnum,tc.MfctyName,t1.preBuyTime from ");
        sb.append("(select tut.TaskId,tut.CustId,sum(tua.num) as allNum,tua.preBuyTime from t_user_task tut LEFT JOIN t_user_accidentcar tua on tut.TaskId=tua.TaskId  where userid=").append(userID).append(" ");
        if(searchKey!=null){
            sb.append(" and tua.preBuyTime like '"+searchKey+"%' ");
        }else{
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String currentTime = sdf.format(date).substring(0, 10);
            sb.append(" and tua.preBuyTime like '"+currentTime+"%' ");
        }

        sb.append(" GROUP BY tut.TaskId) as t1");
        sb.append(" LEFT JOIN t_customer tc on t1.CustId=tc.id ");

        sb.append("LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();
    }

    public String getAccidentRemainListCountSql(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder();
        sb.append("select count(*) from ");
        sb.append("(select tut.TaskId,tut.CustId,sum(tua.num) as allNum,tua.preBuyTime from t_user_task tut LEFT JOIN t_user_accidentcar tua on tut.TaskId=tua.TaskId  where userid=").append(userID).append(" ");
        if(searchKey!=null){
            sb.append(" and tua.preBuyTime like '"+searchKey+"%' ");
        }else{
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String currentTime = sdf.format(date).substring(0, 10);
            sb.append(" and tua.preBuyTime like '"+currentTime+"%' ");
        }

        sb.append(" GROUP BY tut.TaskId) as t1");
        sb.append(" LEFT JOIN t_customer tc on t1.CustId=tc.id ");

        return sb.toString();
    }


    public String getAccidentRemainByTaskID(Map<String, Object> map){
        Integer taskID = (Integer) map.get("taskID");
        StringBuilder sb = new StringBuilder();
        sb.append("select t1.TaskId,t1.allnum,tc.MfctyName,t1.preBuyTime from ");
        sb.append("(select tut.TaskId,tut.CustId,sum(tua.num) as allNum,tua.preBuyTime from t_user_task tut LEFT JOIN t_user_accidentcar tua on tut.TaskId=tua.TaskId  where tut.TaskId=").append(taskID).append(" ");
        sb.append(" GROUP BY tut.TaskId) as t1");
        sb.append(" LEFT JOIN t_customer tc on t1.CustId=tc.id ");
        return sb.toString();
    }



    public String getRemainCarList(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder();
        sb.append("select t1.accidentcarId,t1.num,t1.preBuyTime,t1.cartype,t1.state,tc.MfctyName from ");
        sb.append("(select tua.accidentcarId,tua.num,tua.preBuyTime,tua.cartype,tua.state,tut.CustId from t_user_accidentcar tua LEFT JOIN t_user_task tut on tut.TaskId=tua.TaskId  where tua.state!=2 and tut.userid=").append(userID).append(" ");
        if(searchKey!=null&&!searchKey.trim().equals("")){
            sb.append(" and tua.preBuyTime like '"+searchKey+"%' ");
        }else{
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String currentTime = sdf.format(date).substring(0, 10);
            sb.append(" and tua.preBuyTime like '"+currentTime+"%' and tua.state=0 ");
        }

        sb.append(" ) as t1");
        sb.append(" LEFT JOIN  t_customer tc on t1.custid=tc.id ORDER BY t1.preBuyTime DESC  ");

        sb.append("LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();
    }

    public String getRemainCarListCount(Map<String, Object> map){
        Integer userID = (Integer) map.get("userID");
        String searchKey = (String) map.get("searchKey");
        StringBuilder sb = new StringBuilder();
        sb.append("select count(*) from ");
        sb.append("(select tua.accidentcarId,tua.num,tua.preBuyTime,tua.cartype,tut.CustId from t_user_accidentcar tua LEFT JOIN t_user_task tut on tut.TaskId=tua.TaskId  where tua.state!=2 and tut.userid=").append(userID).append(" ");
        if(searchKey!=null&&!searchKey.trim().equals("")){
            sb.append(" and tua.preBuyTime like '"+searchKey+"%' ");
        }else{
            Date date = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String currentTime = sdf.format(date).substring(0, 10);
            sb.append(" and tua.preBuyTime like '"+currentTime+"%' and tua.state=0 ");
        }
        sb.append(" ) as t1");
        sb.append(" LEFT JOIN  t_customer tc on t1.custid=tc.id ");
        System.out.println(sb.toString());
        return sb.toString();
    }

}

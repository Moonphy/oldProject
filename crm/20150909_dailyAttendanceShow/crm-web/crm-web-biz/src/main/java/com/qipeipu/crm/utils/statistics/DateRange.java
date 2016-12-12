package com.qipeipu.crm.utils.statistics;

import com.qipeipu.crm.utils.bean.tools.TimeUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.Builder;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by laiyiyu on 2015/4/17.
 */
@AllArgsConstructor
@Data
@Builder
public class DateRange {

    private String startDate;

    private String endDate;

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public DateRange(){
        this.endDate = sdf.format(Calendar.getInstance().getTime());
    }

    public DateRange(String start, String end){

        this.startDate = start;
        this.endDate = end;

       // System.out.println(startDate+"-"+endDate);

    }

    public String getStartDate(){
        return this.startDate;
    }

    public String getEndDate(){
        return this.endDate;
    }

    public void setTodayDate(){
        Calendar c = java.util.Calendar.getInstance();
        c.setTime(new Date());
        c.set(java.util.Calendar.HOUR_OF_DAY, 0);
        c.set(java.util.Calendar.MINUTE, 0);
        c.set(java.util.Calendar.SECOND, 0);

        this.startDate = sdf.format(c.getTime());
    }

    public void setThisWeekDate(){
        int mondayPlus;
        Calendar cd = Calendar.getInstance();
// 获得今天是一周的第几天，星期日是第一天，星期二是第二天......
        int dayOfWeek = cd.get(Calendar.DAY_OF_WEEK) - 1; // 因为按中国礼拜一作为第一天所以这里减1
        if (dayOfWeek == 1) {
            mondayPlus = 0;
        } else {
            mondayPlus = 1 - dayOfWeek;
        }
        GregorianCalendar currentDate = new GregorianCalendar();
        currentDate.add(GregorianCalendar.DATE, mondayPlus);
        Date monday = currentDate.getTime();


        DateFormat df = DateFormat.getDateInstance();
        String preMonday = df.format(monday)+ " 00:00:00";

        this.startDate = preMonday;

    }

    public void setThisMonthDate(){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MONTH, 0);
        c.set(Calendar.DAY_OF_MONTH,1);//设置为1号,当前日期既为本月第一天
        this.startDate = df.format(c.getTime());
        this.endDate = TimeUtil.getCurrentTime().substring(0, 10);
    }

    public static void main(String[] args){
        DateRange dateRange = new DateRange();
        dateRange.setThisMonthDate();
        System.out.println(dateRange.getStartDate()+"-"+dateRange.endDate);

    }



}

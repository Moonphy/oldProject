package com.qipeipu.crm.utils.bean.tools;

import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by laiyiyu on 2015/3/30.
 */
public class TimeUtil {

	public static void main(String[] args){



		System.out.println(getDayDifference("2015-01-03", "2015-01-04"));

		System.out.println(getYesterday("2015-01-03"));

	/*	Calendar c_begin = new GregorianCalendar();
		Calendar c_end = new GregorianCalendar();
		DateFormatSymbols dfs = new DateFormatSymbols();
		String[] weeks = dfs.getWeekdays();

		c_begin.set(c_begin.get(Calendar.YEAR), 4, 1); //Calendar的月从0-11，所以4月是3.
		c_end.set(c_end.get(Calendar.YEAR), 5,1); //Calendar的月从0-11，所以5月是4.

		//int count = 1;
		//c_end.add(Calendar.DAY_OF_YEAR, 1);  //结束日期下滚一天是为了包含最后一天

		System.out.println(new java.sql.Date(c_begin.getTime().getTime()).toString());
		System.out.println(new java.sql.Date(c_end.getTime().getTime()).toString());


		while(c_begin.before(c_end)){
			//System.out.println("第"+count+"周  日期："+new java.sql.Date(c_begin.getTime().getTime())+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]);

				System.out.println(new java.sql.Date(c_begin.getTime().getTime()).toString()+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]+"-");

			*//*if(c_begin.get(Calendar.DAY_OF_WEEK)==Calendar.SUNDAY){
				System.out.println(new java.sql.Date(c_begin.getTime().getTime())+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]);
			}*//*
			c_begin.add(Calendar.DAY_OF_YEAR, 1);
		}*/
	}


	public static List<String> partitionMonth(int year, int month, String partitionType){
		if(partitionType==null||partitionType.trim().equals("")){
			partitionType = "perDay";
		}
		List<String> result = new ArrayList<>();
		Calendar c_begin = new GregorianCalendar();
		Calendar c_end = new GregorianCalendar();
		DateFormatSymbols dfs = new DateFormatSymbols();
		c_begin.set(year, month-1, 1); //Calendar的月从0-11，所以4月是3.
		c_end.set(year, month,1);

		if(partitionType.equals("perDay")) {
			c_end.add(Calendar.DAY_OF_YEAR, 1);
			while(c_begin.before(c_end)){
				result.add(new java.sql.Date(c_begin.getTime().getTime()).toString());
				c_begin.add(Calendar.DAY_OF_YEAR, 1);
			}
		}else if(partitionType.equals("perWeek")) {
			String[] weeks = dfs.getWeekdays();
			c_end.add(Calendar.DAY_OF_YEAR, 1);  //结束日期下滚一天是为了包含最后一天
			while (c_begin.before(c_end)) {
				//System.out.println("第"+count+"周  日期："+new java.sql.Date(c_begin.getTime().getTime())+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]);
				if (c_begin.get(Calendar.DAY_OF_WEEK) == Calendar.MONDAY) {
					//System.out.println(new java.sql.Date(c_begin.getTime().getTime()).toString()+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]);
					result.add(new java.sql.Date(c_begin.getTime().getTime()).toString());
				}
			/*if(c_begin.get(Calendar.DAY_OF_WEEK)==Calendar.SUNDAY){
				System.out.println(new java.sql.Date(c_begin.getTime().getTime())+","+weeks[c_begin.get(Calendar.DAY_OF_WEEK)]);
			}*/
				c_begin.add(Calendar.DAY_OF_YEAR, 1);
			}
		}else {
			result.add(new java.sql.Date(c_begin.getTime().getTime()).toString());
			result.add(new java.sql.Date(c_end.getTime().getTime()).toString());
		}
		return result;
	}


	/**
	 * 获取指定日期的后x天
	 * @param select
	 * @return
	 */
	public static String getNextDayForX(String select, int x){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Date selectDate = null;
		try {
			selectDate = df.parse(select);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(selectDate);
		calendar.add(Calendar.DATE, x);
		Date date = calendar.getTime();
		return df.format(date);
	}


	/**
	 * 获取指定日期的下一天
	 * @param select
	 * @return
	 */
	public static String getNextDay(String select){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Date selectDate = null;
		try {
			selectDate = df.parse(select);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(selectDate);
		calendar.add(Calendar.DATE, 1);    //得到下一天
		Date date = calendar.getTime();
		return df.format(date);
	}

	/**
	 * 获取指定日期的前天
	 * @param select
	 * @return
	 */
	public static String getYesterday(String select){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Date selectDate = null;
		try {
			selectDate = df.parse(select);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(selectDate);
		calendar.add(Calendar.DATE, -1);    //得到前一天
		Date date = calendar.getTime();
		return df.format(date);
	}


	public static long getTimeDifferenceForMillions(String enterTime, String leaveTime){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date start = null;
		Date end= null;
		try {
			start = df.parse(enterTime);
			end = df.parse(leaveTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return end.getTime()-start.getTime();
	}

	public static String getTimeDifferenceForDayAndHourAndMin(long time){
		long day=time/(24*60*60*1000);
		long hour=(time/(60*60*1000)-day*24);
		long min=((time/(60*1000))-day*24*60-hour*60);
		long s=(time/1000-day*24*60*60-hour*60*60-min*60);
		StringBuilder sb = new StringBuilder();
		sb.append(day).append("天").append(hour).append("时").append(min).append("分").append(s).append("秒");
		return sb.toString();

	}



	/**
	 * 获取两个日期的天数差
	 * @param start
	 * @param end
	 * @return
	 */
	public static int getDayDifference(String start, String end){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date d1 = null;
		Date d2 = null;
		try {
			d1 = sdf.parse(start);
			d2 = sdf.parse(end);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(d1);
		long time1 = cal.getTimeInMillis();
		cal.setTime(d2);
		long time2 = cal.getTimeInMillis();
		long between_days=(time2-time1)/(1000*3600*24);
		return Integer.parseInt(String.valueOf(between_days));
	}




	/**
	 * 获取当前系统时间
	 * @return
	 */
    public static String getCurrentTime(){
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date);
    }


	public static Date objectToDate(Object o) {
		if (o != null) {
			if (o instanceof Date) {
				return ((Date) o);
			} else if (o instanceof String) {
				return yyyyMMddHHmmssToDate((String) o);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	public static Date objectToDate(Object o, String sFmt) {
		if (o != null) {
			if (o instanceof Date) {
				return ((Date) o);
			} else if (o instanceof String) {
				return StringToDate((String) o, sFmt);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}

	public static Date yyyyMMddToDate(String sDate) {
		return StringToDate(sDate, "yyyy-MM-dd");
	}

	public static String yyyyMMddToyyyyMMddHHmmss(String sDate) {
		return sDate + " 00:00:00" ;
	}

	public static Date yymmddIntToDate(String sDate) {
		return StringToDate(sDate, "yyyyMMdd");
	}

	public static Date StringToDate(String sDate, String fmt) {
		java.text.DateFormat df2 = new java.text.SimpleDateFormat(fmt);
		try {
			Date date2 = df2.parse(sDate);
			return date2;
		} catch (ParseException e) {
			return null;
		}
	}

	public static String dateToyyyymmdd(Date date) {
		java.text.DateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
		return df.format(date);
	}

	public static String dateToyyyymmddInt(Date date) {
		java.text.DateFormat df = new java.text.SimpleDateFormat("yyyyMMdd");
		return df.format(date);
	}

	public static String dateToyyyyMMddHHmmss(Date date) {
		java.text.DateFormat df = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		return df.format(date);
	}

	public static String dateToString(Date date, String fmt) {
		java.text.DateFormat df = new java.text.SimpleDateFormat(fmt);
		return df.format(date);
	}

	public static Date yyyyMMddHHmmssToDate(String sDate) {
		java.text.DateFormat df2 = new java.text.SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		try {
			Date date2 = df2.parse(sDate);
			return date2;
		} catch (ParseException e) {
			return null;
		}
	}

	public static String yyyyMMddHHmmssToyyyyMMdd(String DateStr) {
		return DateStr.split(" ")[0] ;
	}


	public static Date getAddYear(Date d) {
		return getAddYear(d, 1);
	}

	public static Date getAddYear(Date d, int n) {
		Calendar c = new GregorianCalendar();
		c.setTime(d);
		c.add(Calendar.YEAR, n);
		return c.getTime();
	}

	public static Date getAddMonth(Date d) {
		return getAddMonth(d, 1);
	}

	public static Date getAddMonth(Date d, int n) {
		Calendar c = new GregorianCalendar();
		c.setTime(d);
		c.add(Calendar.MONTH, n);
		return c.getTime();
	}

	public static Date getAddDay(Date d) {
		return getAddDay(d, 1);
	}

	public static Date getAddDay(Date d, int n) {
		Calendar c = new GregorianCalendar();
		c.setTime(d);
		c.add(Calendar.DATE, n);
		return c.getTime();
	}

	@Deprecated
	public static Date getAddDate(Date d) {
		return getAddDate(d, 1);
	}

	@Deprecated
	public static Date getAddDate(Date d, int n) {
		Calendar c = new GregorianCalendar();
		c.setTime(d);
		c.add(Calendar.DATE, n);
		return c.getTime();
	}

	public static Date getLastDayOfMonth(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		final int lastDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
		calendar.set(Calendar.DAY_OF_MONTH, lastDay);
		return calendar.getTime();
	}

	public static long getDiffDay(Date dateBegin, Date dateEnd) {
		return getDiffDay(dateEnd.getTime(), dateBegin.getTime());
	}

	public static long getDiffDay(long dateBegin, long dateEnd) {
		long lDiff = dateEnd - dateBegin;
		return lDiff / (1000 * 60 * 60 * 24);
	}

	public static String getFormatSpanTimeNow(long date) {
		long endTime = System.currentTimeMillis();
		return getFormatSpanTime(date, endTime);
	}

	public static String getFormatSpanTime(long startTime, long endTime) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(endTime - startTime);
		return "span: " + c.get(Calendar.MINUTE) + "m:"
				+ c.get(Calendar.SECOND) + "s:" + c.get(Calendar.MILLISECOND)
				+ "ms";
	}


}

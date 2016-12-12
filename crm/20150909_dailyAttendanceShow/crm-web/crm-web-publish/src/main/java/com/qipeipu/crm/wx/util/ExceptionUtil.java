package com.qipeipu.crm.wx.util;

/**
 * Created by laiyiyu on 2015/5/19.
 */
public class ExceptionUtil {

    public static String getStackMsg(Exception e){
        StringBuffer sb = new StringBuffer();
        StackTraceElement[] stackArray = e.getStackTrace();
        sb.append("------------------\n");
        sb.append("异常Exception：").append("\n");
        sb.append("异常原因：").append(e.getCause()).append("\n");
        sb.append("异常信息：").append(e.getMessage()).append("\n");
        sb.append("异常定位：\n");
        for(StackTraceElement stackTraceElement : stackArray){
            sb.append(stackTraceElement.toString()+"\n");
        }
        sb.append("------------------\n");
        return sb.toString();
    }

    public static String getStackMsg(Throwable e){
        StringBuffer sb = new StringBuffer();
        StackTraceElement[] stackArray = e.getStackTrace();
        sb.append("------------------\n");
        sb.append("异常Throwable：").append("\n");
        sb.append("异常原因：").append(e.getCause()).append("\n");
        sb.append("异常信息：").append(e.getMessage()).append("\n");
        sb.append("异常定位：\n");
        for(StackTraceElement stackTraceElement : stackArray){
            sb.append(stackTraceElement.toString()+"\n");
        }
        sb.append("------------------\n");
        return sb.toString();
    }

}

package com.qipeipu.crm.utils.statistics;

import com.google.common.collect.Multimap;

import java.util.List;
import java.util.Map;

/**
 * Created by laiyiyu on 2015/5/6.
 */
public class BaseJudgeUtil {

    public static boolean isEmpty(String[] input){
        if(input==null || input.length==0){
            return true;
        }else{
            return false;
        }
    }

    public static  boolean isEmpty(Object input){
        if(input==null){
            return true;
        }else{
            return false;
        }
    }

    public static boolean isEmpty(String input){
        if(input==null||input.trim().equals("")){
            return true;
        }else{
            return false;
        }
    }

    public static boolean isEmpty(Multimap input){
        if(input==null||input.size()==0){
            return true;
        }else{
            return false;
        }
    }

    public static boolean isEmpty(Map input){
        if(input==null||input.size()==0){
            return true;
        }else{
            return false;
        }
    }

    public static boolean isEmpty(List input){
        if(input==null||input.size()==0){
            return true;
        }else{
            return false;
        }
    }

}

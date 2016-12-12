package com.qipeipu.crm.utils.statistics;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/4/29.
 */
public class TransformUtil {

    public static List<Integer> StringToIntegerList(List<String> input){
        List<Integer> result = new ArrayList<>();
        for(String s : input){
            result.add(Integer.parseInt(s));
        }
        return  result;
    }
}

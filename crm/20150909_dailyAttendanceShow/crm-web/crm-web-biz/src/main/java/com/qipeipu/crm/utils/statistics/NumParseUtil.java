package com.qipeipu.crm.utils.statistics;

import java.text.DecimalFormat;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public class NumParseUtil {


    public static Double keepTwoDecimal(Double d){
        DecimalFormat df = new DecimalFormat("######0.00");
        if(d==null){
            return null;
        }
        String result = df.format(d);
        return Double.parseDouble(result);
    }

}

package com.qipeipu.crm.dao.main.provider;

import org.springframework.util.CollectionUtils;

import java.util.List;

/**
 * Date: 2014/11/15
 * Time: 17:34
 */
public class SqlProvider {

    /**
     * sql in条件中的无效值(String)
     */
    final String STRING_INVALID_VALUE = "'-1'";

    /**
     * sql in条件的无效值(int)
     */
    final String INT_INVALID_VALUE = "-1";

    /**
     * 拼接in的连接字符串
     */
    final String IN_DELIMITER = ",";

    public String getStringConditions(List<String> params){
        if(CollectionUtils.isEmpty(params)){
            return STRING_INVALID_VALUE;
        }
        StringBuilder paramBuilder = new StringBuilder();
        for(String param : params){
            paramBuilder.append("'"+param+"'"+IN_DELIMITER);
        }
        paramBuilder.append(STRING_INVALID_VALUE);
        return paramBuilder.toString();
    }

    public String getIntegerConditions(List<Integer> params){
        if(CollectionUtils.isEmpty(params)){
            return INT_INVALID_VALUE;
        }
        StringBuilder paramBuilder = new StringBuilder();
        for(Integer param : params){
            paramBuilder.append(param+IN_DELIMITER);
        }
        paramBuilder.append(INT_INVALID_VALUE);
        return paramBuilder.toString();
    }

}

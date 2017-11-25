package com.qipeipu.crm.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator:LiuJunyong on 2015/8/6.
 *
 */
public class RequestMethodConst {
    //请求方法类型枚举类
    public enum RequestMethodType {
        UNKOWN("未知" , 0) ,
        HTTP_GET("GET" , 1) ,
        HTTP_POST("POST" , 2)
        ;

        private String context ;
        private int index ;

        private RequestMethodType(String context , int index){
            this.context = context;
            this.index = index ;
        }
        public String getContext(){ return context ; }
        public int getIndex(){ return index ; }
    }

    //请求方法类型映射
    private static final Map<String , RequestMethodType> context2RequestMethodTypeMap ;
    static {
        Map<String , RequestMethodType> tmp = new HashMap<>() ;
        for(RequestMethodType i : RequestMethodType.values()) tmp.put(i.getContext() , i) ;
        context2RequestMethodTypeMap = tmp ;
    }

    //获取对应的请求方法枚举类
    public static RequestMethodType getRequestMethodType(String requestName) {
        if (null == requestName) return RequestMethodType.UNKOWN ;
        RequestMethodType tmp = context2RequestMethodTypeMap.get(requestName) ;
        return (null == tmp ? RequestMethodType.UNKOWN : tmp) ;
    }
}

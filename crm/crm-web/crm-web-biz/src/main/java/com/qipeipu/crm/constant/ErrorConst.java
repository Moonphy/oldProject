package com.qipeipu.crm.constant;

/**
 * Created by Administrator:LiuJunyong on 2015/8/18.
 *
 */
public class ErrorConst {
    /**
     * 错误索引
     * @see com.baturu.common.constants.ErrorCode
     */

    /**
     * 系统错误
     */
    public final static int SYSTEM_ERROR = 1;

    /**
     * 结果集为空
     */
    public final static int RESULT_IS_EMPTY = 2;

    /**
     * 参数非法
     */
    public final static int ILLEGAL_ARGS = 3;

    //未定义错误
    public final static int UNKNOWN_ERROR = -1 ;

    //无错误
    public final static int NO_ERROR = 0 ;








    //错误类型枚举类
    public enum ErrorType {
        UNKOWN_ERROR("未定义错误" , -1) ,
        NO_ERROR("无错误" , 0) ,
        SYSTEM_ERROR("系统错误" , 1) ,
        RESULT_IS_EMPTY("结果集为空" , 2) ,
        ILLEGAL_ARGS("参数非法" , 3)
        ;

        private String context ;
        private int index ;

        private ErrorType(String context , int index){
            this.context = context;
            this.index = index ;
        }
        public String getContext(){ return context ; }
        public int getIndex(){ return index ; }
    }
}

package com.qipeipu.crm.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator:LiuJunyong on 2015/7/30.
 */
public class HitEggConst {
    //砸蛋规则枚举类
    public enum HitEggRole {
        OUT("不参与活动" , 0) ,
        HIGHT("高规则" , 1) ,
        MID("中规则" , 3) ,
        LOW("低规则" , 5)
        ;

        private String context ;
        private int level ;

        private HitEggRole(String context , int level){
            this.context = context;
            this.level = level ;
        }
        public String getContext(){ return context ; }
        public int getLevel(){ return level ; }
    }



    //砸蛋规则映射
    private static final Map<Integer , HitEggRole> level2HitEggRoleMap ;
    static {
        Map<Integer , HitEggRole> tmp = new HashMap<>() ;
        for(HitEggRole i : HitEggRole.values()) tmp.put(i.getLevel() , i) ;
        level2HitEggRoleMap = tmp ;
    }




    //获取砸蛋规则名称
    public static final String defaultRoleName = "未知" ;
    public static String getRoleName(Integer level) {
        if (null == level) return defaultRoleName ;
        HitEggRole re = level2HitEggRoleMap.get(level) ;
        return (null == re ? defaultRoleName : re.getContext()) ;
    }
}

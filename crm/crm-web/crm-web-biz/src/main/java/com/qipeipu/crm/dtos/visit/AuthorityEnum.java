package com.qipeipu.crm.dtos.visit;

/**
 * Created by laiyiyu on 2015/4/7.
 */
public enum AuthorityEnum {


    MAJORDOMO(1),CITY_MANAGER(2),MARKET_MANAGER(3),SUPERVISOR(4);

    private int nCode;

    private AuthorityEnum(Integer nCode){
        this.nCode = nCode;
    }

    public String toString(){
        return String.valueOf(this.nCode);
    }





}

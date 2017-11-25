package com.qipeipu.crm.service.impl.user;

import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Test;

/**
 * Created by Administrator on 2015/3/30.
 */
public class DateTest {

    @Test
    public void test(){
        DateTimeFormatter fmt = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss SSS");
//        String s =fmt.print(dt);
//        dt= fmt.parseDateTime("2013-01-07 22:39:13 782");
    }
}

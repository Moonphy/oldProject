package com.qipeipu.crm.utils.bean.spring;

import java.beans.PropertyEditorSupport;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by johnkim on 15-2-6.
 * 日期属性编辑器
 */
public class DateEditor extends PropertyEditorSupport {
    @Override
    public void setAsText(String dateStr) throws IllegalArgumentException {
        Date d =this.parseToDate(dateStr);
        this.setValue(d);
    }

    private Date parseToDate(String date)
    {
        String format = "yyyy-MM-dd HH:mm:ss";
        DateFormat df =new SimpleDateFormat(format);
        Date d = null;
        try {
            d = df.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return d;
    }
}

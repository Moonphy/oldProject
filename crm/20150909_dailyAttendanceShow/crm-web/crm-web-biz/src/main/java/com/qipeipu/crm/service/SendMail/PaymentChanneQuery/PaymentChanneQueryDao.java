package com.qipeipu.crm.service.SendMail.PaymentChanneQuery;

import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by laiyiyu on 2015/6/5.
 */
public interface PaymentChanneQueryDao {


    public List<PaymentChanneQueryEntity> paymentChanneQueryForWeek(@Param("dataRange")DateRange dateRange);







}

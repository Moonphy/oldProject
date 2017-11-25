package com.qipeipu.crm.controller;

import com.qipeipu.crm.dtos.visit.OrderFormEntity;
import com.qipeipu.crm.utils.statistics.ExcelUtil;
import com.qipeipu.crm.wx.util.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/5/22.
 */
@Controller
@Slf4j
@RequestMapping(value = "export")
public class ExportExcelController {

    @RequestMapping(value = "find/excel", method = RequestMethod.GET)
    public void getDutyList(HttpServletRequest request,
                            HttpServletResponse response, String exportName, String start, String end){
        OutputStream ops = null;
        response.setContentType("octets/stream");
        StringBuilder sb = new StringBuilder();
        sb.append("attachment;filename=").append(exportName).append(".xls");
        response.addHeader("Content-Disposition", sb.toString());
        try {
            ops = response.getOutputStream();
            List<OrderFormEntity> input = new ArrayList<>();
            OrderFormEntity order1 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
            OrderFormEntity order2 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
            OrderFormEntity order3 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
            OrderFormEntity order4 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();

            input.add(order1);input.add(order2);input.add(order3);input.add(order4);
            //List<String[]> contents = ReflectUtil.ergodicCollection(input);
            String[] heads = {"1","1","1","1","1","1","1","1","1"};
            ExcelUtil.exportExcel("报表", heads, input, ops);
        } catch (Exception e) {
            log.error("导出"+exportName+"异常："+ ExceptionUtil.getStackMsg(e));
        }


    }







}

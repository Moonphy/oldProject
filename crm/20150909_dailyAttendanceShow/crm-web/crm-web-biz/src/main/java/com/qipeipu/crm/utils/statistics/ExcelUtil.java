package com.qipeipu.crm.utils.statistics;

import com.qipeipu.crm.dtos.visit.OrderFormEntity;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by laiyiyu on 2015/5/20.
 */
public class ExcelUtil {


    public static void exportExcel(String title, String[] headers,
                            Collection<?> dataset, OutputStream out)
    {
        // 声明一个工作薄
        HSSFWorkbook workbook = new HSSFWorkbook();
        // 生成一个表格
        HSSFSheet sheet = workbook.createSheet(title);
        // 设置表格默认列宽度为15个字节
        sheet.setDefaultColumnWidth((short) 18);
        sheet.setDefaultRowHeight((short)15);
        // 生成一个样式
       /* HSSFCellStyle style = workbook.createCellStyle();
        // 设置这些样式
        style.setFillForegroundColor(HSSFColor.SKY_BLUE.index);
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);*/
        // 生成一个字体
        HSSFFont font = workbook.createFont();
        font.setFontHeightInPoints((short) 12);
        font.setFontName("新宋体");
        font.setColor(HSSFColor.BLACK.index);
        font.setBoldweight((short) 0.8);
        //2.生成样式对象
        HSSFCellStyle style = workbook.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        style.setFont(font); //调用字体样式对象
        /*HSSFFont font = workbook.createFont();
        font.setColor(HSSFColor.VIOLET.index);
        font.setFontHeightInPoints((short) 18);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);*/
        // 把字体应用到当前的样式
        //style.setFont(font);
        // 生成并设置另一个样式
   /*     HSSFCellStyle style2 = workbook.createCellStyle();
        style2.setFillForegroundColor(HSSFColor.LIGHT_YELLOW.index);
        style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
        // 生成另一个字体
        HSSFFont font2 = workbook.createFont();
        font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
        // 把字体应用到当前的样式
        style2.setFont(font2);*/

        // 声明一个画图的顶级管理器
        HSSFPatriarch patriarch = sheet.createDrawingPatriarch();
        // 定义注释的大小和位置,详见文档
        /*HSSFComment comment = patriarch.createComment(new HSSFClientAnchor(0,
                0, 0, 0, (short) 4, 2, (short) 6, 5));*/
        // 设置注释内容
       /* comment.setString(new HSSFRichTextString("可以在POI中添加注释！"));
        // 设置注释作者，当鼠标移动到单元格上是可以在状态栏中看到该内容.
        comment.setAuthor("lyy");*/
        List<String[]> contents = ReflectUtil.ergodicCollection(dataset);

        // 产生表格标题行
        HSSFRow row = sheet.createRow(0);
        for (short i = 0; i < headers.length; i++)
        {
            HSSFCell cell = row.createCell(i);
            //cell.setCellStyle(style);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            text.applyFont(font);
            cell.setCellValue(text);
        }

        // 遍历集合数据，产生数据行
        int index = 0;

        for(String[] content : contents){
            index++;
            row = sheet.createRow(index);
            for(int i = 0; i < content.length; i++){
                HSSFCell cell = row.createCell(i);
                //cell.setCellStyle(style2);
                String textValue = content[i];
                if (textValue != null)
                {
                    Pattern p = Pattern.compile("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$");
                    Matcher matcher = p.matcher(textValue.trim());
                    if (matcher.matches())
                    {
                        cell.setCellStyle(style);
                        // 是数字当作double处理
                        cell.setCellValue(Double.parseDouble(textValue));
                    }
                    else
                    {
                        HSSFRichTextString richString = new HSSFRichTextString(textValue);
                     /*   HSSFFont font3 = workbook.createFont();
                        font3.setColor(HSSFColor.BLUE.index);*/
                        richString.applyFont(font);
                        cell.setCellValue(richString);
                    }
                }

            }
        }

        try
        {
            workbook.write(out);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }




    public static  void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException, FileNotFoundException {
        //OrderFormEntity order = new OrderFormEntity();
        List<OrderFormEntity> input = new ArrayList<>();
        OrderFormEntity order1 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
        OrderFormEntity order2 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
        OrderFormEntity order3 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();
        OrderFormEntity order4 = OrderFormEntity.builder().orderMainID("sdf").orderMainNo("123").orderStatus(1).allNum(1).mfctyName("nima").money(1232.00).orgID("12").payStatus(1).publishTime("2015-01-01").build();

        input.add(order1);input.add(order2);input.add(order3);input.add(order4);
        //List<String[]> contents = ReflectUtil.ergodicCollection(input);
        String[] heads = {"1","1","1","1","1","1","1","1","1"};
        OutputStream out = new FileOutputStream("D:\\work\\excel\\a.xls");
        exportExcel("报表", heads, input, out);



    }

    public static void readExcel(String filePath)
    {

    }

}

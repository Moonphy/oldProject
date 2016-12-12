package com.qipeipu.crm.service.SendMail;

import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.statistics.SmsOrderDao;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;
import com.qipeipu.crm.utils.javaMail.ButuluSmsClient;
import lombok.extern.java.Log;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Administrator on 2015/4/23.
 */
@Log
@Service
public class SendMailServiceImpl implements SendMailService,InitializingBean {

    @Autowired
    private SmsOrderDao smsOrderDao;

    private  PropertiesConfiguration contacts;

    @Override
    public void afterPropertiesSet() throws Exception {
        contacts = new PropertiesConfiguration("contacts.properties");
    }

    public void work(){
        try {
            String content = getSendContent();
            Date date = new Date();
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String s = sd.format(date);
            String subject = "[STAT]分城市交易统计[截止" + s + "]";
            ButuluSmsClient butuluSmsClient = ButuluSmsClient.getInstance();
            log.info(s + "开始发城市交易统计邮件");
            Map contectMap = loadContactsAsMap();
            for(Iterator iter=contectMap.keySet().iterator();iter.hasNext();){
                String receiver = (String) contectMap.get(iter.next());
                butuluSmsClient.sendHtmlMail(receiver, subject, content);
            }
            /*butuluSmsClient.sendHtmlMail("laiyiyu@qipeipu.com", subject, content);
            butuluSmsClient.sendHtmlMail("fengbin@qipeipu.com", subject, content);*/
            //getSendContent();\
        }catch(Exception e){
            log.info("统计邮件:"+ e.getMessage());
        }
    }

    private Map loadContactsAsMap(){
        Map contactMap = new HashMap();
        Properties p = new Properties();
        try {
            p.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("contacts.properties"));
            contactMap = p;
        } catch (IOException e) {
            log.info(e.getMessage());
        }
        return contactMap;
    }

    private String getSendContent(){
        MultipleDataSource.setDataSourceKey("mainDataSource");
        List<Integer> removeMf = Lists.newArrayList(907, 341, 515, 1539, 554, 521, 211, 222, 201, 55, 156, 160, 578, 65, 67, 1461, 909, 235, 36,
                10167, 28, 29, 32, 35, 40, 41, 44, 49, 58, 60, 3698, 1494, 9226, 1909, 103, 10437, 3368, 3386, 4906, 6055, 6056, 6392,
                2679, 2714, 2685, 7225, 8177, 8342, 9303, 12948, 12999,715,4643,12802,14231,14417,14424,14485,14555,14556,14562,14579,14678,14724,14797,14896,14897,15167,15173);
        List<CountOrderForMailEntity> countOrderForMailEntities = smsOrderDao.CountAll(removeMf);
        int totalSize = 0;
        double totalMoney = 0.00;
        StringBuilder sb = new StringBuilder();
        sb.append("<html>");
        sb.append("<body>");

        sb.append("<br/>").append("<br/>");
        sb.append("嘿！勇士们！");
        sb.append("<br/>").append("<br/>");
        sb.append("以下是分城市汇总数据<br/>");
        sb.append("<table border=1>");
        sb.append("<tr><td>城市名称</td>").append("<td>交易订单数</td>").append("<td>交易金额</td></tr>");

        for(CountOrderForMailEntity countOrderForMailEntity :countOrderForMailEntities ){
            if(countOrderForMailEntity.getMoney()!=null){
                totalMoney += countOrderForMailEntity.getMoney();
            }
            if(countOrderForMailEntity.getAllNum()!=null){
                totalSize += countOrderForMailEntity.getAllNum();
            }
            sb.append("<tr>");
            sb.append("<td>").append(countOrderForMailEntity.getCityName()).append("</td><td>").append(countOrderForMailEntity.getAllNum()).append("</td><td>").append(countOrderForMailEntity.getMoney()).append("</td>");
            sb.append("</tr>");
        }
        sb.append("<tr>");
        sb.append("<td>").append("全部").append("</td><td>").append(totalSize).append("</td><td>").append(totalMoney).append("</td>");
        sb.append("</tr>");
        sb.append("</table>");

        sb.append("<br/>").append("<br/>").append("<br/>");
        List<CountOrderForMailDetailEntity> countOrderForMailDetailEntities = smsOrderDao.CountAllDetail(removeMf);
        sb.append("以下是明细数据<br/>");
        sb.append("<table border=1>");
        sb.append("<tr><td>城市名称</td>").append("<td>汽修厂</td>").append("<td>交易金额</td>").append("<td>交易时间</td></tr>");
        for(CountOrderForMailDetailEntity countOrderForMailDetailEntity :countOrderForMailDetailEntities ){
            sb.append("<tr>");
            sb.append("<td>").append(countOrderForMailDetailEntity.getCityName()).append("</td><td>").append(countOrderForMailDetailEntity.getOrgName()).append("</td><td>").append(countOrderForMailDetailEntity.getMoney()).append("</td><td>").append(countOrderForMailDetailEntity.getTime()).append("</td>");
            sb.append("</tr>");
        }
        sb.append("</table>");
        sb.append("</body>");
        sb.append("</html>");
        MultipleDataSource.setDataSourceKey("dataSource");
        System.out.println(sb.toString());
        return sb.toString();
    }

}

package com.qipeipu.crm.service.sendSms;

/**
 * Created by Administrator on 2015/5/29.
 */

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.PostMethod;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
public class SendSMS {
    public static void main(String[] args) {
        String url = "http://finance.aliyun.com/recharge/sendMessage.json";
        String token = "9ZuD6iN0aFDN2SzFjEMKuA";
        String mobile = "15915865807";
        String sendStr = "奇瑞丰 草根银行 8888 8888 8888 888";
        SendSMS ss = new SendSMS();
        String result = ss.getPostPage(url, mobile, sendStr, token);
        System.out.println(result);
    }
    public String getPostPage(String url, String mobile, String sendStr,
                              String _csrf_token) {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(url);
        method.getParams().setContentCharset("utf-8");
        method.setRequestHeader("Accept",
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        method.setRequestHeader("Accept-Encoding", "gzip,deflate,sdch");
        method.setRequestHeader("Accept-Language", "zh-CN,zh;q=0.8");
        method.setRequestHeader("Accept-Charset", "GBK,utf-8;q=0.7,*;q=0.3");
        method.setRequestHeader("Host", "finance.aliyun.com");
        method.setRequestHeader("Origin", "http://finance.aliyun.com");
        method.setRequestHeader("Connection", "Keep-Alive");
        method.setRequestHeader(
                "Referer",
                "http://finance.aliyun.com/account/recharge.htm?spm=0.0.0.0.elRHXV_0.0.0.0.uWxMEt");
        method.setRequestHeader(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7");
        method.setRequestHeader(
                "Cookie",
                "JSESSIONID=UM5663B1-YORLH533CMAAD3D7NVG72-IDQ1HNPH-HA8; www_aliyun=5ugne0vg8ng4s69bgnbc8c1j23; login_aliyunid=admin@admin.com; login_aliyunid_ticket=qIZCr6t7SGxRigm2Cb4fGaCdBZWIzmgdHq6sXXZQg4KFWufyvpeV*0*Cm58slMT1tJw3_l$$TPk34m6UmF8qM3z_ar76cgYPs0P6UIMBujw6KvAsYKof_BNpwU_TOTNChZBoeM1KJexdfb9zhYnsN5so0; login_aliyunid_csrf=_csrf_tk_1815088030290190; hssid=1WRqTEJuUmJU3dixAG_C7qQ1; hsite=6; hsts=1388030291344; cfp0=5FwuPCGHOOv2eKqzpHY5awfZXDm8gZY9mmWXuXkMRMdFqGPmDjaZaUGN%2B8VacgamIUkNOXJVj2q8ZbfLiSga1Wn0H0Ewtw8elLKTPS4qgsKFAfS88fki2CU5U7c9Cg9hvg9Uup%2BHkY8uoegROllFuoVTuLXJBuysWEDQA1p%2FY%2BLPNa5XWKRQzESsQs6WvspH9859ZPLFhpzLTQ%2B%2FY%2B2j24QJKF4VqYSKmMpjWW3EDwd2hKsO1xhbDu78Aotv10GDS6Amw3BOrXB%2FUImAwXwx%2FGZVqDlf0DjWg8DXoOPg1pIv5iSw9QxPYLLTdFF%2FS3lgiCJWzQGShIGfKpFHS21xaNCX0sqhhy%2BXKBNrD4z5X%2FaoyFYvdESFE9GuopYC4CAGQmFZ5CNMNI7Kes4tNvgc%2Bg%3D%3D; _ga=GA1.2.1860272764.1387960845");
        method.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        // 设置请求参数
        method.addParameter("mobile", mobile);
        method.addParameter("sendStr", sendStr);
        method.addParameter("_csrf_token", _csrf_token);
        String responseStr = "";
        try {
            client.executeMethod(method);
            // responseStr = method.getResponseBodyAsString();
            InputStream resStream = method.getResponseBodyAsStream();
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    resStream));
            StringBuffer resBuffer = new StringBuffer();
            String resTemp = "";
            while ((resTemp = br.readLine()) != null) {
                resBuffer.append(resTemp);
            }
            responseStr = resBuffer.toString();
            method.releaseConnection();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return responseStr;
    }



}
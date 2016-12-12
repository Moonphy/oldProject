package com.qipeipu.crm.utils.javaMail;

/**
 * Created by laiyiyu on 2015/4/24.
 */
public class ButuluSmsClient {

    private volatile static ButuluSmsClient instance = null;

    private MailSenderInfo mailInfo;

    private ButuluSmsClient(){
        this.mailInfo = new MailSenderInfo();
        mailInfo.setMailServerHost("smtp.exmail.qq.com");
        mailInfo.setMailServerPort("25");
        mailInfo.setValidate(true);
        mailInfo.setProtocol("smtp");
        // 邮箱用户名
        mailInfo.setUserName("fengbin@qipeipu.com");
        // 邮箱密码
        mailInfo.setPassword("Btl258@");
        // 发件人邮箱
        mailInfo.setFromAddress("fengbin@qipeipu.com");
    }

    public static ButuluSmsClient getInstance(){
        if(instance==null){
            synchronized(ButuluSmsClient.class){
                if(instance == null){
                    instance = new ButuluSmsClient();
                }
            }
        }
        return instance;
    }

    public void sendHtmlMail(String to, String subject, String content){
        //SimpleMailSender sms = new SimpleMailSender();
        this.mailInfo.setSubject(subject);
        this.mailInfo.setContent(content);
        this.mailInfo.setToAddress(to);
        SimpleMailSender.sendHtmlMail(mailInfo);
    }

}

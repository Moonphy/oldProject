package com.qipeipu.crm.utils.javaMail;

/**
 * Created by laiyiyu on 2015/4/24.
 */
public class SendMailDemo {

    public static void main(String[] args) {
        // 设置邮件服务器信息
        MailSenderInfo mailInfo = new MailSenderInfo();
        mailInfo.setMailServerHost("smtp.163.com");
        mailInfo.setMailServerPort("25");
        mailInfo.setValidate(true);

        // 邮箱用户名
        mailInfo.setUserName("baturu2014@51baturu.com");
        // 邮箱密码
        mailInfo.setPassword("baturu2014@");
        // 发件人邮箱
        mailInfo.setFromAddress("baturu2014@51baturu.com");
        // 收件人邮箱
        mailInfo.setToAddress("laiyiyu@qipeipu.com");
        // 邮件标题
        mailInfo.setSubject("测试Java程序发送邮件");
        // 邮件内容
        StringBuffer buffer = new StringBuffer();
        buffer.append("JavaMail 1.4.5 jar包下载地址：http://www.oracle.com/technetwork/java/index-138643.html\n");
        buffer.append("JAF 1.1.1 jar包下载地址：http://www.oracle.com/technetwork/java/javase/downloads/index-135046.html");
        mailInfo.setContent(buffer.toString());

        // 发送邮件
        SimpleMailSender sms = new SimpleMailSender();
        // 发送文体格式
        sms.sendTextMail(mailInfo);
        // 发送html格式
        SimpleMailSender.sendHtmlMail(mailInfo);
        System.out.println("邮件发送完毕");
    }
}

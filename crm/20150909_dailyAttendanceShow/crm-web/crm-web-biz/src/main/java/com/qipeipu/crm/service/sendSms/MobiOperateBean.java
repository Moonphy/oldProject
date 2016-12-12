package com.qipeipu.crm.service.sendSms;

/**
 * Created by laiyiyu on 2015/5/29.
 */
public class MobiOperateBean extends Thread {

/*    private boolean be_send = false;
    private static char symbol = 10;
    private static char symbol1 = 13;
    private static SerialBean SB = null;

    //函数名：delete_sms(int SmsNo,int DelFlag)
    //参数说明
    //smsNo:需要删除的短消息序号
    //DelFlag:删除标记 0 为当前序号 1 所有读过的记录 2 所有读过和发送的记录
    //        3 所有读过和发送和未发送的记录 4 所有短消息
    public static boolean delete_sms(int SmsNo, int DelFlag) {
        String strReturn, strSend;
        strReturn = "";
        strSend = "";
        try {
            strSend = "AT+CMGD=" + String.valueOf(DelFlag) + String.valueOf(symbol) +
                    String.valueOf(symbol1);
            SB.WritePort(strSend);
            sleep(200);
            strReturn = SB.ReadPort(10);
            if (strReturn.indexOf("OK", 0) != -1) {
                return true;
            }
            return false;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }


    //函数名：opencomm(int commport)
    //参数说明
    //commport:需要打开的串口号
    //返回：
    //   false  打开串口失败
    //   true   打开串口成功
    public static boolean opencomm(int commport) {
        SB = new SerialBean(commport);
        if (SB.Initialize() == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    //函数名：testmobi
    //参数说明
    //
    //返回：
    //   false  测试失败
    //   true   测试成功
    public static boolean testmobi() {
        String strReturn, strSend;
        strReturn = "";
        strSend = "";
        strSend = "AT" + String.valueOf(symbol1);
        try {
            SB.WritePort(strSend);
            sleep(200);
            strReturn = SB.ReadPort(9);
            if (strReturn.indexOf("OK", 0) != -1) {
                strSend = "ATE0" + String.valueOf(symbol1);
                SB.WritePort(strSend);
                strReturn = "";
                sleep(200);
                strReturn = SB.ReadPort(11);
                if (strReturn.indexOf("OK", 0) != -1) {

                    return true;
                }
            }
            return false;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }

    }

    /*//************************************************************
//函数名：setmode(int mode)
//参数说明
//mode:短信发送模式
//返回说明:
//      false   设置模式失败
//      true    设置模式成功
//作者：周健
//时间：2006年4月14日
    private static boolean setmode(int mode) {
        String strReturn, strSend;

        strSend = "";
        try {
            strSend = "AT+CMGF=" + String.valueOf(mode) +
                    String.valueOf(symbol1);
            SB.WritePort(strSend);
            strReturn = "";
            sleep(200);
            strReturn = SB.ReadPort(6);
            if (strReturn.indexOf("OK", 0) != -1) {
                return true;
            }
            return false;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }

    }

    /*//************************************************************
//函数名：sendMessage
//参数说明
//   Receiver:短信接收者的手机号码
//   sms_content:短信内容
//返回：
//   false  发送失败
//   true   发送成功
//作者：周健
//时间：2006年4月14日
    public static boolean sendMessage(String Receiver, String sms_content) {
        String strReturn, strSend;
        char symbol2 = 34;
        char symbol3 = 26;
        strReturn = "";
        strSend = "";
        if (setmode(1) != true) {
            return false;
        }
        try {
            strSend = "AT+CSMP=1,173,36,08" + String.valueOf(symbol1);
            System.out.println("step 1 begin");
            SB.WritePort(strSend);
            sleep(400);
            strReturn = SB.ReadPort(6);
            if (strReturn.indexOf("OK", 0) != -1) {
                System.out.println("step 1 ok");
                strSend = "AT+CMGS=" + String.valueOf(symbol2) + Receiver +
                        String.valueOf(symbol2) +
                        String.valueOf(symbol1);
                System.out.println("step 2 begin");
                SB.WritePort(strSend);
                strReturn = "";
                sleep(200);
                strReturn = SB.ReadPort(4);
                System.out.println("step 3 begin");
                byte[] str1 = null;

                try {
                    str1 = sms_content.getBytes("GBK");
                }
                catch (java.io.UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                strSend = encodeHex(str1, sms_content) + String.valueOf(symbol3) +
                        String.valueOf(symbol1);
                strReturn = "";
                System.out.println("step 4 begin");
                SB.WritePort(strSend);
                sleep(2000);
                strReturn = "";
                strReturn = SB.ReadPort(8);
                if (strReturn.indexOf("+CMGS", 0) != -1) {
                    System.out.println("OK");
                    return true;
                }
            }
            return false;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }

    }

    /*//************************************************************
//函数名：getMessage
//参数说明
//   Way:短信接收者的手机号码
//   m_Mode:短信内容
//返回：
//   false  发送失败
//   true   发送成功
//作者：周健
//时间：2006年4月17日
    public static String getMessage(int Way, int m_Mode) {
        String strReturn, strSend;
        strReturn = "";
        strSend = "";
        String strtemp = null;
        if (m_Mode == 0) {
            switch (Way) {
                case 0:
                    strtemp = "REC UNREAD";
                    break;
                case 1:
                    strtemp = "REC READ";
                    break;
                case 2:
                    strtemp = "STO UNSENT";
                    break;
                case 3:
                    strtemp = "STO SENT";
                    break;
                case 4:
                    strtemp = "ALL";
                    break;
            }
        }
        else {
            switch (Way) {
                case 0:
                    strtemp = "REC UNREAD";
                    break;
                case 1:
                    strtemp = "REC READ";
                    break;
                case 2:
                    strtemp = "STO UNSENT";
                    break;
                case 3:
                    strtemp = "STO SENT";
                    break;
                case 4:
                    strtemp = "ALL";
                    break;
            }
        }
        try {
            strSend = "AT+CMGL=" + strtemp + String.valueOf(symbol1);
            SB.WritePort(strSend);
            strReturn = SB.ReadPort(256);
            if (strReturn.indexOf("OK", 0) != -1) {
                if (strReturn.indexOf("+CMGL", 0) != -1) {
                    int i = strReturn.indexOf(":");
                    strtemp = strReturn.substring(i, strReturn.length());
                    return strtemp;
                }
            }
            return null;
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }

    }

    public MobiOperateBean() {
    }

    /*//************************************************************
//函数名：encodeHex
//参数说明
//   bytes:短信内容BYTE值
//   sms_content:短信内容
//返回：
//   返回解码的PDU格式短信内容
//
//作者：周健
//时间：2006年4月17日
    private static final String encodeHex(byte[] bytes, String sms_content) {
        StringBuffer buff = new StringBuffer(bytes.length * 4);
        String b;
        char a;
        int n = 0;
        int m = 0;
        for (int i = 0; i < bytes.length; i++) {
            b = Integer.toHexString(bytes[i]);
            if (bytes[i] > 0) {
                buff.append("00");
                buff.append(b);
                n = n + 1;
            }
            else {
                a = sms_content.charAt( (i - n) / 2 + n);
                m = a;
                b = Integer.toHexString(m);
                buff.append(b.substring(0, 4));

                i = i + 1;
            }
        }
        return buff.toString();
    }

    public static void main(String[] args) {
        MobiOperateBean.opencomm(3);
        MobiOperateBean.testmobi();
        // String smscont = mobi_operate_bean.getMessage(1, 2);
        MobiOperateBean.sendMessage("15915865807",
                "嫁给我吧,我用石油给你冲厕所，用百事可乐给你洗澡，用波音777接你上下班。答应我吧？");
    }*/

}

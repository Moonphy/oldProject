package com.qipeipu.crm.dao.main.order;

public class OrderMainConst {
	/* 订单状态：0(保存)、1(已提交或发布)、2(已审核)、3(审核失败)、4(配货中)、5(取消订单)、6(交易成功)、7(交易失败（拒收等）) */
	public final static int STATUS_SAVE = 0;
	public final static int STATUS_PUBLISH = 1;
	public final static int STATUS_CHECK = 2;
	public final static int STATUS_UNCHECK = 3;
	public final static int STATUS_PICKING = 4;
	public final static int STATUS_CANCEL = 5;
	public final static int STATUS_SUCCUSS = 6;
	public final static int STATUS_FAILED = 7;
	public final static int STATUS_UNEFFECT = 10;

	// 0:未支付 ； 1：已支付
	public final static int PAY_NOT = 0;
	public final static int PAY_YES = 1;
	// 支付方式,其中1,2,5支付方式未使用
	public final static int PAYMODE_ONLINE = 1;
	public final static String PAYMODE_ONLINE_STRING = "个人账户在线支付";
	public final static int PAYMODE_ENTERPRISE = 2;
	public final static String PAYMODE_ENTERPRISE_STRING = "企业账户在线支付";
	public final static int PAYMODE_UNION = 3;
	public final static String PAYMODE_UNION_STRING = "银联在线支付";
	public final static int PAYMODE_ALIPAY = 4;
	public final static String PAYMODE_ALIPAY_STRING = "支付宝即时到账收款";
	public final static int PAYMODE_UNION_UPMP = 5;
	public final static String PAYMODE_UNION_UPMP_STRING = "银联手机支付";
	public final static int PAYMODE_ALIPAY_WAP = 6;
	public final static String PAYMODE_ALIPAY_WAP_STRING = "支付宝手机网页即时到账";
	public final static int PAYMODE_ALIPAY_BANK_PAY = 7;
	public final static String PAYMODE_ALIPAY_BANK_PAY_STRING = "支付宝网银支付";
	public final static int PAYMODE_UNIONB2b_BANK = 8;
	public final static String PAYMODE_UNIONB2b_BANK_STRING = "银联B2b支付";
	public final static int PAYMODE_OFFLINE_BANK = 9;
	public final static String PAYMODE_OFFLINE_STRING = "线下支付";
	public final static int PAYMODE_BALANCE_BANK = 10;
	public final static String PAYMODE_BALANCE_STRING = "余额支付";

	public final static int TYPE_DOING = 1;
	public final static int TYPE_OVER = 2;

}

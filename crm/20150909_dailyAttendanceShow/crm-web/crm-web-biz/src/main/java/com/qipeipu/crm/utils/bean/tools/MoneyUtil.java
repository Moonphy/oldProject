package com.qipeipu.crm.utils.bean.tools;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class MoneyUtil {
	// 默认乘除法运算精度
	public static final int DEF_DIV_SCALE = 2;
	public static final BigDecimal THOUSAND = new BigDecimal(1000);

	private MoneyUtil() {
	}

	/**
	 *
	 * 提供精确的加法运算。
	 *
	 * @param v1
	 *            被加数
	 * @param v2
	 *            加数
	 * @return 两个参数的和
	 */

	public static double add(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.add(b2).doubleValue();
	}

	/**
	 *
	 * 提供精确的加法运算。
	 *
	 * @param v1
	 *            被加数
	 * @param v2
	 *            加数
	 * @return 两个参数的和
	 */

	public static BigDecimal addByBigDecimal(BigDecimal b1, BigDecimal b2) {
		return b1.add(b2);
	}

	/**
	 *
	 * 提供精确的减法运算。
	 *
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @return 两个参数的差
	 */

	public static double sub(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.subtract(b2).doubleValue();
	}

	/**
	 *
	 * 提供四舍五入精确的减法运算。
	 *
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @param scale
	 *            保留小数位
	 *
	 * @return 两个参数的差
	 */

	public static double sub(double v1, double v2, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.subtract(b2).setScale(scale, RoundingMode.HALF_EVEN)
				.doubleValue();
	}

	/**
	 *
	 * 提供四舍五入精确的减法运算。
	 *
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @param scale
	 *            保留小数位
	 * @return 两个参数的差
	 */

	public static BigDecimal subBigDecimal(BigDecimal b1, BigDecimal b2,
			int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		return b1.subtract(b2).setScale(scale, RoundingMode.HALF_EVEN);
	}

	/**
	 *
	 * 提供精确的加法运算。
	 *
	 * @param v1
	 *            被加数
	 * @param v2
	 *            加数
	 * @return 两个参数的和
	 */

	public static BigDecimal addByBigDecimal(BigDecimal b1, BigDecimal b2,
			int scale) {
		return b1.add(b2).setScale(scale, RoundingMode.HALF_EVEN);
	}

	/**
	 *
	 * 提供四舍五入精确的减法运算。
	 *
	 * @param v1
	 *            被减数
	 * @param v2
	 *            减数
	 * @return 两个参数的差
	 */

	public static BigDecimal subBigDecimal(BigDecimal b1, BigDecimal b2) {
		return b1.subtract(b2);
	}

	/**
	 *
	 * 提供精确的乘法运算。
	 *
	 * @param v1
	 *            被乘数
	 * @param v2
	 *            乘数
	 * @return 两个参数的积
	 */

	public static double mul(double v1, double v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.multiply(b2).doubleValue();
	}

	public static String mulLongToStr(double v1, int v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(String.valueOf(v2));
		return String.valueOf(b1.multiply(b2).longValue());
	}

	/**
	 * 用于银联B2b支付:商户退款金额，单位为分，12位 长度，不足左补0
	 *
	 * @param v1
	 * @param v2
	 * @return
	 */
	public static String getB2bTransAmt(double v1, int v2) {
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(String.valueOf(v2));
		String value = String.valueOf(b1.multiply(b2).longValue());
		if (value.length() < 12) {
			StringBuffer sb = new StringBuffer();
			for (int i = value.length(); i < 12; i++) {
				sb.append("0");
			}
			sb.append(value);
			return sb.toString();
		}
		return value;
	}

	/**
	 *
	 * 提供返回四舍五入的精确的乘法运算。
	 *
	 * @param v1
	 *            被乘数
	 * @param v2
	 *            乘数
	 * @param scale
	 *            保留小数位
	 *
	 * @return 两个参数的积
	 */

	public static double mul(double v1, double v2, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.multiply(b2).setScale(scale, RoundingMode.HALF_EVEN)
				.doubleValue();
	}

	/**
	 *
	 * 提供返回四舍五入的精确的乘法运算。
	 *
	 * @param v1
	 *            被乘数
	 * @param v2
	 *            乘数
	 * @param scale
	 *            保留小数位
	 *
	 * @return 两个参数的积
	 */

	public static BigDecimal mulBigDecimal(BigDecimal b1, BigDecimal b2,
			int scale) {
		return b1.multiply(b2).setScale(scale, RoundingMode.HALF_EVEN);
	}

	/**
	 *
	 * 提供返回四舍五入的精确的乘法运算。
	 *
	 * @param v1
	 *            被乘数
	 * @param v2
	 *            乘数
	 * @return 两个参数的积
	 */

	public static BigDecimal mulBigDecimal(BigDecimal b1, BigDecimal b2) {
		return b1.multiply(b2);
	}

	/**
	 *
	 * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
	 *
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @return 两个参数的商
	 */

	public static double div(double v1, double v2) {
		return div(v1, v2, DEF_DIV_SCALE);
	}

	/**
	 *
	 * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
	 *
	 * 定精度，以后的数字四舍五入。
	 *
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @param scale
	 *            表示表示需要精确到小数点以后几位。
	 * @return 两个参数的商
	 */

	public static double div(double v1, double v2, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b1 = new BigDecimal(Double.toString(v1));
		BigDecimal b2 = new BigDecimal(Double.toString(v2));
		return b1.divide(b2, scale, RoundingMode.HALF_EVEN).doubleValue();

	}

	/**
	 *
	 * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
	 *
	 * 定精度，以后的数字四舍五入。
	 *
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @param scale
	 *            表示表示需要精确到小数点以后几位。
	 *
	 * @return 两个参数的商
	 */

	public static BigDecimal divBigDecimal(BigDecimal b1, BigDecimal b2) {
		return b1.divide(b2, RoundingMode.HALF_EVEN);
	}

	/**
	 *
	 * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
	 *
	 * 定精度，以后的数字四舍五入。
	 *
	 * @param v1
	 *            被除数
	 * @param v2
	 *            除数
	 * @param scale
	 *            表示表示需要精确到小数点以后几位。
	 *
	 * @return 两个参数的商
	 */

	public static BigDecimal divBigDecimal(BigDecimal b1, BigDecimal b2,
			int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		return b1.divide(b2, scale, RoundingMode.HALF_EVEN);
	}

	/**
	 *
	 * 提供精确的小数位四舍五入处理。
	 *
	 * @param v
	 *            需要四舍五入的数字
	 * @param scale
	 *            小数点后保留几位
	 *
	 * @return 四舍五入后的结果
	 */

	public static double round(double v, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException(
					"The scale must be a positive integer or zero");
		}
		BigDecimal b = new BigDecimal(Double.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, scale, RoundingMode.HALF_EVEN).doubleValue();

	}

	/**
	 *
	 * 提供默认精确的小数位四舍五入处理。
	 *
	 * @param v
	 *            需要四舍五入的数字
	 * @param scale
	 *            小数点后保留几位
	 *
	 * @return 四舍五入后的结果
	 */

	public static double round(double v) {
		BigDecimal b = new BigDecimal(Double.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, DEF_DIV_SCALE, RoundingMode.HALF_EVEN)
				.doubleValue();
	}

	/**
	 * 金额保留小数点后2位，四舍五入.是否返回负数
	 */
	public static double formatAmt(Double d, boolean isMin) {
		double value = 0.0;
		if (d != null) {
			if (isMin) {
				value = MoneyUtil.sub(0.0, d);
			} else {
				value = MoneyUtil.round(d);
			}
		}
		return value;
	}

	/**
	 * 金额保留小数点后2位，四舍五入.是否返回负数
	 */
	public static BigDecimal negativeBigDecimal(BigDecimal b) {
		return subBigDecimal(new BigDecimal(0), b);
	}

	/**
	 * 银联B2B: 长度为12个字节的数字串，例如：数字串"000000001234"表示12.34元 ，银联交易金额：100002，实际1000.02
	 *
	 * @param amount
	 * @return
	 */
	public static Double getTransAmtByReturn(String amount) {
		Double money = 0.0d;
		if (amount != null) {
			BigDecimal b = new BigDecimal(amount);
			money = MoneyUtil.div(b.doubleValue(), 100, 2);
		}
		return money;
	}

	/**
	 * 返回绝对值
	 */
	public static BigDecimal absBigDecimal(BigDecimal b) {
		return b.abs();
	}
}

package com.qipeipu.crm.utils.bean.tools;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.qipeipu.crm.dao.bean.RoleRecord;
import com.qipeipu.crm.dtos.global.ResultDTO;
import com.qipeipu.crm.dtos.global.ResultState;
import com.qipeipu.crm.dtos.user.UserDTO;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GUtils {

	private static final Logger logger = Logger.getLogger(GUtils.class);

	//static Gson gson = new Gson();
	static String sessionKey = "user";

	public static boolean isEmptyOrNull(String str) {
		return str == null || "".equals(str);
	}

	/***
	 * 从session中获取登录用户信息
	 *
	 * @param request
	 * @return
	 */
	public static UserDTO getSessionUserInfo(HttpServletRequest request) {
		return (UserDTO) request.getSession().getAttribute(sessionKey);
	}

	/***
	 * 设置用户登录信息到session
	 *
	 * @param request
	 * @param user
	 */
	public static void setSessionUserInfo(HttpServletRequest request,
			UserDTO user) {
		request.getSession().setAttribute(sessionKey, user);
	}

	/***
	 * 响应客户端json数据
	 *
	 * @param response
	 * @param dto
	 *            DTO
	 */
	public static void responseJson(HttpServletResponse response,
			ResultDTO<?> dto) {
		try {
			response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
			response.setHeader("Pragma", "no-cache"); // HTTP 1.0
			response.setDateHeader("Expires", 0); // prevents caching at the proxy server
			response.setCharacterEncoding("UTF-8");
			response.setContentType("text/html;charset=UTF-8");

			StringBuilder sb = new StringBuilder();
			/***
			 * 踩了一个坑！！！
			 * 默认的Gson是会进行html escape的，它会吧最后的”=“号转为\u003d的形式，
			 * 而我们如果用GsonBuilder，并且disableHtmlEscaping之后，让其创建一个Gson，
			 * 再用这个Gson转换时，结果就不会被html escape.
			 */
			GsonBuilder builder = new GsonBuilder();
			builder.disableHtmlEscaping();
			//Gson gson = builder.create();
			Gson gson = builder.serializeNulls().create();	//为什么要null?
			if (dto == null) {
				sb.append(gson.toJson(ResultDTO.failResult(
						ResultState.ERROR_CODE, "empty")));
			} else if (dto.getModel() != null) {
				Type objectType = type(ResultDTO.class, dto.getModel()
						.getClass());
				sb.append(gson.toJson(dto, objectType));
			} else {
				sb.append(gson.toJson(dto));
			}

			response.getWriter().write(sb.toString());
			response.flushBuffer();

			if (logger.isDebugEnabled()) {
				logger.debug(sb.toString());
			}
		} catch (IOException e) {
			logger.error("responseJson", e);
		}
	}

	//响应Ajax请求
	public static int responseAjaxWithJson(HttpServletResponse response,String result) {
		try {
			response.setHeader("Cache-Control", "no-cache"); // HTTP 1.1
			response.setHeader("Pragma", "no-cache"); // HTTP 1.0
			response.setDateHeader("Expires", 0); // prevents caching at the proxy server
			response.setCharacterEncoding("UTF-8");
			response.setContentType("text/html;charset=UTF-8");

			response.getWriter().write(result) ;
			response.flushBuffer() ;

			if (logger.isDebugEnabled()) logger.debug(result);
		} catch (IOException e) {
			logger.error("responseAjax", e);
		}

		return 0 ;
	}
	public static int responseAjaxWithResultDTO(HttpServletResponse response, ResultDTO<?> dto) {
		return responseAjaxWithJson(response , transformResultDTO2Json(dto)) ;
	}

	//json封装
	public static String transformObject2Json(Object o , Type genericTypeTree) {
		String res = "null" ;
		try {
			if (null == o) return res ;

			//构建Gson对象
			GsonBuilder builder = new GsonBuilder();
			builder.disableHtmlEscaping();
			//Gson gson = builder.create();
			Gson gson = builder.serializeNulls().create();	//为什么要null?

			StringBuilder sb = new StringBuilder();

			Type objectType = (null == genericTypeTree ? o.getClass() : genericTypeTree) ;
			sb.append(gson.toJson(o , objectType));

			res = sb.toString() ;
			if (logger.isDebugEnabled()) logger.debug(res);
		} catch (Exception e) {
			logger.error("transformResultDTO2Json", e);
		}

		return res ;
	}
	public static String transformResultDTO2Json(ResultDTO<?> dto) {
		if (null == dto) return "null" ;
		if (null == dto.getModel()) return transformObject2Json(dto , dto.getClass()) ;
		return transformObject2Json(dto , type(dto.getClass() , dto.getModel().getClass())) ;
	}



	/***
	 * 按要求格式化日期
	 *
	 * @param date
	 *            要格式化的日期
	 * @param ydm
	 *            格式 eg:yyyy-MM-dd HH:ss:mm
	 * @return 格式化之后的日期字符串
	 */
	public static String dateFormat(Date date, String ydm) {
		SimpleDateFormat fmt = new SimpleDateFormat(ydm);
		return fmt.format(date);
	}

	public static String dateFormat(Date date) {
		return dateFormat(date, "yyyy-MM-dd HH:mm:ss");
	}

	//类型树构造方法（用于gson解析泛型类）
	public static ParameterizedType type(final Class<?> raw, final Type... args) {
		return new ParameterizedType() {
			@Override
			public Type getRawType() {
				return raw;
			}

			@Override
			public Type[] getActualTypeArguments() {
				return args;
			}

			@Override
			public Type getOwnerType() {
				return null;
			}
		};
	}
}

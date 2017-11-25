package com.qipeipu.crm.dtos.global;

import java.io.Serializable;

import lombok.Data;
import lombok.experimental.Builder;

@Builder
@Data
public class ResultDTO<T> implements Serializable {
	private static final long serialVersionUID = -2356553442169897465L;
	/***
	 * 其他需要传递的DTO
	 */
	private T model;
	/***
	 * 错误状态
	 */
	private int errorCode;
	/***
	 * 错误消息
	 */
	private String msg;

	/***
	 * 处理状态
	 */
	private boolean success;

	@SuppressWarnings("unchecked")
	public static <T> ResultDTO<T> successResult(T model) {
		return (ResultDTO<T>) ResultDTO.builder().success(true).model(model)
				.build();
	}

	@SuppressWarnings("unchecked")
	public static <T> ResultDTO<T> successResult(String successMsg) {
		return (ResultDTO<T>) ResultDTO.builder().success(true).msg(successMsg)
				.build();
	}

	@SuppressWarnings("unchecked")
	public static <T> ResultDTO<T> successResult(T model, String successMsg) {
		return (ResultDTO<T>) ResultDTO.builder().success(true).model(model)
				.msg(successMsg).build();
	}

	@SuppressWarnings("unchecked")
	public static <T> ResultDTO<T> failResult(int errorCode, String errorMsg) {
		return (ResultDTO<T>) ResultDTO.builder().errorCode(errorCode)
				.msg(errorMsg).build();
	}

	@SuppressWarnings("unchecked")
	public static <T> ResultDTO<T> failResult(int errorCode, String errorMsg,
			T model) {
		return (ResultDTO<T>) ResultDTO.builder().errorCode(errorCode)
				.msg(errorMsg).model(model).build();
	}

	//新版写法(无unchecked)
	public static <T> ResultDTO<T> succeed(T model) { return new ResultDTO<>(model , 0 , null , true); }
	public static <T> ResultDTO<T> succeed(String successMsg) { return new ResultDTO<>(null , 0 , successMsg , true); }
	public static <T> ResultDTO<T> succeed(T model, String successMsg) { return new ResultDTO<>(model , 0 , successMsg , true); }

	public static <T> ResultDTO<T> failed(int errorCode, String errorMsg) { return new ResultDTO<>(null , errorCode , errorMsg , false); }
	public static <T> ResultDTO<T> failed(int errorCode, String errorMsg, T model) { return new ResultDTO<>(model , errorCode , errorMsg , false); }

	//builder的泛型写法实践
//	public static <T> ResultDTOBuilder2<T> builder2() { return new ResultDTOBuilder2<>() ; }
//
//	public static class ResultDTOBuilder2<T> {
//		private T model;
//		private int errorCode;
//		private String msg;
//		private boolean success;
//
//		ResultDTOBuilder2 () {}
//
//		public ResultDTOBuilder2<T> model(T model) { this.model = model; return this ; }
//		public ResultDTOBuilder2<T> errorCode(int errorCode) { this.errorCode = errorCode ; return this ;}
//		public ResultDTOBuilder2<T> msg(String msg) { this.msg = msg ; return this ;}
//		public ResultDTOBuilder2<T> success(boolean success) { this.success = success ; return this ;}
//
//		public ResultDTO<T> build() { return new ResultDTO<>(model , errorCode , msg , success) ; }
//	}
	//新版写法2(无unchecked)
//	public static <T> ResultDTO<T> suc(T model) {
//		ResultDTOBuilder2<T> tmp = ResultDTO.builder2();
//		return tmp.success(true).model(model).build();
//	}
//	public static <T> ResultDTO<T> suc(String successMsg) {
//		ResultDTOBuilder2<T> tmp = ResultDTO.builder2();
//		return tmp.success(true).msg(successMsg).build();
//	}
//	public static <T> ResultDTO<T> suc(T model , String successMsg) {
//		ResultDTOBuilder2<T> tmp = ResultDTO.builder2();
//		return tmp.success(true).msg(successMsg).model(model).build();
//	}
//	public static <T> ResultDTO<T> fai(int errorCode, String errorMsg) {
//		ResultDTOBuilder2<T> tmp = ResultDTO.builder2();
//		return tmp.success(false).errorCode(errorCode).msg(errorMsg).build();
//	}
//	public static <T> ResultDTO<T> fai(T model , int errorCode, String errorMsg) {
//		ResultDTOBuilder2<T> tmp = ResultDTO.builder2();
//		return tmp.success(false).errorCode(errorCode).msg(errorMsg).model(model).build();
//	}
}

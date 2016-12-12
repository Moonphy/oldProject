package com.qipeipu.crm.dtos.params;

import java.beans.ConstructorProperties;

import lombok.Data;
import lombok.experimental.Builder;

@Builder
@Data
public class ParamsDTO<B, S> {
	/***
	 * 基本参数
	 */
	private B base;
	/***
	 * 特殊参数
	 */
	private S special;

	@ConstructorProperties({ "base", "special" })
	public ParamsDTO(B base, S special) {
		this.base = base;
		this.special = special;
	}

	public ParamsDTO() {
	}

	//	public static <B, S> ParamsDTO<B, S> builder() {
	//		return new ParamsDTO<B, S>();
	//	}
	//
	//	public ParamsDTO<B, S> base(B base) {
	//		this.base = base;
	//		return this;
	//	}
	//
	//	public ParamsDTO<B, S> special(S special) {
	//		this.special = special;
	//		return this;
	//	}

}

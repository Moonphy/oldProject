package com.qipeipu.crm.dtos.global;

import java.beans.ConstructorProperties;
import java.io.Serializable;

import lombok.Data;

import com.qipeipu.crm.dtos.params.ParamsDTO;

/**
 * 分页基本查询参数模型 Created by johnkim on 15-2-6.
 */
@Data
public class VoModel<B, S> implements Serializable, Cloneable {
	private static final long serialVersionUID = 1992533183705625905L;
	/***
	 * 总页数
	 */
	private Integer total;
	/***
	 * 当前页码
	 */
	private Integer current = 0;
	/***
	 * 每页显示条数
	 */
	private Integer size = 10;

	/***
	 * 数据模型
	 */
	private Object model;

	/***
	 * 查询参数属性
	 */
	private ParamsDTO<B, S> params;

	@ConstructorProperties({ "model", "total", "size" })
	public VoModel(Object model, Integer total, Integer size) {
		this.total = total;
		this.model = model;
		this.size = size;
	}

	public VoModel() {
	}

	public static <B, S> VoModel<B, S> builder() {
		return new VoModel<B, S>();
	}

	public VoModel<B, S> setModel(Object model) {
		this.model = model;
		return this;
	}

	public VoModel<B, S> setSize(Integer size) {
		this.size = size;
		return this;
	}

	public VoModel<B, S> setCurrent(Integer current) {
		this.current = current;
		return this;
	}

	public VoModel<B, S> setTotal(Integer total) {
		this.total = total;
		return this;
	}

	/***
	 * 设置查询参数
	 *
	 * @param params
	 *            查询参数
	 * @return
	 */
	public VoModel<B, S> setParams(ParamsDTO<B, S> params) {
		this.params = params;
		return this;
	}

	/***
	 * 设置查询参数
	 *
	 * @param baseParams
	 *            基本查询参数
	 * @param specialParams
	 *            特殊查询参数
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public VoModel<B, S> setParams(B baseParams, S specialParams) {
		this.params = (ParamsDTO<B, S>) ParamsDTO.builder().base(baseParams)
				.special(specialParams).build();
		return this;
	}

	/***
	 * 设置基本查询参数
	 *
	 * @param baseParams
	 *            基本查询参数
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public VoModel<B, S> setBaseParams(B baseParams) {
		this.params = (ParamsDTO<B, S>) ParamsDTO.builder().base(baseParams)
				.build();
		return this;
	}

	/***
	 * 设置特殊查询参数
	 *
	 * @param specialParams
	 *            特殊查询参数
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public VoModel<B, S> setSpecialParams(S specialParams) {
		this.params = (ParamsDTO<B, S>) ParamsDTO.builder()
				.special(specialParams).build();
		return this;
	}

	@SuppressWarnings("unchecked")
	@Override
	public VoModel<B, S> clone() {
		VoModel<B, S> vo = null;
		try {
			vo = (VoModel<B, S>) super.clone();
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return vo;
	}
}

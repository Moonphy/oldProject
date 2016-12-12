package com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure;

/**
 * 分组模型，用于把厂商按分组模型进行统计
 * Created by laiyiyu on 2015/4/23.
 */

public abstract class GroupByModel<T> {
    /**
     *
     */
    private String modelType;

    private T model;

    public abstract void groupBy(T input);




}

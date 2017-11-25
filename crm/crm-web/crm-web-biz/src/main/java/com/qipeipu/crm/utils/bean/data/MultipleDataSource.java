package com.qipeipu.crm.utils.bean.data;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * 多数据源切换 Created by johnkim on 15-2-6.
 */
public class MultipleDataSource extends AbstractRoutingDataSource {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory
			.getLogger(MultipleDataSource.class);

	private static final ThreadLocal<String> dataSourceKey = new InheritableThreadLocal<String>();

	public static void setDataSourceKey(String dataSource) {
		logger.debug("{switch datasource:{}}", dataSource);
		dataSourceKey.set(dataSource);
	}

	@Override
	protected Object determineCurrentLookupKey() {
		return dataSourceKey.get();
	}

}

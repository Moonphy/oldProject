package com.qipeipu.crm.service.impl.basedata;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import com.qipeipu.crm.dtos.basedata.CityDTO;
import com.qipeipu.crm.service.basedata.CityService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-dataSource.xml",
"classpath:spring-service.xml" })
public class TestCityServiceImpl {

	@Autowired
	private CityService service;

	@Test
	public void test_findAllCity() {
		List<CityDTO> result = service.findAllCity();
		Assert.isTrue(!CollectionUtils.isEmpty(result));
	}
}

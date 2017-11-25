package com.qipeipu.crm.service.impl.user;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import com.qipeipu.crm.dtos.user.UserDTO;
import com.qipeipu.crm.service.user.UserService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-dataSource.xml",
"classpath:spring-service.xml" })
public class TestUserServiceImpl {

	@Autowired
	private UserService service;

	@Test
	public void test_findAllCity() {
		UserDTO result = service.findUserDtl(1);
		Assert.isTrue(result != null);
	}
}

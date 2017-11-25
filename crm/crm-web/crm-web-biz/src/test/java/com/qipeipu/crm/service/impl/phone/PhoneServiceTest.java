package com.qipeipu.crm.service.impl.phone;

import com.qipeipu.crm.dtos.global.VoModel;
import com.qipeipu.crm.dtos.statistics.tradeAnalyse.StatisticsOrderEntity;
import com.qipeipu.crm.dtos.visit.QueryConditionEntity;
import com.qipeipu.crm.service.SendMail.SendMailService;
import com.qipeipu.crm.service.customer.OrgService;
import com.qipeipu.crm.service.impl.statistics.StatisticsInquiryServiceImpl;
import com.qipeipu.crm.service.impl.statistics.StatisticsOrderServiceImpl;
import com.qipeipu.crm.service.impl.statistics.StatisticsReturnGoodsServiceImpl;
import com.qipeipu.crm.service.phone.PhoneService;
import com.qipeipu.crm.service.statistics.*;
import com.qipeipu.crm.service.task.TaskService;
import com.qipeipu.crm.service.user.AccountService;
import com.qipeipu.crm.service.user.UserService;
import com.qipeipu.crm.service.visitAll.WxAccidentCarRemainService;
import com.qipeipu.crm.service.visitAll.WxBillOfDocumentService;
import com.qipeipu.crm.service.visitAll.WxMessageDetailService;
import com.qipeipu.crm.service.wxCustomer.WxCustomerService;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by laiyiyu on 2015/3/23.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:spring-dataSource.xml","classpath:spring-dubbo-consumer" +
		".xml",
"classpath:spring-service.xml" })
public class PhoneServiceTest {


	@Autowired
	private UserService userService;

	@Autowired
	private WxBillOfDocumentService wxBillOfDocumentService;

	@Autowired
	WxAccidentCarRemainService wxAccidentCarRemainService;

	@Autowired
	PhoneService phoneService;

	@Autowired
	private TaskService taskService;

	@Autowired
	private WxMessageDetailService wxMessageDetailService;

	@Autowired
	private WxCustomerService wxCustomerService;

	@Autowired
	private StatisticsReturnGoodsServiceImpl statisticsReturnGoodsService;

	@Autowired
	private StatisticsOrderServiceImpl statisticsOrderService;

	@Autowired
	private StatisticsInquiryServiceImpl statisticsInqueryService;
	@Autowired
	private SendMailService sendMailService;

	@Autowired
	private AccountService accountService;

	@Autowired
	private StatisticsTradeService statisticsTradeService;

	@Autowired
	private StatisticsTradeGroupByCityService statisticsTradeGroupByCityService;

	@Autowired
	private StatisticsTradeGroupByTimeService statisticsTradeGroupByTimeService;

	@Autowired
	private StatisticsCrmAnalyseService statisticsCrmAnalyseService;

	@Autowired
	private StatisticsCrmAnalyseGroupByCityService statisticsCrmAnalyseGroupByCityService;

	@Autowired
	private OrgService orgService;

	@Test
	public void testOrder(){
		sendMailService.work();
	/*	String today = "2012-05-08";
		String end = "2015-05-09";
		DateRange dateRange = DateRange.builder().endDate(end).startDate(today).build();
		StatisticsTradeGroupByCityEntityComparable statisticsTradeGroupByCityEntityComparable = StatisticsTradeGroupByCityEntityComparable.builder().build();
		StatisticsCrmGroupByCityEntityComparable statisticsCrmGroupByCityEntityComparable = StatisticsCrmGroupByCityEntityComparable.builder().build();
		//Integer userID = 70;
		//StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder().userID(userID).build();

		VoModel<?, ?> vo = new VoModel<>();
		vo.setCurrent(0);
		TimeConditionEntity timeConditionEntity = TimeConditionEntity.builder().dateRange(dateRange).build();
		StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder()
				.areaConditionEntity(AreaConditionEntity.builder().build()).statisticsTradeGroupByCityEntityComparable(statisticsTradeGroupByCityEntityComparable).timeConditionEntity(timeConditionEntity).statisticsCrmGroupByCityEntityComparable(statisticsCrmGroupByCityEntityComparable).build();
		statisticsCrmAnalyseGroupByCityService.statisticsCrmGroupByCity(statisticsQuneryConditionEntity, vo);
*/
		//statisticsTradeGroupByCityService.statisticsOrderAndReturnForTradeAnalyse(statisticsQuneryConditionEntity, vo);

/*		VoModel<?, ?> vo = new VoModel<>();
		vo.setCurrent(0);
		String start = "2013-03-03";
		String end = "2015-05-05";
		DateRange dateRange = new DateRange(start, end);
		Integer mfctyID = 2073;
		statisticsTradeGroupByCityService.statisticsOrderBySpecifyMfcty(dateRange, mfctyID, vo);*/

		/*AreaConditionEntity areaConditionEntity = AreaConditionEntity.builder().build();
		areaConditionEntity.setCityID(440100);
		StatisticsQuneryConditionEntity statisticsQuneryConditionEntity = StatisticsQuneryConditionEntity.builder().areaConditionEntity(areaConditionEntity).build();
		statisticsTradeGroupByTimeService.statisticsOrderGroupByTime(2015, 3, "perDay", statisticsQuneryConditionEntity);
*/
        //sendMailService.work();

	/*	StatisticsCrmEntity input = StatisticsCrmEntity.builder().build();
		List<Integer> userIDs = Lists.newArrayList(1, 80, 90);
		statisticsCrmAnalyseService.statisticsCrmByAllMfcty(dateRange, userIDs, input);*/

	}

	@Test
	public void testOrg(){
		try {

		} catch (Exception e) {
			System.out.println(e.getMessage());
		}

	}

	@Test
	public void testGetAllPublicPhone() {
		System.out.println("msd");
		DateRange dateRange = new DateRange("2014-02-20 00:00:00", "2015-04-20 00:00:00");
		//dateRange.setThisMonthDate();
		StatisticsOrderEntity statisticsOrderEntity = new StatisticsOrderEntity();
		List<Integer> mfctyIDs = new ArrayList<>();
		mfctyIDs.add(2074);
		mfctyIDs.add(10054);
		mfctyIDs.add(2038);
		mfctyIDs.add(2034);
		mfctyIDs.add(10111);
		mfctyIDs.add(2045);
		mfctyIDs.add(90);
		mfctyIDs.add(71);
		mfctyIDs.add(51);
		mfctyIDs.add(2);

		List<Integer> mfctyIDsinquiry = new ArrayList<>();
		mfctyIDsinquiry.add(14992);
		mfctyIDsinquiry.add(14973);
		mfctyIDsinquiry.add(14990);
		mfctyIDsinquiry.add(14993);

		statisticsTradeService.statisticsTrade(dateRange, mfctyIDs);

		/*statisticsOrderService.statisticsOrderByAllMfcty(dateRange, mfctyIDs, statisticsOrderEntity);
		StatisticsInqueryEntity statisticsInqueryEntity = new StatisticsInqueryEntity();
		statisticsInqueryService.statisticsOrderByAllMfcty(dateRange, mfctyIDsinquiry, statisticsInqueryEntity);
		StatisticsReturnEntity statisticsReturnEntity = new StatisticsReturnEntity();
		statisticsReturnGoodsService.statisticsReturnGoodsByAllMfcty(dateRange, Lists.newArrayList(2045, 10106, 10121), statisticsReturnEntity);*/
	}

	@Test
	public void testOrderForWx(){

		VoModel<?, ?> vo = new VoModel<>();
		vo.setCurrent(0);
		Integer userID = 3;
		QueryConditionEntity queryConditionEntity = new QueryConditionEntity();
		queryConditionEntity.setCityID(130300);
		String queryTime = "2015-05-13";
		wxBillOfDocumentService.getOrderFormListByDemanderID(null, queryConditionEntity, vo, userID, queryTime);
		wxBillOfDocumentService.getOrderFormAndDetailByOrderMainID("50211");


	}





}

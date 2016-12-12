/**
 * 用户同步
 *
 * @author Gxy
 */
package com.qipeipu.crm.quartz;

import java.util.List;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Lists;
import com.qipeipu.crm.dao.CustomerDao;
import com.qipeipu.crm.dao.main.MorgDao;
import com.qipeipu.crm.dtos.customer.CustomerDTO;
import com.qipeipu.crm.utils.bean.data.MultipleDataSource;

@Slf4j
public class CustomerSyncJob {
	@Autowired
	private CustomerDao custDao;
	@Autowired
	private MorgDao orgDao;

	/**
	 * 工作同步模块
	 */
	public void work() {
		log.info("CustomerSync.work -------- start");

		doWork();

		log.info("CustomerSync.work -------- end");
	}

	private void doWork() {
		try {
			MultipleDataSource.setDataSourceKey("mainDataSource");
			List<CustomerDTO> oriUser = orgDao.getAllUser();
			if (CollectionUtils.isEmpty(oriUser)) {
				log.error("CustomerSync.work -------- find org empty");
				return;
			}

			MultipleDataSource.setDataSourceKey("dataSource");
			List<Integer> tgUserId = custDao.findAllMfctyId();

			//compare
			List<CustomerDTO> updateUser = null;
			List<CustomerDTO> insertUser = null;
			if (CollectionUtils.isEmpty(tgUserId)) {
				insertUser = oriUser;
			} else {
				updateUser = Lists.newArrayList();
				insertUser = Lists.newArrayList();
				for (CustomerDTO cust : oriUser) {
					boolean add = true;
					for (Integer mfctyId : tgUserId) {
						if (mfctyId.equals(cust.getMfctyId())) {
							add = false;
							updateUser.add(cust);
							break;
						}
					}
					if (add) {
						insertUser.add(cust);
					}
				}
			}

			//persistence
			int result = 0;
			if (!CollectionUtils.isEmpty(updateUser)) {
				for (CustomerDTO cust : updateUser) {
					result += custDao.updateSync(cust);
				}
			}
			log.info("CustomerSync.work -------- update record:" + result);

			result = 0;
			if (!CollectionUtils.isEmpty(insertUser)) {
				result = custDao.addSync(insertUser);
			}
			log.info("CustomerSync.work -------- insert record:" + result);
		} catch (Exception e) {
			log.error("CustomerSync.work error", e);
		}
	}
}
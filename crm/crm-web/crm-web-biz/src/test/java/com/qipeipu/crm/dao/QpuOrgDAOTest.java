package com.qipeipu.crm.dao;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by Administrator on 2015/5/20.
 */
public class QpuOrgDAOTest extends BaseDAOTest {

    @Autowired
    private QpuOrgDao qpuOrgDao;

    @Test
    public void testGetMfctyNameAndStatusByMfctyID(){
//        List<MfctyByIDAndStatusEntity> mfctyNameAndStatusByMfctyID = qpuOrgDao.getMfctyNameAndStatusByMfctyID("1");
        try {
            throw new RuntimeException("hehe");
        } catch (Exception e) {
            StackTraceElement[] stackTrace = e.getStackTrace();
            for (StackTraceElement stackTraceElement : stackTrace) {
                System.out.println(stackTraceElement);

            }
        }
    }
}

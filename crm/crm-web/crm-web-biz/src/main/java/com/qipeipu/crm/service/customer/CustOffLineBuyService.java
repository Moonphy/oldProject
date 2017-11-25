package com.qipeipu.crm.service.customer;

import com.qipeipu.crm.dtos.customer.CustOfflineBuyDTO;

import java.util.List;

/**
 * Created by johnkim on 15-2-11.
 */
public interface CustOffLineBuyService {
    /***
     * 更新/增加采购构成（线下）
     * @param dtos　采购构成
     * @param custId　客户ID
     * @return　是否更新成功
     */
    boolean update(CustOfflineBuyDTO[] dtos, Integer custId);

    /***
     * 查询某个客户的线下采购构成
     * @param custId
     * @return
     */
    List<CustOfflineBuyDTO> findByCustId(Integer custId);
}

package com.qipeipu.crm.service.SendMail.PaymentChanneQuery;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator on 2015/6/5.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PaymentChanneQueryEntity {

    private String PayModeName;

    private Double totalMoney;

    private Integer totalNum;

    private Double percent;

}

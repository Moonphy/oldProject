package com.qipeipu.crm.service.SendMail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator on 2015/4/23.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CountOrderForMailEntity {

    private String cityName;

    private Integer allNum;

    private Integer money;
}

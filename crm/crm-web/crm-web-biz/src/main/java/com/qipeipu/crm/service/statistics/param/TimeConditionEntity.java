package com.qipeipu.crm.service.statistics.param;

import com.qipeipu.crm.utils.statistics.DateRange;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by laiyiyu on 2015/4/16.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TimeConditionEntity {

    private boolean isToday = false;

    private boolean isThisWeek = false;

    private boolean isThisMon = false;

    private DateRange dateRange;
}

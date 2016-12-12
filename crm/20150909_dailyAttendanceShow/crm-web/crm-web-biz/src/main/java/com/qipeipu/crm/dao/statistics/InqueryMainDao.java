package com.qipeipu.crm.dao.statistics;

import com.qipeipu.crm.dtos.statistics.tradeAnalyse.storageStructure.StatisticsInqueryMainEntity;
import com.qipeipu.crm.provider.InqueryMainProvider;
import com.qipeipu.crm.utils.statistics.DateRange;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by laiyiyu on 2015/4/17.
 */
public interface InqueryMainDao {
    @Results(value = {
            @Result(column = "inquiryID", property = "inquiryID"),
            @Result(column = "inquiryNo", property = "inquiryNo"),
            @Result(column = "publishTime", property = "publishTime"),
            @Result(column = "status", property = "status"),
            @Result(column = "userId", property = "userID"),
            @Result(column = "carTypeId", property = "carTypeID")
    })
    @SelectProvider(type = InqueryMainProvider.class, method = "getInquirySheetListByUserIDs")
    public List<StatisticsInqueryMainEntity> getInquirySheetListByUserIDs(@Param("dateRange")DateRange dateRange, @Param("qpuUserIDs")List<String> qpuUserIDList);

    @SelectProvider(type = InqueryMainProvider.class, method = "getInquirySheetListCountByUserIDs")
    public Integer getInquirySheetListCountByUserIDs(@Param("dateRange")DateRange dateRange, @Param("qpuUserIDs")List<String> qpuUserIDList);

    @SelectProvider(type = InqueryMainProvider.class, method = "countInquiryNumByUserIDsAndTime")
    public int countInquiryNumByUserIDsAndTime(@Param("userIDs") List<String> userIDs, @Param("publishTime") String publishTime);
}

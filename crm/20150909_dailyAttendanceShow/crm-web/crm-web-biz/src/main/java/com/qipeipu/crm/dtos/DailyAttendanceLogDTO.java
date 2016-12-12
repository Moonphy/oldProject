package com.qipeipu.crm.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by Administrator:LiuJunyong on 2015/8/26.
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAttendanceLogDTO {
    //签到id
    private long checkInId = 0 ;
    //更新时间
    private String updateTime ;


    //签到时间
    private String checkInTime ;
    //签到人id
    private Long checkInPersonId ;
    //签到人名称
    private String checkInPersonName ;


    //签到位置
    private String checkInAddress ;
    //签到经度(东经0°~180°由0°~-180°表示,西经0°~180°由0°~180°表示)
    private String checkInLongitude ;
    //签到纬度(南纬0°~90°由0°~-90°表示,北纬0°~90°由0°~90°表示)
    private String checkInLatitude ;


    //修正位置
    private String amendAddress ;
    //修正经度(东经0°~180°由0°~-180°表示,西经0°~180°由0°~180°表示)
    private String amendLongitude ;
    //修正纬度(南纬0°~90°由0°~-90°表示,北纬0°~90°由0°~90°表示)
    private String amendLatitude ;


    //签到备注
    private String memo ;
}

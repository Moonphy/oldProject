package com.qipeipu.crm.dtos.basedata;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Builder;

/**
 * Created by johnkim on 15-2-11.
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@EqualsAndHashCode(of = "cityId")
public class CityDTO {
    /***
     * 城市ID
     */
    private Integer cityId;
    /***
     * 省份ID
     */
    private Integer provinceId;
    /***
     * 城市编码(区号)
     */
    private String cityCode;
    /***
     * 城市名称
     */
    private String cityName;
    /***
     * 城市编码(行政)
     */
    private String regionCityCode;
    /***
     * 首字母
     */
    private String shouzimu;
    /***
     * 拼音
     */
    private String pingying;

}

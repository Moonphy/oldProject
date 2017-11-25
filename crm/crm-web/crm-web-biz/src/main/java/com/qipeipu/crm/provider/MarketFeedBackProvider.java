package com.qipeipu.crm.provider;

import com.qipeipu.crm.dtos.global.VoModel;

import java.util.Map;

/**
 * Created by laiyiyu on 2015/4/13.
 */
public class MarketFeedBackProvider {

    public String getAllMarketFeedBackByuserID(Map<String, Object> map){
        Integer userId = (Integer) map.get("userID");
        VoModel<?, ?> vo = (VoModel<?, ?>) map.get("vo");
        StringBuilder sb = new StringBuilder(
                "select tmf.FeedBackId,tmf.userId,tmf.content,tmf.createTime,tp.PlatTypeName,tmf.PlatTypeId from t_market_feedback tmf LEFT JOIN t_plattype tp on tmf.PlatTypeId = tp.PlatTypeId where tmf.userid=");
        sb.append(userId).append(" ");
        sb.append(" ORDER BY tmf.createTime desc ");
        sb.append(" LIMIT ").append(vo.getCurrent() * vo.getSize()).append(",")
                .append(vo.getSize());
        return sb.toString();
    }

    public String getAllMarketFeedBackCountByuserID(Map<String, Object> map){
        Integer userId = (Integer) map.get("userID");
        StringBuilder sb = new StringBuilder(
                "select count(1) from t_market_feedback tmf LEFT JOIN t_plattype tp on tmf.PlatTypeId = tp.PlatTypeId where tmf.userid=");
        sb.append(userId).append(" ");
        sb.append(" ORDER BY tmf.createTime desc ");
        return sb.toString();
    }
}

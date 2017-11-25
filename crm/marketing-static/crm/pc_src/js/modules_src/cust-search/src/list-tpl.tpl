{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="9">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    {{#
        var statisticsTrade = model.statisticsTradeEntity;
        var statisticsOrderEntity = statisticsTrade.statisticsOrderEntity;
        var statisticsReturnEntity = statisticsTrade.statisticsReturnEntity;
    }}
    <tr class="data" data-area="{{model.cityID}}" data-areaname="{{model.cityName}}">
        <td>{{model.cityName}}</td>
        <td>{{statisticsOrderEntity.totalOrder}}</td>
        <td>{{statisticsOrderEntity.orderNum}}</td>
        <td>{{statisticsReturnEntity.totalChargeback}}</td>
        <td>{{statisticsReturnEntity.totalChargebackNum}}</td>
        <td>{{statisticsTrade.orderReturnRatio}}</td>
        <td>{{statisticsTrade.returnNumToOrderNumRatio}}</td>
        <td>{{statisticsOrderEntity.registerToFirstTradeDayAverage}}</td>
        <td>{{statisticsOrderEntity.sensitizeToFirstTradeDayAverage}}</td>
    </tr>
    {{# } }}
{{# } }}

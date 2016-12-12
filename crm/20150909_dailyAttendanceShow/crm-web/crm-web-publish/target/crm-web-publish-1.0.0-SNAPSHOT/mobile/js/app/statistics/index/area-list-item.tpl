{{if model && model.length>0}}
  {{each model}}
    <li class="item" data-href="area-detail.html?id={{$value.cityID}}">
        <span>{{$value.cityName}}</span>
        <span>{{$value.statisticsTradeEntity.statisticsOrderEntity.orderNum}}</span>
        <span class="rmb">{{$value.statisticsTradeEntity.statisticsOrderEntity.totalOrder}}</span>
    </li>
  {{/each}}
{{else}}
  <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}

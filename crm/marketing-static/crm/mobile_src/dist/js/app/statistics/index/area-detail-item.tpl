{{if model && model.length>0}}
  {{each model}}
    <li class="item">
        <span title="{{$value.mfctyName}}">{{$value._mfctyName}}</span>
        <span>{{$value.allOrderMoney}}</span>
        <span class="rmb">{{$value.orderAllNum}}</span>
    </li>
  {{/each}}
{{else}}
  <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}

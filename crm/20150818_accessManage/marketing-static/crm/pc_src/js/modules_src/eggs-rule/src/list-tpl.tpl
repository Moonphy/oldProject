{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="7">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{model.mfctyName}}</td>
        <td>{{model.cityName}}</td>
        <td>{{model.address}}</td>
        <td>{{model.auditTime}}</td>
        <td>{{model.loginAccount}}</td>
        <td>
        {{# if(model.ruleLevel==3){ }}
        中规则
        {{# }else if(model.ruleLevel==1){ }}
        高规则
        {{# }else if(model.ruleLevel==5){ }}
        低规则
        {{# }else if(model.ruleLevel==0){ }}
        不参与活动
        {{#} }}
        </td>
        <td><a href="eggsEdit.do?id={{model.orgID}}">设置子账户规则</a></td>
    </tr>
    {{# } }}
{{# } }}

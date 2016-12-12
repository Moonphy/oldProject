{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="5">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{model.mfctyName}}</td>
        <td>{{model.cityName}}</td>
        <td>{{model.address}}</td>
        <td>{{model.auditTime}}</td>
        <td><a class="link" href="factoryEdit.do?id={{model.orgID}}">编辑信息</a>|<a class="link" href="subAccount.do?id={{model.orgID}}">编辑账号</a></td>
    </tr>
    {{# } }}
{{# } }}

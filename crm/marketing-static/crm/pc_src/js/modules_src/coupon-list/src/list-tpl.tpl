{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="6">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{model.mfctyName}}</td>
        <td>{{model.cityName}}</td>
        <td>{{model.address}}</td>
        <td>{{model.totalCouponMoney}}</td>
        <td>{{model.usedCouponMoney}}</td>
        <td><a class="link" href="coupon-edit.do?id={{model.orgID}}">修改</a></td>
    </tr>
    {{# } }}
{{# } }}

{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="5">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr class="data" data-mfactyId="{{model.mfctyID}}" data-mfactyname="{{model.mfctyName}}">
        <td>{{model.mfctyName}}</td>
        <td>{{model.allOrderMoney}}</td>
        <td>{{model.orderAllNum}}</td>
        <td>{{model.returnGoodsMenoy}}</td>
        <td>{{model.returnGoodsNum}}</td>
    </tr>
    {{# } }}
{{# } }}

{{# if( !d.couponTotalEntityList || d.couponTotalEntityList.length<=0){ }}
<tr class="nodata">
    <td colspan="5">没有优惠券</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.couponTotalEntityList.length; i < len; i++){ }}
    {{# var model = d.couponTotalEntityList[i] }}
    <tr>
        <td data-money="{{model.money}}">&yen;{{model.money}}</td>
        <td class="money" style="display:none;">{{model.money}}</td>
        <td>{{model.couponNum}}</td>
        {{# if(model.unUsedNum<=0){ }}
        <td class="unUsedNum"><input class="unused" type="number" max="{{model.couponNum}}" min="0" data-old="{{model.unUsedNum}}" value="{{model.unUsedNum}}"/></td>
        <td>{{model.quota}}</td>
        <td>{{model.standardQuota}}</td>
        <td class="createTime"><input class="time start" value="{{model.createTime}}"/></td>
        <td class="expiryDate"><input class="time end" value="{{model.expiryDate}}"/></td>
        {{# }else{ }}
        <td class="unUsedNum"><input class="unused" class="unUsedNum" type="number" max="{{model.couponNum}}" min="0" value="{{model.unUsedNum}}"/></td>
        <td>{{model.quota}}</td>
        <td>{{model.standardQuota}}</td>
        <td class="createTime">{{model.createTime}}</td>
        <td class="expiryDate">{{model.expiryDate}}</td>
        {{# } }}
    </tr>
    {{# } }}
{{# } }}

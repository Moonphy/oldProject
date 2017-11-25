{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="9">此账户不存在子账号</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr data-id="{{model.userId}}">
        <td>{{model.userName}}</td>
        <td>{{model.userLoginName}}</td>
        <td>{{model.userLoginMobile}}</td>
        <td>{{model.userLoginEmail}}</td>
        <td>
          <select data-old="{{model.ruleLevel}}" class="ruleLevel">
            <option value="3" {{# if(model.ruleLevel==3){ }}selected="selected"{{#} }}>中规则</option>
            <option value="1" {{# if(model.ruleLevel==1){ }}selected="selected"{{#} }}>高规则</option>
            <option value="5" {{# if(model.ruleLevel==5){ }}selected="selected"{{#} }}>低规则</option>
            <option value="0" {{# if(model.ruleLevel==0){ }}selected="selected"{{#} }}>不参与活动</option>
          </select>
        </td>
        <td><input class="ratio" type="number" value="{{model.ratio}}" min="0" max="100"/></td>
        <td><input class="time start" value="{{model.startTime}}"/></td>
        <td><input class="time end" value="{{model.endTime}}"/></td>
        <td>
            <button class="btn savebtn">保存</button>
        </td>
    </tr>
    {{# } }}
{{# } }}

{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="5">没有账号信息</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{# if(model.isChild===1){ }}子账号{{# }else{ }}主账号{{# } }}</td>
        <td>
            <input type="text" class="J_no" name="loginMobile" value="{{model.loginMobile}}" placeholder="请输入手机账号"/>
        </td>
        <td>
            <input type="text" class="J_no" name="loginEmail" value="{{model.loginEmail}}" placeholder="请输入邮箱账号"/>
        </td>
        <td><input type="text" class="user" name="userName" value="{{model.userName}}" placeholder="请输入使用者名称"/></td>
        <td>
            <a href="#" class="reset" data-id="{{model.userID}}">重置密码</a>
            <input type="hidden" name="userID" value="{{model.userID}}"/>
            <input type="hidden" name="isChild" value="{{model.isChild}}"/>
        </td>
    </tr>
    {{# } }}
{{# } }}

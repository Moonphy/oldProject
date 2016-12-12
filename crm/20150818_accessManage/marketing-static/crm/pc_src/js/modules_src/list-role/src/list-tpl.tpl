{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="4">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{model.roleId}}</td>
        <td>{{model.roleCode}}</td>
        <td>{{model.roleName}}</td>
        <td>
            {{# if(model.state==0){ }}
            可用
            {{# }else{ }}
            不可用
            {{# } }}
        </td>
        <td>
            <a href="edit.do?id={{model.roleId}}">编辑</a>｜
            <a href="javascript:;" class="delbtn" data-id="{{model.roleId}}">删除</a>｜
            <a href="edit-menu.do?id={{model.roleId}}">分配菜单</a>
        </td>
    </tr>
    {{# } }}
{{# } }}
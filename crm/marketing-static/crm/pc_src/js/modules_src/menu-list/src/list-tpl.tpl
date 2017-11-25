{{# if(d.model.length<=0){ }}
<tr class="nodata">
    <td colspan="6">没有符合条件的数据</td>
</tr>
{{# }else{ }}
    {{# for(var i = 0, len = d.model.length; i < len; i++){ }}
    {{# var model = d.model[i] }}
    <tr>
        <td>{{model.resourceId}}</td>
        <td>{{model.resourceCode}}</td>
        <td>{{model.resourceName}}</td>
        <td>{{model.resourceURL}}</td>
        <td>
            {{# if(model.state==0){ }}
            可用
            {{# }else{ }}
            不可用
            {{# } }}
        </td>
        <td>
            <a href="edit.do?id={{model.resourceId}}">编辑</a>｜
            <a href="javascript:;" class="delbtn" data-id="{{model.resourceId}}">删除</a>
        </td>
    </tr>
    {{# } }}
{{# } }}
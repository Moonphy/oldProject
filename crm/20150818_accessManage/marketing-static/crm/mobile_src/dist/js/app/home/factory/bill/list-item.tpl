{{if model && model.length>0}}
    {{each model}}
    <tr id="{{$value.id}}">
			<td class="item">{{$value.shotMfctyName}}</td>
			<td class="item">{{$value.state}}</td>
			<td class="item">{{$value.value}}</td>
		</tr>
    {{/each}}
{{else}}
    <tr class="nodata" id="J_no_more_data"><td colspan="3">无更多数据</td></tr>
{{/if}}
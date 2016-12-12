{{if model && model.length>0}}
    {{each model}}
    <li class="item">
			<a href="../factory/index.html?id={{$value.custID}}&taskId={{$value.taskID}}&custID={{$value.custID}}&factory={{$value.mfctyName}}">
				<span class="time">{{$value.time}}</span>
		      		<span class="date">{{$value.date}}</span>
				<div class="name">{{$value._mfctyName}}</div>
					<div class="value">
					<i class="icon iconfont">&#xe630;</i>
				</div>
			</a>
		</li>
    {{/each}}
{{else}}
    <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}

{{if model && model.length>0}}
  {{each model}}
    <li class="item">
			<a href="../task/add.html?id={{$value.id}}&taskId={{$value.taskId}}&custID={{$value.custID}}&factory={{$value.factoryName}}">
				<div class="name">{{$value.mfctyName}}</div>
				<div class="value">
					<i class="icon iconfont">&#xe630;</i>
				</div>
			</a>
		</li>
    {{/each}}
{{else}}
    <li class="item nodata" id="J_no_more_data"><div class="btn radius"><a href="add.html">+新建</a></div></li>
{{/if}}


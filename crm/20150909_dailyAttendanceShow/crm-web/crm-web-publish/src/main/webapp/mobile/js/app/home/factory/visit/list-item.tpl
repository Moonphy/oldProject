{{if model && model.length>0}}
    {{each model}}
    <li class="item">
			<a href="detail.html?id={{$value.visitID}}">
				<i class="idx">{{$index+1}}</i>
				<span class="time">{{$value.enterTime}}</span>
				<i class="icon iconfont fn-right">&#xe630;</i>
			</a>
		</li>
    {{/each}}
{{else}}
    <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}


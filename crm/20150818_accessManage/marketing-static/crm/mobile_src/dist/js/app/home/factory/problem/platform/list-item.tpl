{{if model && model.length>0}}
  {{each model}}
    <li class="item">
	    <a href="detail.html?id={{$value.feedBackID}}">
		    <i class="icon iconfont zicon">{{$value.icon}}</i>
		    <span class="time">{{$value.createDate}}</span>
		    <i class="icon iconfont fn-right">&#xe630;</i>
		    <span class="desc fn-right">{{$value.content}}</span>
	    </a>
    </li>
    {{/each}}
{{else}}
    <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}


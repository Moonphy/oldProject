{{if model && model.length>0}}
	{{each model}}
		<li class="item" data-id="{{$value.taskID}}">
	  	<a href="detail.html?taskid={{$value.taskID}}">
		      <span class="time">{{$value.time}}</span>
		      <span class="date">{{$value.date}}</span>
		      <span class="text">
		      {{$value.taskName}}
		      </span>
		 	</a>
  	 	<div class="{{$value.state}}"></div>
  	</li>
	{{/each}}
{{else}}
	<li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}
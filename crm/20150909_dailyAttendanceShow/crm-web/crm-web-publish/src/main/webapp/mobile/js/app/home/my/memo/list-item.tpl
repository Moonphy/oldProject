{{if model && model.length>0}}
	{{each model}}
	<li class="item" data-id="{{$value.noteID}}">
	  <a href="detail.html?id={{$value.noteID}}" >
	    <div class="name">
	    <span class="time">{{$value.time}}</span>
	    <span class="date">{{$value.date}}</span>
	    </div>
	    <div class="memo fn-right" title="{{$value.content}}">{{$value.content}}</div>
	  </a>
	</li>
	{{/each}}
{{else}}
	<li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}
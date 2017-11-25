{{if model && model.length>0}}
	{{each model}}
	<li class="item" data-id="{{$value.contactID}}">
		<a href="detail.html?id={{$value.contactID}}&pub={{isPublic}}">
		<div class="name">{{$value.contactMan}}<span class="type">({{$value.contactTypeName}})</span></div>
		<div class="number fn-right">{{$value.phoneNo}}</div>
		</a>
	</li>
	{{/each}}
{{else}}
	<li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}
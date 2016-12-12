{{if model && model.length>0}}
    {{each model}}
    <li class="item" data-id="{{$value.feedBackID}}">
        <a href="detail.html?id={{$value.feedBackID}}">
            <div class="name">
                <span class="date">{{$value.createDate}}</span>
            </div>
            <div class="memo fn-right" title="{{$value.content}}">
                <span class="value">{{$value.content}}</span>
                <i class="icon iconfont fn-right">&#xe630;</i>
            </div>
        </a>
    </li>
    {{/each}}
{{else}}
    <li style="text-align:center;" id="J_no_more_data">无更多数据</li>
{{/if}}
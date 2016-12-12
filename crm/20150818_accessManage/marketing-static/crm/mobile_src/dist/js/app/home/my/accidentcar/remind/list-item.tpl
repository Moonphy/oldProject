{{if model && model.length>0}}
    {{each model}}
    <div class="car mb10" data-id="{{$value.accidentCarID}}">
        <div class="head">
            {{if $value.state}}
            <i class="remind-icon complete">&nbsp;</i>
            {{else}}
            <i class="remind-icon active">&nbsp;</i>
            {{/if}}
            <span class="name value">{{$value.mfctyName}}</span>
        </div>
        <div class="body">
            <table>
                <thead>
                <tr>
                    <th>事故车型</th>
                    <th>数量</th>
                </tr>
                </thead>
                <tbody class="value">
                    <tr>
                        <td>{{$value.carType}}</td>
                        <td>X{{$value.num}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="foot fn-clear">
            <div class="label fn-left">预采购时间</div>
            <div class="datetime value fn-right">{{$value.preBuyTime}}</div>
        </div>
    </div>
    {{/each}}
{{else}}
    <div class="nodata">无数据</div>
{{/if}}
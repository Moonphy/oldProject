var crmmap;

var common = require('common');
var $ = common.jquery;
var layer = $.layer;
var moment = require('moment');
var loadcity = require('loadcity');
var pagination = require('pagination');
var laydate = require('laydate');

function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
            openInfo(content,e)}
    );
}
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}
function isEmpty(val){
    if(val==undefined||val==null||val==''){
        return true;
    }
    return false;
}
// 编写自定义函数,创建标注
function addMarker(map,point,orgName,address,tel,isopen){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    openDialog(map,marker,point,orgName,address,tel,isopen);
    //marker.setLabel(label);
}

function parse(map,id,address,cityName,orgName,tel,isopen){
    var myGeo = new BMap.Geocoder();

    myGeo.getPoint(address, function(point){
        if (point) {
            var point1 = new BMap.Point(point.lng, point.lat);
            index.lastPoint = point1;
            addMarker(map,point1,orgName,address,tel,isopen);
            savepoint(id,point1);
        }else{
            myGeo.getPoint(orgName, function(point){
                if (point) {
                    var point1 = new BMap.Point(point.lng, point.lat);
                    index.lastPoint = point1;
                    addMarker(map,point1,orgName,address,tel,isopen);
                    savepoint(id,point1);
                }else{
                    if(isopen){
                        openFailDialog(map,index.lastPoint,orgName,address);
                    }
                }
            });
        }
    }, cityName);
}

function openMap(map,id,lng,lat,address,cityName,orgName,tel,isopen){
    if(isEmpty(lng)||isEmpty(lat)){
        parse(map,id,address,cityName,orgName,tel,isopen);
    }else{
        var point = new BMap.Point(lng, lat);
        addMarker(map,point,orgName,address,tel,isopen);
        index.map.centerAndZoom(point, 13);
        savepoint(id,point);
    }
}

function openFailDialog(map,point,orgName,address){
    // 百度地图API功能
    var sContent ="抱歉，没有未找到相关地点。<br/>" +
        "签到地址:"+address+"<br/>";//　<a href=''>修改</a>
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象

    map.centerAndZoom(point, 13);
    map.enableScrollWheelZoom();     //开启鼠标滚轮缩放
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}

function openDialog(map,marker,point,orgName,address,tel,isopen){
    // 百度地图API功能
    var sContent = "签到地址:"+address;
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象

    if(isopen){
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }
    marker.addEventListener("click", function(){
        this.openInfoWindow(infoWindow);
    });

}

function savepoint(id,point){
    index.lastPoint = point;
    if(index.agent.agentId==id){
        index.agentPoint= point;
    }else{
        var lng=$("#"+id).attr("lng",point.lng);
        var lat=$("#"+id).attr("lat",point.lat);
    }
}

/* 	var data_info = [[116.417854,39.921988,"地址：北京市东城区王府井大街88号乐天银泰百货八层"],
 [116.406605,39.921585,"地址：北京市东城区东华门大街"],
 [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
 ];
 var opts = {
 width : 250,     // 信息窗口宽度
 height: 80,     // 信息窗口高度
 title : "信息窗口" , // 信息窗口标题
 enableMessage:true//设置允许信息窗发送短息
 };
 for(var i=0;i<data_info.length;i++){
 var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
 var content = data_info[i][2];
 map.addOverlay(marker);               // 将标注添加到地图中
 addClickHandler(content,marker);
 } */


var index= {
    lastPoint : null,
    agentPoint:null,
    map:new BMap.Map("allmap"),

    agent:{
        cityName : "",
        lng : null,
        lat : null,
        address : '',
        orgName :'',
        tel:'',
        agentId:null
    },
    init: function(){
        loadList();
        //this.init_map();
        //var agent=index.agent;
        var Stus = "[{name:'曹操',phone:'15169145378',classes:'计算机',x:'117.00',y:'36.40',jdx:'117.0',jdy:'36.0',deltaT:' '},{name:'刘备',phone:'15169145378',classes:'计算机',x:'117.00',y:'36.40',jdx:'117.0',jdy:'36.0',deltaT:''},{name:'关羽',phone:'15169145378',classes:'计算机',x:'117.00',y:'36.40',jdx:'117.0',jdy:'36.0',deltaT:''},{name:'诸葛亮',phone:'15169145378',classes:'计算机',x:'117.00',y:'36.40',jdx:'117.0',jdy:'36.0',deltaT:'120000'},{name:'周瑜',phone:'15169145378',classes:'计算机',x:'117.00',y:'36.40',jdx:'117.0',jdy:'36.0',deltaT:'120000'},{name:'李三',phone:'15169145378',classes:'计算机',x:'119.00',y:'36.40',jdx:'119.0',jdy:'36.0',deltaT:''},{name:'李四',phone:'15169145378',classes:'计算机',x:'116.404',y:'39.915',jdx:'116.4045',jdy:'39.915',deltaT:'25'},{name:'王五',phone:'15169145378',classes:'计算机',x:'122.12',y:'30.40',jdx:'122.22',jdy:'30.40',deltaT:'23'},{name:'赵六',phone:'15169145378',classes:'计算机',x:'118.03',y:'36.48',jdx:'118.03',jdy:'36.48',deltaT:'15'},{name:'田七',phone:'15169145378',classes:'计算机2',x:'108.56',y:'39.45',jdx:'108.56',jdy:'36.0',deltaT:'26'},{name:'ddf',phone:'15169145378',classes:'计算机2',x:'118.56',y:'29.45',jdx:'108.56',jdy:'36.0',deltaT:'22'},{name:'mark',phone:'15169145378',classes:'计算机',x:'102.404',y:'40.915',jdx:'102.404',jdy:'40.915',deltaT:'12'}] ";
        //模拟获取到右下角坐标点(后台运算)
        var Xmax = 122.12;
        var Ymax = 39.915;
        //模拟获取到左上角坐标点
        var Xmin = 102.404;
        var Ymin = 30.40;

        // 百度地图API功能
        var map = new BMap.Map("allmap", 15);
        var point = new BMap.Point((Xmax + Xmin) / 2, (Ymin + Ymax) / 2);  //求出显示地图范围的中点
        map.enableScrollWheelZoom();  //启用滚轮放大缩小，默认禁用
        map.addControl(new BMap.NavigationControl()); //添加比例尺控件
        map.centerAndZoom(point, 6); //控制地图初始显示的范围大小


        var Stu = eval(Stus);
        for (var i = 0; i < Stu.length; i++) {  //for ( var i=Stu.length-1; i>=0; --i ){}
            var x = Stu[i].x;
            var y = Stu[i].y;
            var Name = Stu[i].name;
            var Classes = Stu[i].classes;
            var Phone = Stu[i].phone;
            var deltaT = Stu[i].deltaT;
            var jdx = Stu[i].jdx;
            var jdy = Stu[i].jdy;
            //学生所在位置
            pointA = new BMap.Point(x, y);
            //公司所在位置
            pointB = new BMap.Point(jdx, jdy);

            //判断是否签到过(否)
            if (deltaT > 20000) {
                //侧面显示详细信息
                $("#qiandao").after("<p>&nbsp;<img src='zl.jpg'/></p>"+"&nbsp;姓名:" + Name + "<br/>&nbsp;班级:" + Classes + "<br/>&nbsp;联系电话:" + Phone + "<br/><br/>");

            } else {
                if (deltaT > 24) {//判断是否是今天签到（否）
                    addMarker(pointA, 11, Name, Classes, Phone);//灰色图标标注最后签到的日期
                } else {

                    var dist = map.getDistance(pointA, pointB).toFixed(2); //获取实际位置与公司位置之间的距离
                    if (dist < 1000) {                          //判断是否在规定的范围内（是）
                        addMarker(pointA, 12, Name, Classes, Phone); //正常签到，绿色标注
                    } else {
                        //异常签到，红色跳动标注
                        var marker = new BMap.Marker(pointA);
                        //为marker添加新属性
                        marker.Name = Name;
                        marker.Classes = Classes;
                        marker.Phone = Phone;
                        // 将标注添加到地图中
                        map.addOverlay(marker);
                        //跳动的动画
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                        //设置监听
                        marker.addEventListener("click", showInfo);
                    }
                }
            }

        }
        function showInfo() {
            var opts = {
                width : 250, // 信息窗口宽度
                height : 100, // 信息窗口高度
                title : "" // 信息窗口标题
            }
            // 创建信息窗口对象
            var infoWindow = new BMap.InfoWindow("姓名：" + this.Name + "</br> 班级：" + this.Classes + "</br> 联系电话：" + this.Phone, opts);
            // 打开信息窗口
            this.openInfoWindow(infoWindow);

        }

        function addMarker(point, index, name, classes, phone) {
            // 创建图标对象
            var myIcon = new BMap.Icon("markers.png", new BMap.Size(23, 25), {

                offset : new BMap.Size(10, 25),
                imageOffset : new BMap.Size(0, 0 - index * 25) // 设置图片偏移
            });
            // 创建标注对象并添加到地图
            var marker = new BMap.Marker(point, {
                icon : myIcon
            });
            //将标注添加到地图上
            map.addOverlay(marker);
            //添加监听事件
            marker.addEventListener("click", showInfo);
            //给marker赋新属性
            marker.Name = name;
            marker.Classes = classes;
            marker.Phone = phone;
        }
        /*$('#menu li a[id]').on('click',function(){
            var id=$(this).attr("id");
            var tel=$(this).attr("tel");
            var lng=$(this).attr("lng");
            var lat=$(this).attr("lat");
            var orgName=$(this).attr("orgName");
            var address=$(this).attr("address");
            openMap(index.map,id,lng,lat,address,agent.cityName,orgName,tel,true);

            index.map.centerAndZoom(index.lastPoint, 13);
            index.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        });*/
    }
    /*init_map :function(){
        var agent=index.Map;
        Map.cityName=$("#cityName").val();
        agent.lng=$("#lng").val();
        agent.lat=$("#lat").val();
        agent.address = $("#address").val();
        agent.orgName= $("#orgName").val();
        agent.tel= $("#tel").val();
        agent.agentId= $("#agentId").val();
        index.lastPoint= new BMap.Point(116.403694,39.927552);

        openMap(index.map,agent.agentId,agent.lng,agent.lat,agent.address,agent.cityName,agent.orgName,agent.tel,true);

        $('#menu li a[id]').each(function(){
            var id=$(this).attr("id");
            var tel=$(this).attr("tel");
            var lng=$(this).attr("lng");
            var lat=$(this).attr("lat");
            var orgName=$(this).attr("orgName");
            var address=$(this).attr("address");
            openMap(index.map,id,lng,lat,address,agent.cityName,orgName,tel,false);
        });
        if(index.lastPoint){
            index.map.centerAndZoom(index.lastPoint, 13);
        }
        index.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        //alert(1);
        var interval = setInterval(function(){
            var logos = $('a[href^="http://map.baidu.com"]');
            var copy = $('.BMap_cpyCtrl');
            if(logos.length>0 && copy.length>0){
                logos.remove();
                copy.remove();
                clearInterval(interval);
            }
        });
        index.map.addEventListener("zoomend", function(){
        //  alert("地图缩放至：" + this.getZoom() + "级");
        // });

    }*/
};
function loadList(){
    var keys = ['updateTime', 'checkInPersonName', 'checkInTime', 'checkInAddress','todayCheckInCount'];
    $.ajax({
        url: '/dailyAttendance/find/selfCheckInList',
        callback:function(mode){
            var checklist = $('#checklist');
            var checkInPersonName = checklist.find('.checkInPersonName');
            var updateTime = checklist.find('.updateTime');
            var todayCheckInCount = checklist.find('.todayCheckInCount');
            var checkInAddress = checklist.find('.checkInAddress');

            $(checkInPersonName).text(mode[keys[2]]);
            $.each(updateTime, function(idx, updateTime) {
                $(updateTime).text(mode[keys[idx]]);
            });
            $.each(todayCheckInCount, function(idx, todayCheckInCount) {
                $(todayCheckInCount).text(mode[keys[idx]]);
            });
            $.each(checkInAddress, function(idx, checkInAddress) {
                $(checkInAddress).text(mode[keys[idx]]);
            });
        }
    });
}
index.init();

module.exports = crmmap;

var gad_checktime = function(startTime,endTime){
	var show = false;//判断是否过期
	
	//格式化时间字符串输出时间对象函数
	function format_time(str){
		st = {};//时间对象
		newstr = str.split(" ");
		var date = newstr[0].split("-");
		st.year = date[0];
		st.month = date[1]-1;
		st.day = date[2];
		var time = newstr[1].split(":");
		st.hour = time[0];
		st.minute = time[1];
		st.second = time[2];
		var st_obj = new Date(st.year,st.month,st.day,st.hour,st.minute,st.second);
		return st_obj;
	}
	
	if(startTime) newstartTime = format_time(startTime);
	if(endTime) newendTime = format_time(endTime);
	var nowTime = new Date();
	
	//判断设置时间是否过期
	if( (startTime && endTime) && (newstartTime.getTime() - nowTime.getTime())<=0 && (newendTime.getTime() - nowTime.getTime())>=0){
		show = true;
	};
        //如果未设置结束时间 设置了开始时间 则只判断开始时间
        if(!endTime && startTime){
        	if((newstartTime.getTime() - nowTime.getTime())<=0){
        		show = true;
        	};
        }
        //如果未设置开始时间 设置了结束时间 则只判断结束时间
        if(!startTime && endTime){
        	if((newendTime.getTime() - nowTime.getTime())>=0){
        		show = true;
        	};
        }

    return show;
}


var callad = function(adp,noHtml){
	var  endHtml = "";
	if(noHtml){
		var v = noHtml.match(/^<([a-zA-Z]+)/);
		if(v && v.length){
			endHtml = "</"+v[1]+">";
		}
	}else{
		noHtml = "";
	}
    switch (adp){
            //mschool
            case 'index_indextop2':
                if(gad_checktime('2012-07-03 09:26:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=97\"  target=\"_blank\"><img width=\"237\" height=\"74\" title=\"广州中考学校库\" border=\"0\" alt=\"广州中考学校库\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310350512.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //mschool
            case 'indextop2':
                if(gad_checktime('2012-07-03 09:26:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=97\"  target=\"_blank\"><img width=\"237\" height=\"74\" title=\"广州中考学校库\" border=\"0\" alt=\"广州中考学校库\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310350512.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //2013广州幼升小全年时间表
            case 'index_indextop3':
                if(gad_checktime('2012-04-25 00:01:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=45\"  target=\"_blank\"><img width=\"237\" height=\"74\" title=\"2013广州幼升小全年时间表\" border=\"0\" alt=\"2013广州幼升小全年时间表\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310362346.gif\"><\/a>" + endHtml);
                }
            break;
     
            //2013广州幼升小全年时间表
            case 'indextop3':
                if(gad_checktime('2012-04-25 00:01:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=45\"  target=\"_blank\"><img width=\"237\" height=\"74\" title=\"2013广州幼升小全年时间表\" border=\"0\" alt=\"2013广州幼升小全年时间表\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310362346.gif\"><\/a>" + endHtml);
                }
            break;
     
            //mschool
            case 'index_indexright2':
                if(gad_checktime('2012-07-03 09:34:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=98\"  target=\"_blank\"><img width=\"220\" height=\"80\" title=\"广州中学库\" border=\"0\" alt=\"广州中学库\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310385757.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //mschool
            case 'indexright2':
                if(gad_checktime('2012-07-03 09:34:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=98\"  target=\"_blank\"><img width=\"220\" height=\"80\" title=\"广州中学库\" border=\"0\" alt=\"广州中学库\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310385757.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //2012年全国各省市分数线及志愿填报指南
            case 'index_indexright1':
                if(gad_checktime('2012-09-07 15:38:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=109\"  target=\"_blank\"><img width=\"220\" height=\"80\" title=\"2012年全国各省市分数线及志愿填报指南\" border=\"0\" alt=\"2012年全国各省市分数线及志愿填报指南\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310375950.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //2012年全国各省市分数线及志愿填报指南
            case 'indexright1':
                if(gad_checktime('2012-09-07 15:38:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=109\"  target=\"_blank\"><img width=\"220\" height=\"80\" title=\"2012年全国各省市分数线及志愿填报指南\" border=\"0\" alt=\"2012年全国各省市分数线及志愿填报指南\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310375950.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //首页视窗
            case 'index_videoad':
                if(gad_checktime('2012-11-16 11:11:00', '')){
                    document.write(noHtml + "" + endHtml);
                }
            break;
     
            //首页视窗
            case 'videoad':
                if(gad_checktime('2012-11-16 11:11:00', '')){
                    document.write(noHtml + "" + endHtml);
                }
            break;
     
            //首页文字链
            case 'index_index_txtad_top':
                if(gad_checktime('2012-11-16 11:48:00', '')){
                    document.write(noHtml + "<ul class=\"con\"><li><a href=\"http:\/\/gz.zy.com\/zhuanti\/gd1v1-1106\/index.html\">提分数助力冲名校<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-378375-1-1.html\">高中英语mp3下载<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-293719-1-1.html\">高考备忘录月历表<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-273792-1-1.html\">怎样做好高三家长<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-85482-1-1.html\">高中知识点大汇总<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-320063-1-1.html\">2013中考时间表<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-374155-1-1.html\">七中期中考试题集<\/a><\/li><\/ul><ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-340699-1-1.html\">中考体育考试内容<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-95195-1-1.html\">广州市小学赞助费<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-309014-1-1.html\">幼升小面试的试题<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-19645-1-1.html\">小升初真题大汇总<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-351143-1-1.html\">小升初备考指南<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-340699-1-1.html\">广州小升初资料库<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/forum-45-1.html\">广州小升初新政策<\/a><\/li><\/ul>" + endHtml);
                }
            break;
     
            //首页文字链
            case 'index_txtad_top':
                if(gad_checktime('2012-11-16 11:48:00', '')){
                    document.write(noHtml + "<ul class=\"con\"><li><a href=\"http:\/\/gz.zy.com\/zhuanti\/gd1v1-1106\/index.html\">提分数助力冲名校<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-378375-1-1.html\">高中英语mp3下载<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-293719-1-1.html\">高考备忘录月历表<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-273792-1-1.html\">怎样做好高三家长<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-85482-1-1.html\">高中知识点大汇总<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-320063-1-1.html\">2013中考时间表<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-374155-1-1.html\">七中期中考试题集<\/a><\/li><\/ul><ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-340699-1-1.html\">中考体育考试内容<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-95195-1-1.html\">广州市小学赞助费<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-309014-1-1.html\">幼升小面试的试题<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-19645-1-1.html\">小升初真题大汇总<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-351143-1-1.html\">小升初备考指南<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-340699-1-1.html\">广州小升初资料库<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/forum-45-1.html\">广州小升初新政策<\/a><\/li><\/ul>" + endHtml);
                }
            break;
     
            //首页文字链
            case 'index_index_txtad_bottom':
                if(gad_checktime('2012-11-16 11:53:00', '')){
                    document.write(noHtml + "<ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-59240-1-1.html\">怎样惩罚犯错孩子<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-33900-1-1.html\">女儿早恋了怎么办<\/a><\/li><li><a href=\"http:\/\/gz.zy.com\/zhuanti\/gzfd6162\/\">免费学科专题讲座<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-375529-1-1.html\">如何与小学生谈性<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-378204-1-1.html\">中考英语语法复习<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-373634-1-1.html\">初三语文阅读题集<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-370504-1-1.html\">Twitter最火单词<\/a><\/li><\/ul><ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-373957-1-1.html\">学生最牛梦想作文<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-337751-1-3.html\">中考语文分类详解<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-374249-1-1.html\">另类学习励志标语<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-98050-1-1.html\">中考各科易错题集<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-284972-1-1.html\">深圳各中学升学率<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-222034-1-1.html\">深圳中考考试大纲<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-273817-1-1.html\">英语词根记忆大全<\/a><\/li><\/ul>" + endHtml);
                }
            break;
     
            //首页文字链
            case 'index_txtad_bottom':
                if(gad_checktime('2012-11-16 11:53:00', '')){
                    document.write(noHtml + "<ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-59240-1-1.html\">怎样惩罚犯错孩子<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-33900-1-1.html\">女儿早恋了怎么办<\/a><\/li><li><a href=\"http:\/\/gz.zy.com\/zhuanti\/gzfd6162\/\">免费学科专题讲座<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-375529-1-1.html\">如何与小学生谈性<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-378204-1-1.html\">中考英语语法复习<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-373634-1-1.html\">初三语文阅读题集<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-370504-1-1.html\">Twitter最火单词<\/a><\/li><\/ul><ul class=\"con\"><li><a href=\"http:\/\/bbs.gaofen.com\/thread-373957-1-1.html\">学生最牛梦想作文<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-337751-1-3.html\">中考语文分类详解<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-374249-1-1.html\">另类学习励志标语<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-98050-1-1.html\">中考各科易错题集<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-284972-1-1.html\">深圳各中学升学率<\/a><\/li><li><a href=\"http:\/\/bbs.gaofen.com\/thread-222034-1-1.html\">深圳中考考试大纲<\/a><\/li><li class=\"last\"><a href=\"http:\/\/bbs.gaofen.com\/thread-273817-1-1.html\">英语词根记忆大全<\/a><\/li><\/ul>" + endHtml);
                }
            break;
     
            //首页头条分隔
            case 'index_index_split':
                if(gad_checktime('2012-11-16 14:08:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=116\"  target=\"_blank\"><img width=\"730\" height=\"60\" title=\"高分学校库\" border=\"0\" alt=\"高分学校库\" src=\"http:\/\/att.gaofen.com\/ga\/201211\/16\/2012111602093350.png\"><\/a>" + endHtml);
                }
            break;
     
            //首页头条分隔
            case 'index_split':
                if(gad_checktime('2012-11-16 14:08:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=116\"  target=\"_blank\"><img width=\"730\" height=\"60\" title=\"高分学校库\" border=\"0\" alt=\"高分学校库\" src=\"http:\/\/att.gaofen.com\/ga\/201211\/16\/2012111602093350.png\"><\/a>" + endHtml);
                }
            break;
     
            //3013年小升初、中考、高考备考试题
            case 'index_index_banner2':
                if(gad_checktime('2012-11-16 14:15:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=118\"  target=\"_blank\"><img width=\"1000\" height=\"60\" title=\"3013年小升初、中考、高考备考试题\" border=\"0\" alt=\"3013年小升初、中考、高考备考试题\" src=\"http:\/\/att.gaofen.com\/ga\/201302\/25\/2013022506080387.gif\"><\/a>" + endHtml);
                }
            break;
     
            //3013年小升初、中考、高考备考试题
            case 'index_banner2':
                if(gad_checktime('2012-11-16 14:15:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=118\"  target=\"_blank\"><img width=\"1000\" height=\"60\" title=\"3013年小升初、中考、高考备考试题\" border=\"0\" alt=\"3013年小升初、中考、高考备考试题\" src=\"http:\/\/att.gaofen.com\/ga\/201302\/25\/2013022506080387.gif\"><\/a>" + endHtml);
                }
            break;
     
            //首页跨栏3
            case 'index_index_banner3':
                if(gad_checktime('2012-11-16 14:17:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=119\"  target=\"_blank\"><img width=\"1000\" height=\"60\" title=\"2013广州小升初公校民校语数英备考指南（小升初必下资料）\" border=\"0\" alt=\"2013广州小升初公校民校语数英备考指南（小升初必下资料）\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003304146.gif\"><\/a>" + endHtml);
                }
            break;
     
            //首页跨栏3
            case 'index_banner3':
                if(gad_checktime('2012-11-16 14:17:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=119\"  target=\"_blank\"><img width=\"1000\" height=\"60\" title=\"2013广州小升初公校民校语数英备考指南（小升初必下资料）\" border=\"0\" alt=\"2013广州小升初公校民校语数英备考指南（小升初必下资料）\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003304146.gif\"><\/a>" + endHtml);
                }
            break;
     
            //学而思教育品牌
            case 'index_index_brandarea':
                if(gad_checktime('2012-11-19 11:35:00', '')){
                    document.write(noHtml + "    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=127\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"新东方教育\" border=\"0\" alt=\"新东方教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003045484.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=127\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"新东方教育\" alt=\"新东方教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003045497.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=120\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"卓越教育\" border=\"0\" alt=\"卓越教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003092387.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=120\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"卓越教育\" alt=\"卓越教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003092347.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=121\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"学大教育\" border=\"0\" alt=\"学大教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003085241.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=121\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"学大教育\" alt=\"学大教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003085280.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=122\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"安博教育\" border=\"0\" alt=\"安博教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003082191.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=122\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"安博教育\" alt=\"安博教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003082158.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=123\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"英讯理想教育\" border=\"0\" alt=\"英讯理想教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003074855.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=123\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"英讯理想教育\" alt=\"英讯理想教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003074826.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=124\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"立尚教育\" border=\"0\" alt=\"立尚教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003070993.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=124\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"立尚教育\" alt=\"立尚教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003070947.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=125\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"龙文教育\" border=\"0\" alt=\"龙文教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003062280.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=125\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"龙文教育\" alt=\"龙文教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003062286.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=126\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"精锐教育\" border=\"0\" alt=\"精锐教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003054440.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=126\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"精锐教育\" alt=\"精锐教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003054483.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\" href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=128\"  target=\"_blank\"><img  width=\"80\" height=\"36\"  title=\"学而思教育\" border=\"0\" alt=\"学而思教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003105964.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=128\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"学而思教育\" alt=\"学而思教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003032860.gif\"><\/a><\/div><\/li>" + endHtml);
                }
            break;
     
            //学而思教育品牌
            case 'index_brandarea':
                if(gad_checktime('2012-11-19 11:35:00', '')){
                    document.write(noHtml + "    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=127\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"新东方教育\" border=\"0\" alt=\"新东方教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003045484.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=127\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"新东方教育\" alt=\"新东方教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003045497.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=120\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"卓越教育\" border=\"0\" alt=\"卓越教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003092387.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=120\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"卓越教育\" alt=\"卓越教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003092347.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=121\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"学大教育\" border=\"0\" alt=\"学大教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003085241.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=121\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"学大教育\" alt=\"学大教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003085280.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=122\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"安博教育\" border=\"0\" alt=\"安博教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003082191.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=122\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"安博教育\" alt=\"安博教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003082158.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=123\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"英讯理想教育\" border=\"0\" alt=\"英讯理想教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003074855.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=123\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"英讯理想教育\" alt=\"英讯理想教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003074826.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=124\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"立尚教育\" border=\"0\" alt=\"立尚教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003070993.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=124\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"立尚教育\" alt=\"立尚教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003070947.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=125\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"龙文教育\" border=\"0\" alt=\"龙文教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003062280.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=125\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"龙文教育\" alt=\"龙文教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003062286.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=126\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"精锐教育\" border=\"0\" alt=\"精锐教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003054440.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=126\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"精锐教育\" alt=\"精锐教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003054483.gif\"><\/a><\/div><\/li>    <li class=\"line\"><a class=\"brCon\"  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=128\"  target=\"_blank\"><img width=\"80\" height=\"36\"  title=\"学而思教育\" border=\"0\" alt=\"学而思教育\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003105964.gif\"><\/a><div class=\"hover\">					<a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=128\"  target=\"_blank\">					<img width=\"890\" height=\"60\" title=\"学而思教育\" alt=\"学而思教育\" data-url=\"http:\/\/att.gaofen.com\/ga\/201212\/10\/2012121003032860.gif\"><\/a><\/div><\/li>" + endHtml);
                }
            break;
     
            //首页banner
            case 'index_index_banner_v5':
                if(gad_checktime('2013-04-18 09:37:00', '')){
                    document.write(noHtml + "<a href=\"http:\/\/gz.xdf.cn\/zhuanti\/zklt\/index.html?ly=gaofen\" target=\"_blank\"><img src=\"http:\/\/att.gaofen.com\/ga\/201403\/20\/2014032010274981.jpg\" alt=\"优能中学中考高峰论坛\" title=\"优能中学中考高峰论坛\"><\/a><a href=\"http:\/\/gz.xdf.cn\/zhuanti\/vipfbh\/vip.html?ly=gaofen\" target=\"_blank\" style=\"display:none\"><img src=\"http:\/\/att.gaofen.com\/forum\/201402\/28\/121011nobgnoms7klmww87.jpg\" alt=\"新东方考试趋势发布会\" title=\"新东方考试趋势发布会\"><\/a>" + endHtml);
                }
            break;
     
            //首页banner
            case 'index_banner_v5':
                if(gad_checktime('2013-04-18 09:37:00', '')){
                    document.write(noHtml + "<a href=\"http:\/\/gz.xdf.cn\/zhuanti\/zklt\/index.html?ly=gaofen\" target=\"_blank\"><img src=\"http:\/\/att.gaofen.com\/ga\/201403\/20\/2014032010274981.jpg\" alt=\"优能中学中考高峰论坛\" title=\"优能中学中考高峰论坛\"><\/a><a href=\"http:\/\/gz.xdf.cn\/zhuanti\/vipfbh\/vip.html?ly=gaofen\" target=\"_blank\" style=\"display:none\"><img src=\"http:\/\/att.gaofen.com\/forum\/201402\/28\/121011nobgnoms7klmww87.jpg\" alt=\"新东方考试趋势发布会\" title=\"新东方考试趋势发布会\"><\/a>" + endHtml);
                }
            break;
     
            //京翰教育_首页
            case 'index_index_left_banner_ad1':
                if(gad_checktime('2013-06-17 10:39:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=162\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"京翰一对一，步步为赢\" border=\"0\" alt=\"京翰一对一，步步为赢\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031905224420.png\"><\/a>" + endHtml);
                }
            break;
     
            //京翰教育_首页
            case 'index_left_banner_ad1':
                if(gad_checktime('2013-06-17 10:39:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=162\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"京翰一对一，步步为赢\" border=\"0\" alt=\"京翰一对一，步步为赢\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031905224420.png\"><\/a>" + endHtml);
                }
            break;
     
            //小升初寒假备考资料
            case 'index_index_right_side_ad1':
                if(gad_checktime('2013-06-17 10:40:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=163\"  target=\"_blank\"><img width=\"200\" height=\"80\" title=\"小升初寒假高效备考精华资料\" border=\"0\" alt=\"小升初寒假高效备考精华资料\" src=\"http:\/\/att.gaofen.com\/ga\/201401\/21\/2014012102512068.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //小升初寒假备考资料
            case 'index_right_side_ad1':
                if(gad_checktime('2013-06-17 10:40:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=163\"  target=\"_blank\"><img width=\"200\" height=\"80\" title=\"小升初寒假高效备考精华资料\" border=\"0\" alt=\"小升初寒假高效备考精华资料\" src=\"http:\/\/att.gaofen.com\/ga\/201401\/21\/2014012102512068.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //卓越杯首页
            case 'index_index_left_banner_ad2':
                if(gad_checktime('2014-02-20 14:19:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=180\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"高分网探密2014年“卓越杯”小学全科知识竞赛\" border=\"0\" alt=\"高分网探密2014年“卓越杯”小学全科知识竞赛\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031903055623.png\"><\/a>" + endHtml);
                }
            break;
     
            //卓越杯首页
            case 'index_left_banner_ad2':
                if(gad_checktime('2014-02-20 14:19:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=180\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"高分网探密2014年“卓越杯”小学全科知识竞赛\" border=\"0\" alt=\"高分网探密2014年“卓越杯”小学全科知识竞赛\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031903055623.png\"><\/a>" + endHtml);
                }
            break;
     
            //小升初民校行
            case 'index_index_left_banner_ad3':
                if(gad_checktime('2013-11-05 18:12:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=203\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"高分网2014广州小升初民校行\" border=\"0\" alt=\"高分网2014广州小升初民校行\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031903032975.png\"><\/a>" + endHtml);
                }
            break;
     
            //小升初民校行
            case 'index_left_banner_ad3':
                if(gad_checktime('2013-11-05 18:12:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=203\"  target=\"_blank\"><img width=\"760\" height=\"80\" title=\"高分网2014广州小升初民校行\" border=\"0\" alt=\"高分网2014广州小升初民校行\" src=\"http:\/\/att.gaofen.com\/ga\/201403\/19\/2014031903032975.png\"><\/a>" + endHtml);
                }
            break;
     
            //首页机构评选活动
            case 'index_indextop1':
                if(gad_checktime('2012-05-07 10:58:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=76\"  target=\"_blank\"><img width=\"480\" height=\"74\" title=\"2012最受家长好评的课外辅导机构大评选\" border=\"0\" alt=\"2012最受家长好评的课外辅导机构大评选\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310285688.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //首页机构评选活动
            case 'indextop1':
                if(gad_checktime('2012-05-07 10:58:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=76\"  target=\"_blank\"><img width=\"480\" height=\"74\" title=\"2012最受家长好评的课外辅导机构大评选\" border=\"0\" alt=\"2012最受家长好评的课外辅导机构大评选\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310285688.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //广州民校造星能力点评
            case 'index_head_banner':
                if(gad_checktime('2012-07-05 12:20:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=95\"  target=\"_blank\"><img width=\"428\" height=\"60\" title=\"从2012年中考成绩看广州民校“造星”能力\" border=\"0\" alt=\"从2012年中考成绩看广州民校“造星”能力\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310325479.jpg\"><\/a>" + endHtml);
                }
            break;
     
            //广州民校造星能力点评
            case 'head_banner':
                if(gad_checktime('2012-07-05 12:20:00', '')){
                    document.write(noHtml + "    <a  href=\"http:\/\/bbs.gaofen.com\/plugin.php?id=gaofen_ad:click_count&aid=95\"  target=\"_blank\"><img width=\"428\" height=\"60\" title=\"从2012年中考成绩看广州民校“造星”能力\" border=\"0\" alt=\"从2012年中考成绩看广州民校“造星”能力\" src=\"http:\/\/att.gaofen.com\/ga\/201212\/13\/2012121310325479.jpg\"><\/a>" + endHtml);
                }
            break;
     }
};

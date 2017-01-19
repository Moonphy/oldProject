/**
 * @author   xiezhiwen
 * @class Gaofen.ex.Listener
 * 全局事件广播
 * <code><pre>
   Gaofen.on('listen', function(){
        console.log(arguments);
    });
    
    Gaofen.fire('listen', {arg:1});
   </pre></code>
 */


(function(G, $, win){

    var R = G.util.arrayRemove,
        Listener = function(){};
       
    Listener.prototype = {
    
      fire : function(eid){

      	if(__debug) {console.log('发送:%o',arguments);}
      
      	if(this.events){
      		
      		var handlers = this.events[eid];
      		
      		if(handlers){
      			var fnArgs = $.makeArray(arguments),
      			    argLen, ret, i, len, oHand;
      			// remove eid the first argument
      			fnArgs.shift();
    			argLen=fnArgs.length;
            
            handlers._evtLocked = true;
            
      			for(i=0,len=handlers.length;i<len;i++){
      				oHand = handlers[i];
      				
      				// 标记已删除
      				if( oHand.removed)
      				   continue;
      				// 如果注册处理中存在参数args,追加到当前参数列尾
      				if(oHand.args)
      				   fnArgs[argLen] = oHand.args;
      
      				// 如果注册处理中存在this,应用this调用处理函数
      				ret = (oHand.ds)?oHand.cb.apply(oHand.ds,fnArgs):oHand.cb.apply(this,fnArgs);
      				
      				//如果某个处理回调返回false,取消后续处理
      				if(ret === false)
      				   break;
      			}
      			
      			handlers._evtLocked = false;
      		}
      	}
      	//返回最后一个处理的函数执行结果
      	return ret;
      },
      
      on   :  function(eid,callback,ds,objArgs){
          if(!eid || !callback){
          	  if(__debug) console.trace();
              throw ('eid or callback can not be null');
          }
    
          
          if(!this.events)
            this.events = {};
          var hs = this.events[eid];
          if(!hs)
              hs = this.events[eid] = [];
          hs[hs.length] = {
              cb:callback,
              ds:ds,
              args:objArgs
          };
          return this;
      },
      
      un : function(eid,callback){
          if(!this.events)
            return this;
          
          if(callback === undefined){
            delete this.events[eid];
            return this;
          }
      
          var handlers = this.events[eid];
      
          if(handlers){
              // 产生迭代修改冲突，将复制新数组。
              if(handlers._evtLocked) {
                 handlers = this.events[eid] = handlers.slice(0);
              }
              
              for(var i=0;i<handlers.length;i++){
                  var oHand = handlers[i];
                  if(oHand.cb == callback){
                      R(handlers, i);
                      // 标记删除
                      oHand.removed = true;
                      break;
                  }
              }
          }
          return this;
      },
      
      fireOnce : function(eid){
        var r = this.fire.apply(this, arguments);
        this.un(eid);
        return r;
      }
    };

    G.ex.Listener = Listener;

    $.extend(G, Listener.prototype);

})(Gaofen, jQuery, window);	
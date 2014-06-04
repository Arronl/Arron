(function($){
    $.require=function(urlAry,callback){
        var config=$.require.Config
        ,requireQueue=$.require.requireQueue
        ,args=Array.prototype.slice.call(arguments)
        if(urlAry instanceof Array&&urlAry.length!=0){
             requireQueue.push({
             	  urlAry:urlAry,
             	  callback:callback
             });
             if(requireQueue.length==1)runQueue();
        }
    }
    function runQueue(){
    	var requireQueue=$.require.requireQueue;
        if(requireQueue.length==0)return;
        var urlAry=requireQueue[0].urlAry
        ,callback=requireQueue[0].callback
        addScript(urlAry,function(){
        	 requireQueue.splice(0,1);
        	 callback&&callback();
             runQueue();
        })
    }
    function addScript(urlAry,callback){
        if(urlAry.length==0)return;
        var head= document.getElementsByTagName('head')[0]
        ,config=$.require.Config
        ,urlEndStr=config.cache===false?'?'+new Date().getTime():''
        ,script= document.createElement('script');   
		script.type= 'text/javascript';   
		script.src=(urlAry[0].length>3&&urlAry[0].substr(urlAry.length-4,3)==".js"?urlAry[0]:urlAry[0]+".js")+urlEndStr; 
		script.onload= function(){  
         	urlAry.splice(0,1);
         	if(urlAry.length==0)callback();
         	addScript(urlAry,callback);
		}  
		head.appendChild(script);
    }
    $.require.requireQueue=[];
    $.require.Config={
    	cache:false
    }
})(Zepto);
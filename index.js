'use strict';
var loop;
var frame_speed=3000;
var frame_rate=0;
var frame_counter=0;
let frame_second=1000;
let _BG=null;


document.addEventListener("DOMContentLoaded",function(event){
	if(typeof(start)=="function"){start();}
	if(typeof(update)=="function"){
	    loop=setInterval(function(){update();frame_counter++;},parseInt(1000/frame_speed));
	    let  fc=setInterval(function(){frame_rate=frame_counter;frame_counter=0;},1000);
	}
	if(typeof(Second)=="function"){
	    let s=setInterval(function(){Second()},frame_second);
	}
	Track_key_press(key=>{if(key==27)noloop()});
});




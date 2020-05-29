function Background(A_size,bg_color="#fff"){ // make a background
	background=new DIV();
	background.free();
	background.box();
	background.bg_color(bg_color);
	if(typeof(A_size)==="object"){
		background.size(A_size[0],A_size[1]);
	} else if(!A_size){
		background.size("100%","100%");
	} else{background.size(A_size,A_size);}
	_BG=background;
	return background;
}
function reverse(s){
    return s.split("").reverse().join("");
}
function Noise(y_range=0.05){
	this.smoth=y_range;
	this.values=new Array(100000)
	this.values[0]=random(1,0,1);
	for (var i = 1; i < this.values.length; i++){
		var new_val=this.values[i-1]+random(this.smoth,-this.smoth,1);
		while(new_val>1||new_val<0){new_val=this.values[i-1]+random(this.smoth,-this.smoth,1)}
		this.values[i]=new_val;
	}
	this.pick=function(x){
		// return random(1,0,1);
		var rang={x:null,y:null};
		rang.x={f:Math.floor(x),l:Math.floor(x+1)};
		rang.y={f:this.values[rang.x.f],l:this.values[rang.x.l]};
		let r=fx(x,rang.x.f,rang.y.f,rang.x.l,rang.y.l);
		return r;
	}
}

function Boom(elm1,elm2){ // check if the two ellement are sutting
	// w=> width ---> squar
	// r=> raduis --> circle
	if(elm1.elm&&elm1.elm.isCircle&&elm2.elm.isCircle){ // two circles
		var d=dist(elm1.x,elm1.y,elm2.x,elm2.y);
		var min_d=elm1.w/2+elm2.w/2;
		if(d<=min_d){return true;}
	}
	else if(elm1.x-elm1.radius/2<=elm2.x+elm2.radius/2 && 
	 elm1.x+elm1.radius/2>=elm2.x-elm2.radius/2&&
	 elm1.y-elm1.radius/2<=elm2.y+elm2.radius/2 && 
	 elm1.y+elm1.radius/2>=elm2.y-elm2.w/2){
		return true;
	}

	return false
}
function delete_array(a,ind,less=false,first_elm=false){ // delete one item from array or all less the number
	var a1=new Array();
	if(first_elm){a1.push(first_elm);}
	for (var i = 0; i < a.length; i++) {
		if(less!=2&&((i!=ind&&!less)||(less&&i>ind))){a1.push(a[i]);}
		else if(less==2&&i<=ind){a1.push(a[i]);}
	}
	return a1;
}
function Stack(){
	this.ellements=new Array();
	this.get=function(i=0){
		return this.ellements[i]
	}
	this.push=function(data){
		if(data&&!in_array(this.ellements,data)){this.length++;this.ellements.push(data);}
	}
	this.drop=function(index=0){
		this.ellements=delete_array(this.ellements,index);
	}
	this.sum=function(){
		var s=0;
		for (var i = 0; i < this.ellements.length; i++) {
			s+=parseInt(this.ellements[i]);
		}
		return s;
	}
	this.length=0;
}
function Vector(x,y){
	this.x=x;
	this.y=y;
	this.add=function(v){
		this.x+=v.x;
		this.y+=v.y;
		return this;
	}
	this.abc=function(v){
		this.x-=v.x;
		this.y-=v.y;
		return this;
	}
	this.mult=function(v){
		if(typeof(v)=="object"){
			return this.x*v.y-this.y*v.x;
		}else{
			this.x*=v;
			this.y*=v;
		}
		return this;
	}
	this.div=function(v){
		this.x/=typeof(v)=="object"?(v.x||1):(v||1);
		this.y/=typeof(v)=="object"?(v.y||1):(v||1);
		return this;
	}
	this.mag=function(){
		var len=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
		return len;
	}
	this.normalise=function(){
		var len=this.mag();
		if(len){
			this.x=this.x/len;
			this.y=this.y/len;
		}
		return this;
	}
	this.setMag=function(v){
		this.normalise();
		this.x*=v;
		this.y*=v;
		return this;
	}
	this.update=function(x,y){
		this.x=x;
		this.y=y;
		return this;
	}
	this.get=function(){
		return new Vector(this.x,this.y);
	}
	this.limit=function(max){
		var l=this.mag();
		this.x=map(this.x,0,l,0,max)||this.x;
		this.y=map(this.y,0,l,0,max)||this.y;
		return this;
	}
	this.angle=function(vect){
		var link=this.get().abc(vect);
		var tempA=0;
		if(link.x)
			tempA=Math.acos(link.x/link.mag())*(180/Math.PI);
		else if(link.y)
			tempA=Math.asin(link.y/link.mag())*(180/Math.PI);		
		
		if(this.y-vect.y<0&&this.x-vect.x<0){tempA+=(180-tempA)*2}
		if(this.y-vect.y<0&&this.x-vect.x>0){tempA=360-tempA;}
		return tempA;
	}
}
function push_first(a1,e){
	var a=new Array();
	a.push(e);
	for (var i = 0; i < a1.length; i++) {
		a.push(a1[i]);
	}
	return a;
}
function dist(x1,y1,x2,y2){ // return the dictent from tho dot
	return Math.sqrt((Math.pow(x2-x1,2))+(Math.pow(y2-y1,2)));
}
function echo(msg){ // show message in console 
	console.log(msg);
}
function error(msg){
	console.error(msg);
}
function noloop(stop=false){ // stoping the update function
	clearInterval(loop);
	if(stop){return false}
}
function setFrame_speed(fs){
	noloop(1);
	frame_speed=fs;
	/** *@todo:clearInterval(loop) */
	loop=setInterval(function(){update();frame_counter++;},1000/frame_speed);
}
function fx(x,x1,y1,x2,y2){
	var slop=(y1-y2)/(x1-x2);
	var b=y1-(slop*x1);
	return slop*x+b;
}

function map(val,f_min,f_max,l_min,l_max){
	var f_rang=f_max-f_min;
	var per=((val-f_min)*100)/f_rang;
	var l_rang=l_max-l_min;
	var mapping=(per*l_rang)/100;
	return mapping+l_min;
}
function random(big,less=0,float=0){ // return randomly number buttwin the number
	var Float=float?function(num){return parseFloat(num);}:function(num){return Math.floor(num);}
	var r;//the outcom
	//check the bigest number in big and the less 
	if(typeof(big)!=="object"&&big<less){
		var temp=less;less=big;big=temp;
	}
	var less_n=(less<0?(less||1):false);//for check if nember less is nigative
	var big_n=(big<0?(big||1):false);//for check if nember big is nigative
	// make it positive number
	big=typeof(big)!=="object"?Math.abs(big):big;
	less=Math.abs(less);
	// return random ellemnt from array
	if(!big){return false;}
	else if(typeof(big)=="object"){
		r=big[random(big.length-1)];
	}
	// return random number
	else if((!big_n&&!less_n)||(big_n&&less_n)){ ///big is not nigative and less is not nigative too [10,2] or the reverse 
		while(true){
			r=Float((Math.random()*(big+1))+less);
			if(r<=big&&r>=less)break;
		}
		if(big_n&&less_n){r*=-1;}
	}

	else if(big_n&&less==0){//big is nigative and less is null [-10]
		r=Float((Math.random()*(big+1)))*-1;
	}

	else if(!big_n&&less_n){ // big positive the less is nigative
		var p=random(big,undefined,float);   // make the part positive
		var n=random(less,undefined,float);  //make the part nigative
		r=random(1)?p:-n;    //toggle between the two by random
	}
	return r;
}
class DIV{
	constructor(parent,type="div"){
		this.parent;
		if(parent)
			this.parent=parent
		else if(_BG instanceof DIV)
			this.parent=_BG.elm
		else this.parent=document.body;

		if(typeof(this.parent)=="object"){
			this.elm = document.createElement(type);
			this.elm.style.opacity=1;
			this.parent.appendChild(this.elm);
		}else this.elm=document.querySelector(this.parent);
		if(type=="input"){this.elm.type="text";}
		this.isCircle=false;	
		this.x=0;
		this.y=0;
		this._width=0;
		this._height=0;
	}

	style(property){
		return window.getComputedStyle(this.elm).getPropertyValue(property);
	}
	hide() {
		this.elm.style.display="none";
		return this;
	}
	show() {
		this.elm.style.display="block";
		return this;
	}
	text(text=null,color=null,size=null,dir=null){
		if(text)	(this.elm.value)?this.elm.value=text:this.elm.innerHTML=text;
		if(color)	this.elm.style.color=color;
		if(size)	this.elm.style.fontSize=typeof(size)=="number"?size+"px":size;
		if(dir)		this.elm.style.textAlign=dir
			if(!text&&!color&&!size&&!dir)
				return {value:this.elm.innerHTML||this.elm.value,
						color:this.elm.style.color||undefined,
						size:this.elm.style.fontSize||undefined,
						dir:this.elm.style.textAlign||undefined}
		return this;
	}

	bg_color (hix){
      if(!hix){return this.elm.style.background}
		this.elm.style.background=hix;
		return this;
	}
	width(val=null,der=null,splite="px"){
		if(val&&!der){
			this.elm.style.width=typeof(val)=="number"?val+"px":val;
			this._width=parseFloat(this.elm.offsetWidth);
			return this;
		}
		else if(val&&der){
			let transition=this.style("transition");
			this.elm.style.transition="none";
			let counter=this.elm.style.width;
			let t=50;
			let increment=(t*(val-counter))/der;
			return new Promise((resolve,rejuct)=>{
				let add=()=>{
					counter+=increment;
					try{
						if((Math.floor(counter)>Math.floor(val)&&increment>0)||(Math.floor(counter)<Math.floor(val)&&increment<0))
							{this.elm.style.transition=transition;resolve(this);return true;}
						this.elm.style.width=counter+splite;
						this._width=parseFloat(this.elm.offsetWidth)
						setTimeout(add,t);
					}catch(e){rejuct(e);}
				} 
				add();
			});
		}else return this._width;
	}
	height(val=null,der=null,splite="px"){
		if(val&&!der){
			this.elm.style.height=typeof(val)=="number"?val+"px":val;
			this._height=parseFloat(this.elm.offsetHeight);
			return this;
		}
		else if(val&&der){
			let transition=this.style("transition");
			this.elm.style.transition="none";
			let counter=this.elm.style.height;
			let t=50;
			let increment=(t*(val-counter))/der;
			return new Promise((resolve,rejuct)=>{
				let add=()=>{
					counter+=increment;
					try{
						if((Math.floor(counter)>Math.floor(val)&&increment>0)||(Math.floor(counter)<Math.floor(val)&&increment<0))
							{this.elm.style.transition=transition;resolve(this);return true;}
						this.elm.style.height=counter+splite;
						this._height=parseFloat(this.elm.offsetHeight);
						setTimeout(add,t);
					}catch(e){rejuct(e);}
				} 
				add();
			});
		}else return this._height;

	}
	size (w=0,h=w){
		this.elm.style.width=typeof(w)=="number"?w+"px":w;
		this.elm.style.height=typeof(h)=="number"?h+"px":h;
		this._width=parseFloat(this.elm.offsetWidth);
		this._height=parseFloat(this.elm.offsetHeight);
		return this;
	}
	border (w,hix,dir="") {
		if(typeof(dir)==="object"){
			dir.forEach(v=>{
				if(v==1){v="-top";}
				if(v==4){v="-left";}
				if(v==3){v="-bottom";}
				if(v==2){v="-right";}				
				this.elm.style['border'+v]=(typeof(w)=="number"?w+"px":w)+" solid "+hix;
			});	
		}else{
			if(dir==1){dir="-top";}
			if(dir==4){dir="-left";}
			if(dir==3){dir="-bottom";}
			if(dir==2){dir="-right";}
			this.elm.style['border'+dir]=(typeof(w)=="number"?w+"px":w)+" solid "+hix;
		}
		return this;
	}
	circle(){
		this.isCircle=true;
		this.elm.style.borderRadius= "200em";
		return this;
	}
	free (){
		
		this.elm.style.position="absolute";
		return this;
	}
	box(){
		this.elm.style.overflow= 'hidden';
		return this;
	}
	top (get=false,inc=0){
		if(get===false){
			return this.y
		}else{
			this.y=get+(inc?this.y:0);
			this.elm.style.transform=
				multiTransform(this.elm,"translate",`${this.x}px,${this.y}px`);
			return this;
		}
	}
	left (get=false,inc=0){
		if(get===false){
			return this.x;
		}else{
			this.x=get+(inc?this.x:0);
			this.elm.style.transform=
				multiTransform(this.elm,"translate",`${this.x}px,${this.y}px`);
			return this;
		}
	}
	center(parent){
		this.top(parent.height()/2-this.height()/2).left(parent.width()/2-this.width()/2);
		return this;
	}
  retate (deg){
  	this.elm.style.transform=
			multiTransform(this.elm,"rotate",deg+"deg");
	return this;
  }
  axe_center (val=null){
	this.elm.style.transformOrigin=val||"0 0";
	return this;
  }
	attr(name,val=null){
		if(val){this.elm.setAttribute(name,val);return this;}
		else return this.elm.getAttribute(name);
	}
	onclick(fnc){
		this.elm.addEventListener("click",()=>fnc(this));
	}
	ondclick(fnc){
		this.elm.addEventListener("ondblclick",()=>fnc(this));
	}
	onmouseout(fnc){
		this.elm.addEventListener("onmouseleave",()=>fnc(this));
	}
	onchange(fnc){
		this.elm.addEventListener("onchange",()=>fnc(this));
	}
	remove(){
		this.elm.remove();
	}
}
class Triangle{
	constructor(x,y,w,h=null,color=null){
		this.elm=null;
		this.angle=null;
		if(typeof(x)=="object"){
			this.pos=new Vector(x.x,x.y);
			this.w=y;
			this.h=w;
			this.color=h;
		}
		else{
			this.pos=new Vector(x,y);
			this.w=w;
			this.h=h;
			this.color=color;
		}
		if(this.color)this.show();
	}
	show(){	
		this.elm=new DIV(_BG.elm);
		this.elm.free().top(this.pos.y-this.h/2).left(this.pos.x-this.w/2);
		this.elm.axe_center((this.w/2)+"px "+(this.h/2)+"px");
		this.elm.border(this.w/2,"transparent",[2,4]).border(this.h,this.color,[3]);
	}
	update(pos){
		this.calc_angle(pos)
		if(this.elm)this.elm.retate(this.angle);
		this.pos.x=pos[0];
		this.pos.y=pos[1];
		if(this.elm)this.elm.top(this.pos.y-this.h/2||"0").left(this.pos.x-this.w/2||"0");
	}
	calc_angle(pos){
		let dir=new Vector(pos[0],pos[1]);
		dir=this.pos.get().abc(dir.get());
		if(dir.mag()){
			let angle=Math.abs(Math.acos(dir.y/dir.mag())*(180/Math.PI));		
			if(pos[0]-this.pos.x<0){angle=360-angle;}
			this.angle=angle;
		}
	}
}
function Spot(x,y=0,r=0,c="#000"){
  	if(typeof(x)=="object"){
	  	this.r=x.r||y;
	  	this.x=x.x
	  	this.y=x.y
	  	this.color=x.color||r;
  	}else{
		this.r=r;
		this.x=x
		this.y=y
		this.color=c;
	}
	this.pos=new Vector(this.x,this.y);
  this.zoom=true;
  this.parent=new Array();
  this.elm;
  this.use=1;
  //chech if the input is other spot for just copy it 
  if(this.r>0){
    this.elm=new DIV(_BG.elm);
    this.elm.free().top(this.y-this.r/2).left(this.x-this.r/2).circle().size(this.r,this.r).bg_color(this.color);
  }
  this.update=function(vector){

    this.x=vector[0]||1;
    this.y=vector[1]||1;
    this.pos.x=this.x;
    this.pos.y=this.y;
    var spot2=this.parent.spot1==this?this.parent.spot2:this.parent.spot1;
   	if(this.elm)this.elm.top(this.y-this.r/2).left(this.x-this.r/2);
    if(this.parent){
		for (var i = 0; i < this.parent.length; i++) {
			this.parent[i].update();
		}
    }
  }
  this.state=function(s=0,x,y=0,c="#000"){
  		this.use=s;
  	if(!s){
  		this.elm.top(0).left(0).elm.style.display="none";
  	}else{
		this.x=x
		this.y=y
		this.color=c;
		this.pos.x=x;
		this.pos.y=y;
	  this.parent=new Array();
	  //chech if the input is other spot for just copy it 
	  if(this.r>0){
  		this.elm.elm.style.display="block";
	    this.elm.top(this.y-this.r/2).left(this.x-this.r/2).bg_color(this.color);
	  }

  	}
  }
}
function Line(spot1,spot2,size=0,color='#000'){
	this.object;
	this.spot1=spot1;
	this.spot2=spot2;
	this.spot1.parent.push(this);
	this.spot2.parent.push(this);
	this.size=size;
	this.color=color;
	this.length=dist(this.spot1.x,this.spot1.y,this.spot2.x,this.spot2.y);
	this.angle=0;
	this.axe=this.spot1.pos.mag()>this.spot2.pos.mag()?this.spot2:this.spot1;
	this.AntiAxe=this.axe==this.spot1?this.spot2:this.spot1;
	this.calc_angle=function(){
		this.length=dist(this.spot1.x,this.spot1.y,this.spot2.x,this.spot2.y);
		this.angle=this.AntiAxe.pos.angle(this.axe.pos);
	}
	this.calc_angle();

	if(this.size){
		this.elm=new DIV(_BG.elm);
		this.elm.free().top(this.axe.y+this.axe.r/2-this.size/2).left(this.axe.x+this.axe.r/2-this.size/2)
	    .size(this.length,this.size).bg_color(this.color).axe_center()
	    .retate(this.angle);
	}
	this.update=function(){
		this.calc_angle();
		if(this.size){
			this.elm.free().top(this.axe.y+this.axe.r/2-this.size/2)
				.left(this.axe.x+this.axe.r/2-this.size/2).size(this.length,this.size)
				.bg_color(this.color).axe_center().retate(this.angle);
		}
	}
	this.width=function(size,inc=0,axe=0){
	    if(inc){size+=this.length}
		if(!axe){
	    var x=Math.cos(this.angle*(Math.PI/180))*size+spot1.x;
	    var y=Math.sin(this.angle*(Math.PI/180))*size+spot1.y;
	    spot2.update([x,y]);
	}else{
	    var x=Math.cos(180-(this.angle*(Math.PI/180)+90))*size;
	    var y=Math.sin(180-(this.angle*(Math.PI/180)+90))*size;
	    spot1.update([x,y]);
	}
	this.length=size;
	}
	this.retate=function(angle=0,axe=this.axe,inc=0){
		if(typeof(axe)=="number"){if(axe==1){axe=this.axe}else{axe=this.AntiAxe;}}
		var target=axe==this.axe?this.AntiAxe:this.axe;
		this.calc_angle();
		if(inc){angle+=this.angle}
		if(axe==this.AntiAxe){angle+=180;}

		var rad_angle=angle*(Math.PI/180);	
		x=Math.cos(rad_angle)*this.length;
		y=Math.sin(rad_angle)*this.length;

		this.angle=angle;
		target.update([x+axe.x,y+axe.y]);
	}
  this.remove=function(){
  	this.elm.remove();
  	if(this.object){
  		this.object.lines=delete_array(this.object.lines,this.object.lines.indexOf(this));
  	}
  }
}
function Object(lines){
  this.lines=lines||new Array();
  this.get_center=function(){
  	if(!this.lines.length){return true;}
  	var x=0,y=0;
    for (var i = 0; i < this.lines.length; i++) {
    	x+=this.lines[i].spot1.x;
    	y+=this.lines[i].spot1.y;
    }
    this.axe=new Spot(x/this.lines.length,y/this.lines.length);
  }
  this.get_center();
  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i].parent=this;
  }
  this.move=function(x=0,y=0,incremment=0){
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].spot1.update([this.lines[i].spot1.x+x,this.lines[i].spot1.y+y]);
      this.lines[i].spot2.update([this.lines[i].spot2.x+x,this.lines[i].spot2.y+y]);
    } 
  }
  this.retate=function(angle){
     if(angle){
        for (var i = 0; i < this.lines.length; i++) {
          var l=new Line(this.axe,this.lines[i].spot1);
          l.retate(angle,this.axe,1);
          l=new Line(this.axe,this.lines[i].spot2);
          l.retate(angle,this.axe,1);
        }
      }
  }
  this.push=function(line){
  	this.lines.push(line);
  	line.object=this;
  	this.get_center();
  }
}
var _dots=new Array();
function dot(x=0,y=0,w=1,c="#000" ,fct=""){
  var a=new DIV(_BG.elm);
  a.free().top(y).left(x).bg_color(c).size(w).circle();
  _dots.push(a);
  return a;  
}
function clear_dots(){
	if(_dots.length){
		for (var i = 0; i < _dots.length; i++) {
			_dots[i].remove();
		}
	}
}
function Track_mouse_click(fct){
	document.addEventListener("mousedown",(event)=>fct(event.pageX,event.pageY,event),false);
}
function Track_mouse(fct){
	document.addEventListener("mousemove",(event)=>{
		event.hide=function(){
			_BG.elm.style.cursor="none";
		}
		fct(event.pageX,event.pageY,event);
	})
}
function Track_key_press(fct){
	window.addEventListener("keydown",(event)=>fct(event.keyCode || event.which,event));
}
function multiTransform(elm,key,value){
	let current=(elm.style.transform||"").split(/\) /gm);
	let appliyed=false;
	current=current.map(t=>{
		if(t.length&&t.charAt(t.length-1)!=")")t+=")";
		if(t.indexOf(key)!=-1){
			appliyed=true;
			return `${key}(${value})`;
		}else return t
	})
	if(!appliyed)
		current.push(`${key}(${value})`);
	elm.style.transform=current.join(" ").trim();
}
function temperatureToRGB(temp,defaultRGB="yellow"){
	let vals={
		0.00000: "(255, 56, 0)",
		0.00909: "(255, 71, 0)",
		0.01818: "(255, 83, 0)",
		0.02727: "(255, 93, 0)",
		0.03636: "(255, 101, 0)",
		0.04545: "(255, 109, 0)",
		0.05455: "(255, 115, 0)",
		0.06364: "(255, 121, 0)",
		0.07273: "(255, 126, 0)",
		0.08182: "(255, 131, 0)",
		0.09091: "(255, 138, 18)",
		0.10000: "(255, 142, 33)",
		0.10909: "(255, 147, 44)",
		0.11818: "(255, 152, 54)",
		0.12727: "(255, 157, 63)",
		0.13636: "(255, 161, 72)",
		0.14545: "(255, 165, 79)",
		0.15455: "(255, 169, 87)",
		0.16364: "(255, 173, 94)",
		0.17273: "(255, 177, 101)",
		0.18182: "(255, 180, 107)",
		0.19091: "(255, 184, 114)",
		0.20000: "(255, 187, 120)",
		0.20909: "(255, 190, 126)",
		0.21818: "(255, 193, 132)",
		0.22727: "(255, 196, 137)",
		0.23636: "(255, 199, 143)",
		0.24545: "(255, 201, 148)",
		0.25455: "(255, 204, 153)",
		0.26364: "(255, 206, 159)",
		0.27273: "(255, 209, 163)",
		0.28182: "(255, 211, 168)",
		0.29091: "(255, 213, 173)",
		0.30000: "(255, 215, 177)",
		0.30909: "(255, 217, 182)",
		0.31818: "(255, 219, 186)",
		0.32727: "(255, 221, 190)",
		0.33636: "(255, 223, 194)",
		0.34545: "(255, 225, 198)",
		0.35455: "(255, 227, 202)",
		0.36364: "(255, 228, 206)",
		0.37273: "(255, 230, 210)",
		0.38182: "(255, 232, 213)",
		0.39091: "(255, 233, 217)",
		0.40000: "(255, 235, 220)",
		0.40909: "(255, 236, 224)",
		0.41818: "(255, 238, 227)",
		0.42727: "(255, 239, 230)",
		0.43636: "(255, 240, 233)",
		0.44545: "(255, 242, 236)",
		0.45455: "(255, 243, 239)",
		0.46364: "(255, 244, 242)",
		0.47273: "(255, 245, 245)",
		0.48182: "(255, 246, 247)",
		0.49091: "(255, 248, 251)",
		0.50000: "(255, 249, 253)",
		0.50909: "(254, 249, 255)",
		0.51818: "(252, 247, 255)",
		0.52727: "(249, 246, 255)",
		0.53636: "(247, 245, 255)",
		0.54545: "(245, 243, 255)",
		0.55455: "(243, 242, 255)",
		0.56364: "(240, 241, 255)",
		0.57273: "(239, 240, 255)",
		0.58182: "(237, 239, 255)",
		0.59091: "(235, 238, 255)",
		0.60000: "(233, 237, 255)",
		0.60909: "(231, 236, 255)",
		0.61818: "(230, 235, 255)",
		0.62727: "(228, 234, 255)",
		0.63636: "(227, 233, 255)",
		0.64545: "(225, 232, 255)",
		0.65455: "(224, 231, 255)",
		0.66364: "(222, 230, 255)",
		0.67273: "(221, 230, 255)",
		0.68182: "(220, 229, 255)",
		0.69091: "(218, 229, 255)",
		0.70000: "(217, 227, 255)",
		0.70909: "(216, 227, 255)",
		0.71818: "(215, 226, 255)",
		0.72727: "(214, 225, 255)",
		0.73636: "(212, 225, 255)",
		0.74545: "(211, 224, 255)",
		0.75455: "(210, 223, 255)",
		0.76364: "(209, 223, 255)",
		0.77273: "(208, 222, 255)",
		0.78182: "(207, 221, 255)",
		0.79091: "(207, 221, 255)",
		0.80000: "(206, 220, 255)",
		0.80909: "(205, 220, 255)",
		0.81818: "(207, 218, 255)",
		0.82727: "(207, 218, 255)",
		0.83636: "(206, 217, 255)",
		0.84545: "(205, 217, 255)",
		0.85455: "(204, 216, 255)",
		0.86364: "(204, 216, 255)",
		0.87273: "(203, 215, 255)",
		0.88182: "(202, 215, 255)",
		0.89091: "(202, 214, 255)",
		0.90000: "(201, 214, 255)",
		0.90909: "(200, 213, 255)",
		0.91818: "(200, 213, 255)",
		0.92727: "(199, 212, 255)",
		0.93636: "(198, 212, 255)",
		0.94545: "(198, 212, 255)",
		0.95455: "(197, 211, 255)",
		0.96364: "(197, 211, 255)",
		0.97273: "(197, 210, 255)",
		0.98182: "(196, 210, 255)",
		0.99091: "(195, 210, 255)",
		2.00000: "(195, 209, 255)"
	}
	let selected=defaultRGB;
	for(t in vals)
		if(t<temp){
			selected=vals[t];
		}
	return selected;
}
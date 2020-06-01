frame_speed=60;

let bg;
const colors = [
	[139, 195, 74],
	[255, 237, 81],
	[96, 125, 139],
	[243, 99, 148],
	[0, 188, 212],
	[216, 86, 39]
]
let showCurrentData;
let mouseDot;
let button;
let supportText;
let Data=[];
let currentData=0;


let brian;
let training;

let epocs=0;
let lose=0;

let epocsNum=400;

function start(){
	bg=Background("100%","#333");
	showCurrentData=new DIV;
	showCurrentData.free().top(0).left(bg.width()/2-200).size(400,20).bg_color("#555");
	//button=new DIV(showCurrentData.elm,"button");
	//button.free().size(100,20).left(300).bg_color("red");
	supportText=new DIV(bg.elm,"p");
	supportText.free().top(200).size(500).left(bg.width()/2-250).text(`
		Choose number 1-5 and hold it then draw,
		press Enter to start the training process
	`,"#ddd",45,"center");
	mouseDot = new Spot(-100,-100,70,"#fff");
	mouseDot.elm.border(4,"#fff");
	mouseDot.elm.elm.style.zIndex = 99999


	prevDots =JSON.parse(localStorage.getItem("dots") || "[]");
	Data = prevDots.map(e=>{
		const elm=new DIV;
		const rgb = colors[e.label].join(",");
		elm.free().top(e.y-25).left(e.x-25).size(50).circle().bg_color(`rgb(${rgb})`);
		currentData=0;
		return {
			x:e.x,
			y:e.y,
			label:e.label,
			elm
		}
	})


	brian=new NeuralNetwork([2,50,50,colors.length],0.05);
}
function normalize(x,y){
	return [x/bg.width(),y/bg.height()];
}


function trianOnce(){
	return new Promise((res,rej)=>{
		let lose=0;
		Data.sort(()=>Math.random()-Math.random());
		Data.forEach(d=>{
			const input=normalize(d.x,d.y);
			const target=new Array(colors.length).fill(0);
			target[d.label-1]=1;
			lose+=brian.train(input,target);
		});
		res(lose/Data.length);
	});
}

async function* train(){
  for(i=0;i<epocsNum;i++){
		yield await  trianOnce();
		epocs=(i/epocsNum*100).toFixed(1)+"%";
	}
	stopTraining();
}

function stopTraining(){
	currentData="ready";
	show(40);
}

Track_key_press(async (key)=>{
	key-=96;
	if( typeof(currentData) == "number" ){
		if(key == -83){
			if(Data.length){
				const dots = JSON.stringify(Data.map(({x,y,label})=>({x,y,label})));
				localStorage.setItem("dots",dots);

				currentData = "training";
				Data.forEach(d=>d.elm.remove());
				training=train();
				supportText.text(`
						press Exit to stop the training	or Space to increase the epocs number
					`);
			}else confirm("please draw something");
		}
		else if(key>0 && key<colors.length)
			currentData=key;
	}else if(key == -64)
		epocsNum+=parseInt(epocsNum*0.1);
	else if(key == -69)
		stopTraining();


	if(key == -13)
		brian.save()
	else if(key == -20)
		brian.load()

})


function show(size){
	setInterval(()=>{
		const x = random(bg.width())
		const y = random(bg.height())
		const guess=brian.guess(normalize(x,y));

		const rgbs = guess.map((dense,i)=>{
			return colors[i].map(c=>c*dense)
		});

		const color = rybColorMixer.mix(rgbs);
		dot(x,y,20,`#${color}`);
	},10);

	return;
	const w=Math.floor(bg.width()/size);
	const h=Math.floor(bg.height()/size);
	for(i=0;i<=w;i++){
		for(j=0;j<=w;j++){
			const elm=new DIV;
			elm.free().left(i*size-size/2).top(j*size-size/2).size(size);
  		const guess=brian.guess(normalize(i*size-size/2,j*size-size/2));
  		
  		const rgbs = guess.map((dense,i)=>{
  			return colors[i].map(c=>c*dense)
  		});

  		const color = rybColorMixer.mix(rgbs);
  		elm.bg_color(`#${color}`);
		}
	}
}


Track_mouse((x,y)=>{

	if(currentData && typeof(currentData)==="number"){
		echo("dot has been added");
		const elm=new DIV;
		const rgb = colors[currentData].join(",");
		elm.free().top(y-25).left(x-25).size(50).circle().bg_color(`rgb(${rgb})`);
		Data.push({
			x,y,elm,
			label:currentData
		});
		currentData=0;
	}

 	if(currentData=="ready"){
 		const guess=brian.guess(normalize(x,y));

 		const rgbs = guess.map((dense,i)=>{
 			return colors[i].map(c=>c*dense)
 		});

 		const color = rybColorMixer.mix(rgbs);
 		mouseDot.update([x,y]);
 		mouseDot.elm.bg_color(`#${color}`);
 		dot(x,y,20,`#${color}`);
 	}
});







async function update(){
	showCurrentData.text(
		(currentData=="training"?"training "+epocs+" Error:"+lose:currentData) || "select number"
	,colors[currentData] || "#fff" ,18,"center");


	if(currentData == "training"){
		
			const r= await training.next();
			if(r.done == true)
				currentData="ready";
			lose=r.value.toFixed(3).toString().slice(2);
		

	}
}
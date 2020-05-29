class NeuralNetwork{
	constructor(structure,learing_rate=.1,data){
		this.structure=structure;
		this.layers=[];
		for (var i = 1; i < structure.length; i++) {
			const weight=new Matrix(structure[i],structure[i-1]);
						weight.randomize(data);
			const bais=new Matrix(structure[i],1);
						bais.randomize(data);
			this.layers.push({
				weight:weight,
				bais:bais
			})
		}
		this.lr=learing_rate;
	}

	guess(inputs){
		inputs=Matrix.fromArray(inputs);

		//it will append to each layer it weighed_sum and activated value
		this.layers.forEach(layer=>{
			const output=Matrix.mult(layer.weight,inputs);//weighted sum
			output.add(layer.bais);
			layer.weight_sum=output.get();
			output.map(this.activatedFct);	
			layer.active=output;
			inputs=output;
		})
		return inputs.toArray();

	}

	train(inputs_arr,targets){
		const inputs=Matrix.fromArray(inputs_arr);
		targets=Matrix.fromArray(targets);
		//generate the output of each layer
		const guess=this.guess(inputs_arr);
		// calculate the lose 
		const compare=[];
		for(let i in guess)compare.push(Math.abs(guess[i]-targets.val[i]));
		const lose = compare.reduce((a,b)=> a + b)/guess.length;

		let error=undefined;
		for (var i = this.layers.length - 1; i >= 0; i--) {
			//calculate the error
			if(!error) //that's last layer error=guess-target
				error=Matrix.subtract(targets,this.layers[i].active);
			else {//that's hidden layers error=his To*weight * correspend next node activate value
				let weights_ho_T=Matrix.transpose(this.layers[i+1].weight);
				error=Matrix.mult(weights_ho_T,error);	
			}

			//nudge the weight (تعديل)
			//calcule gradient vector(slop according to current Weight)
			//Delta_W =ERROR[matrix]  *(activatedFct[matrix])' * INPUT[matrix]
			let activatedFctPRIM=Matrix.map(this.layers[i].weight_sum,this.dActivatedFct.bind(this));// (activatedFct[matrix])'
			//calculate part A: ERROR[matrix]  *(activatedFct[matrix])'
			let partA=activatedFctPRIM;
			partA.mult(error);//*ERROR[matrix]
			partA.mult(this.lr);//*learing rate
			//adjust the bais ||delta of the bais is just the partA
			this.layers[i].bais.add(partA);
			//Calculate the delta_w
			//get previos input 
			let previos_input=inputs;
			if(i>=1)previos_input=this.layers[i-1].active;
			//we must transpose the input
			let inputs_T=Matrix.transpose(previos_input);//the fisrt input ever
			let weight_delta=Matrix.mult(partA,inputs_T);
			//adjust the Weight of the input-hidden
			this.layers[i].weight.add(weight_delta);
		}
		return lose;

	}

	activatedFct(x){
		return 1/(1+Math.exp(-x)) ;
	}
	dActivatedFct(x){
		return this.activatedFct(x)*(1-this.activatedFct(x));
	}

	save(){
		let layers=[];
		this.layers.forEach(layer=>{
			layers.push({
				weight:layer.weight.val,
				bais:layer.bais.val
			})
		})
		let data={
			structure:this.structure,
			layers:layers,
			lr:this.lr
		}
		data=JSON.stringify(data);
		caches.open("NeuralNetworkSetting").then(cach=>{
			cach.put("setting",new Response(data))
		})
	}

	load(){
		caches.open("NeuralNetworkSetting").then(cach=>{
			cach.match("setting").then(setting=>{
				setting.text().then(data=>{
					data=JSON.parse(data);
					this.structure=data.structure;
					this.lr=data.lr;

					this.layers=[];
					for (var i = 1; i < this.structure.length; i++) {
						const layer=data.layers.shift()
						const weight=new Matrix(this.structure[i],this.structure[i-1]);
									weight.val=layer.weight;
						const bais=new Matrix(this.structure[i],1);
									bais.val=layer.bais;
						this.layers.push({
							weight:weight,
							bais:bais
						})
					}
				})
			})			
		})
	}
	serialOut(){
		let data=[];
		this.layers.forEach(layer=>{
			data=data.concat(layer.weight.toArray(),layer.bais.toArray())
		});
		return data;
	}
	serialIn(data){
		for(let layer of this.layers){
			for (var i = 0; i < layer.weight.val.length; i++) {
				for (var j = 0; j < layer.weight.val[i].length; j++) {
					layer.weight.val[i][j]=data.shift();
				}
			}
			for (var i = 0; i < layer.bais.val.length; i++) {
				layer.bais.val[i]=[data.shift()];
			}
		}
		return data;
	}

}

function indexOfActive(a){
	let Max=[0,0]
	for (var i = 0; i < a.length; i++) {
		if(a[i]>Max[0])
		Max=[a[i],i]; 
	}
	return Max[1];
}

function last(arr){
	return arr[arr.length-1];
}
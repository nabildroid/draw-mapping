class Matrix{
	constructor(rows,cols){
		this.size=new Vector(cols,rows);
		this.val=new Array(rows).fill().map(()=>new Array(cols).fill(0));
	}
	static fromArray(arr){
		const size=[arr.length,1];
		if(typeof arr[0]=="object")size[1]=arr[0].length
		const r=new Matrix(...size);
		r.val=arr.map(a=>[a]);
		return r;
	}
	static mult(a,b){
		if(a.size.x==b.size.y){
			const r=new Matrix(a.size.y,b.size.x);
			for (let i = 0; i < a.val.length; i++) {
				const row=a.val[i];
				for (let j = 0; j < b.size.x; j++) {
					let sum=0;
					const col=[];
					b.val.map(mval=>col.push(mval[j]));
					for (let s = 0; s < row.length; s++) {
						sum+=row[s]*col[s];
					}
					r.val[i][j]=sum;
				}
			}
			return r;
		}else console.error("Matrix mutiplication Error:Col A must match Row B");
	}
	static subtract(a,b){
		let r=new Matrix(a.size.y,a.size.x);
		for (let i = 0; i < r.val.length; i++)
			for (let j = 0; j < r.val[i].length; j++)
				r.val[i][j]=a.val[i][j]-b.val[i][j];
		return r;
	}
	static map(a,apply){
		const r=new Matrix(a.size.y,a.size.x)
		for (let i = 0; i < a.val.length; i++)
			for (let j = 0; j < a.val[i].length; j++)
				r.val[i][j]=apply(a.val[i][j],i,j);			
		return r;
	}
	static transpose(a){
		const r=new Matrix(a.size.x,a.size.y);
		for (let i = 0; i < a.val.length; i++) {
			for (let j = 0; j < a.val[i].length; j++) {
				r.val[j][i]=a.val[i][j];
			}
		}
		return r;
	}
	mult(n){
		for (let i = 0; i < this.val.length; i++) {
			for (let j = 0; j < this.val[i].length; j++) {
				if(n instanceof Matrix)
							this.val[i][j]*=n.val[i][j];
				else 	this.val[i][j]*=n;
			}
		}
	}
	add(n){
		for (let i = 0; i < this.val.length; i++) {
			for (let j = 0; j < this.val[i].length; j++) {
				if(n instanceof Matrix)
							this.val[i][j]+=n.val[i][j];
				else 	this.val[i][j]+=n;
			}
		}
	}
	toArray(){
		let arr=[];
		for (let i = 0; i < this.val.length; i++)
			for (let j = 0; j < this.val[i].length; j++)
				arr.push(this.val[i][j]);
		return arr;

	}
	randomize(data){
		for (let i = 0; i < this.val.length; i++)
			for (let j = 0; j < this.val[i].length; j++)
				this.val[i][j]=data?data.shift():(Math.random() * 2 -1);
	}
	map(apply){
		for (let i = 0; i < this.val.length; i++)
			for (let j = 0; j < this.val[i].length; j++)
				this.val[i][j]=apply(this.val[i][j]);			
	}
	get(){
		let r=new Matrix(this.size.y,this.size.x);
		for (let i = 0; i < this.val.length; i++)
			for (let j = 0; j < this.val[i].length; j++)
				r.val[i][j]=this.val[i][j];
		return r;
	}
	print(){
		console.table(this.val);
	}
}
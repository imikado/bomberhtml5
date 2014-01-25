//Map
function Map(){
	this.tMap=[
		
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],
		[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	];
	
	this.tImg=Array();
	
	this.tImg[1]='bomb-ground';
	this.tImg[2]='bomb-wall';
	
}
Map.prototype={
	
	build:function(){
		 
		for(var y=0;y< maxY;y++){
			for(var x=0;x< maxX;x++){
				
				 
				if(this.tMap[y] && this.tMap[y][x]){
					
					//on dessine sur le canvas la valeur du tableau
					this.drawImage( this.tMap[y][x] ,x,y);
					
				}
			}	
		} 
		
	},
	//la methode pour dessiner sur le canvas
	drawImage:function(iImg,x,y){
		console.log(this.tImg[iImg]);
		oImages.drawImageOnLayer(this.tImg[iImg],x*widthCase,y*heightCase,widthCase,widthCase,'map');
	},
	rebuild:function(){
		for(var y=0;y< maxY;y++){
			for(var x=0;x< maxX;x++){
				
				oLayer_map.clearRect(x*widthCase,y*widthCase,widthCase,heightCase);
				
			}	
		} 
	},
	
	
};

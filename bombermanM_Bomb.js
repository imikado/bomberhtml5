function Bomb(name,team){
	this.name=name;
	this.oImage='';
	this.idImg='';
	
	this.x=0;
	this.y=0;
	
	this.width=widthCase;
	this.height=widthCase;
	
	this.team=team;
	
	this.action='';
	this.oAudio;
	this.tmpIdImg='';
	
	this.id=0;
	
	this.shortname='Bomb';
	this.idImg='bomb-0';
	this.life=1;
	
}
Bomb.prototype={

	playSound:function(action,lastAction){
		if(!oGame.bSound){
			this.stopSound();
			return;
		}
		
		
		if(action==lastAction){
			return;
		}
		this.stopSound();
		
		this.oAudio=new Audio();
		this.oAudio.src=oSound.getSrc(action);
		this.oAudio.play();
		
	},
	stopSound:function(){
		if(!this.oAudio){
			return;
		}
		this.oAudio.pause();
		//this.oAudio.currentTime=0;
	},
	getX:function(){
		return parseInt(this.x);
	},
	getY:function(){
		return parseInt(this.y);
	},
	
	animateBroadcast:function(action){
		socket.emit('Bomb.animateBroadcast',this.id,action);
	},
	animate:function(action){
		this.idImg=action;
		this.build();
	},
	
	buildBroadcast:function(){
		socket.emit('Perso.buildBroadcast',this.id,this.x,this.y);
	},
	build:function(){
		
		if(this.idImg=='explosion' || this.idImg=='explosion-1' || this.idImg=='explosion-2'){
			for(var i=-2;i< 3;i++){
				oLayer_bomb.clearRect(((this.x+i)*widthCase),(this.y*heightCase),widthCase,widthCase);
				oLayer_bomb.clearRect(((this.x)*widthCase),((this.y+i)*heightCase),widthCase,widthCase);
				
				if(map.tMap[this.y][this.x+i]==1){
					oImages.drawImageOnLayer(this.idImg,((this.x+i)*widthCase),(this.y*heightCase),widthCase,widthCase,'bomb');
				}
				if(map.tMap[this.y+i][this.x]==1){
					oImages.drawImageOnLayer(this.idImg,((this.x)*widthCase),((this.y+i)*heightCase),widthCase,widthCase,'bomb');
				}
			}
		
		}else if(this.idImg=='explosion-finish'){
			for(var i=-2;i< 3;i++){
				oLayer_bomb.clearRect(((this.x+i)*widthCase),(this.y*heightCase),widthCase,widthCase);
				oLayer_bomb.clearRect(((this.x)*widthCase),((this.y+i)*heightCase),widthCase,widthCase);
				
				var oPersoVictim=oGame.getPerso(this.x+i,this.y);
				if(oPersoVictim){
					oGame.removeBroadcastPersoById(oPersoVictim.id);
					console.log('remove '+oPersoVictim.id);
				}
				oPersoVictim=oGame.getPerso(this.x,this.y+i);
				if(oPersoVictim){
					oGame.removeBroadcastPersoById(oPersoVictim.id);
					console.log('remove '+oPersoVictim.id);
				}
				
			}
			
			oGame.removeBroadcastBombById(this.id);
			return;
		}else{
			oLayer_bomb.clearRect((this.x*widthCase),(this.y*heightCase),widthCase,widthCase);
		}
				
		oImages.drawImageOnLayer(this.idImg,(this.x*widthCase),(this.y*heightCase),widthCase,widthCase,'bomb');
			
		oGame.saveBomb(this);
		
	},
	clear:function(){
		oGame.removeBomb(this);
		oLayer_bomb.clearRect( (this.x*widthCase)-20,(this.y*heightCase)-40,widthCase*2,heightCase*2);
		
	},

};

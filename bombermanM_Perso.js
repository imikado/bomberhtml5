function Perso(name,team){
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
	
	this.shortname='Soldat';
	this.idImg='perso';
	this.life=1;
		
		
	
}
Perso.prototype={
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
		socket.emit('Perso.animateBroadcast',this.id,action);
	},
	animate:function(action){
		/*
		oLayer_perso.clearRect(((this.x-currentX)*widthCase),((this.y-currentY)*heightCase),widthCase-2,widthCase-2);

		var tmpImg;
		if(action=='walking'){
			
			var sDirection=oGame.tDirection[this.team];
			
			if(sDirection==''){
				tmpImg=this.idImg;
			}else if(this.tmpIdImg==this.idImg+'_walking2'+sDirection){
				tmpImg=this.idImg+'_walking'+sDirection;
			
			}else{
				tmpImg=this.idImg+'_walking2'+sDirection;
			}
			
			this.stopSound();
			this.tmpIdImg=tmpImg;
		}else if(action=='dead'){
			this.playSound('dead',this.action);
			return;
		}else if(action=='stand'){
			tmpImg=this.idImg;
		}
		
		oImages.drawImageOnLayer(tmpImg,(this.x*widthCase),(this.y*heightCase),widthCase-2,widthCase-2,'perso');
		
		oLayer_perso.fillRect(this.x*widthCase,(this.y*heightCase),4,4,this.team);
		
		this.action=action;
		
		oGame.savePerso(this);*/
	},
	//broadcast
	buildBroadcast:function(){
		socket.emit('Perso.buildBroadcast',this.id,this.x,this.y);
	},
	build:function(){
		
		
		var sDirection=oGame.tDirection[this.team];
			
		if(sDirection==''){
			tmpImg=this.idImg;
		}else if(this.tmpIdImg==this.idImg+'_walking2'+sDirection){
			tmpImg=this.idImg+'_walking'+sDirection;
		
		}else{
			tmpImg=this.idImg+'_walking2'+sDirection;
		}
		this.tmpIdImg=tmpImg;
		
		//partie affichage de l'image de l'unité sur le canvas
		oImages.drawImageOnLayer(tmpImg,(this.x*widthCase)-20,(this.y*heightCase)-50,widthCase*2,widthCase*2,'perso');
		
		oLayer_perso.fillRect((this.x*widthCase),(this.y*heightCase)-25,8,8,this.team);
		
		
		
		//on enregistre les nouvelles coordonnées de l'unité
		oGame.savePerso(this);
		
	},

	clear:function(){
		oGame.clearPerso(this);
		oLayer_perso.clearRect( (this.x*widthCase)-20,(this.y*heightCase)-40,widthCase*2,heightCase*2);
		
	},
	
};

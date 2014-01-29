var widthCase=40;
var heightCase=40;

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
	},
	//broadcast
	buildBroadcast:function(){
		socket.emit('Perso.buildBroadcast',this.id,this.x,this.y);
	},
	build:function(){
		
		
		var sDirection=oGame.tDirection[this.team];
		
		//si pas de direction, on affiche l'image statique	
		if(sDirection==''){
			tmpImg=this.idImg;
		//si l'image précédente était marche 2, on affiche marche 1
		}else if(this.tmpIdImg==this.idImg+'_walking2'+sDirection){
			tmpImg=this.idImg+'_walking'+sDirection;
		//sino on affiche la marche 2
		}else{
			tmpImg=this.idImg+'_walking2'+sDirection;
		}
		this.tmpIdImg=tmpImg;
		
		//partie affichage de l'image du personnage sur le canvas
		oImages.drawImageOnLayer(tmpImg,(this.x*widthCase),(this.y*heightCase)-10,widthCase,widthCase,'perso');
		//oLayer_perso.fillRect((this.x*widthCase),(this.y*heightCase),widthCase,widthCase,this.team);
		
		//on affiche ici un carré représentant la couleur de la team
		oLayer_perso.fillRect((this.x*widthCase),(this.y*heightCase)-25,8,8,this.team);
		
		//on enregistre les nouvelles coordonnées du joueur
		oGame.savePerso(this);
		
	},

	clear:function(){
		//oGame.clearPerso(this);
		//oLayer_perso.clearRect( (this.x*widthCase)-20,(this.y*heightCase)-40,widthCase*2,heightCase*2);
		
	},
	
};


module.exports=Perso;

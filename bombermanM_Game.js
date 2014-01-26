//Game
function Game(){
	//tableau de coordonnées des persos
	this.tCoordPerso=Array();
	//tableau de corrdonnées des bombes
	this.tCoordBomb=Array();
	
	this.tBomb=Array();
	//idem pour les persos
	this.tPerso=Array();
	
	this.keyLeft=0;
	this.keyUp=0;
	this.keyDown=0;
	this.keyRight=0;
	
	this.team='';
    
    var tTeam=Array('blue','red','green','yellow');
    
    this.bSound=1;
    
    this.oSound;
    
    this.tDirection=Array();
    this.tDirection['blue']='';
    this.tDirection['red']='';
    this.tDirection['green']='';
    this.tDirection['yellow']='';
    
    socket=io.connect('http://localhost:1338');
    
	socket.on('Game.createPerso',function(id, team,name,x,y){
		var oPerso=new Perso(name,team);
		oPerso.x=x;
		oPerso.y=y;
		oPerso.id=id;
		oPerso.build();
				
		oGame.tPerso.push(oPerso);
	});
	socket.on('Game.removePersoById',function(id){
		var oPerso=oGame.getPersoById(id);
		if(oPerso){
			oPerso.clear();
		}
	});
	socket.on('Game.removeBombById',function(id){
		var oBomb=oGame.getBombById(id);
		if(oBomb){
			oBomb.clear();
		}
	});
	socket.on('Perso.build',function(id,x,y){
		var oPerso=oGame.getPersoById(id);
		oPerso.clear();
		oPerso.x=x;
		oPerso.y=y;
		oPerso.build();
	});
	socket.on('Perso.animate',function(id,action){
		var oPerso=oGame.getPersoById(id);
		oPerso.animate(action);
	});
	
	socket.on('Bomb.build',function(id,x,y){
		var oBomb=oGame.getBombById(id);
		oBomb.clear();
		oBomb.x=x;
		oBomb.y=y;
		oBomb.build();
	});
	socket.on('Bomb.animate',function(id,action){
		var oBomb=oGame.getBombById(id);
		if(oBomb){
			oBomb.animate(action);
		}
	});
	socket.on('Game.setTeamDirection',function(team,direction){
		oGame.setTeamDirection(team,direction);
	});
	
	socket.on('Game.createBomb',function(id,team,name,x,y){
		var oBomb=new Bomb(name,team);
		oBomb.x=x;
		oBomb.y=y;
		oBomb.id=id;
		oBomb.build();
		
		oGame.tBomb.push(oBomb);
		
	});
	
	
	
    
}
Game.prototype={
	setTeam:function(team){
		this.team=team;
				
		if(team=='blue'){
			setTimeout(run,fps);
		}
		
		getById('team').style.display='none';
				
		map.build();
		this.refresh();
	},
	refresh:function(){
		//on raffraichit les persos
		oGame.refreshPerso();
		//et les bombes
		oGame.refreshBomb();
	},
	getPersoById:function(id){
		for(var i=0;i< this.tPerso.length;i++){
			if(this.tPerso[i].id==id){
				return this.tPerso[i];
			}
		}
	},
	getPersoByTeam:function(team){
		for(var i=0;i< this.tPerso.length;i++){
			if(this.tPerso[i].team==team){
				return this.tPerso[i];
			}
		}
	},
	getBombById:function(id){
		for(var i=0;i< this.tBomb.length;i++){
			if(this.tBomb[i].id==id){
				return this.tBomb[i];
			}
		}
	},
	createBombBroadcast:function(team,name,x,y){
		console.log('socket create bomb'+team+' '+name+' x:'+x+' y:'+y);
		socket.emit('Game.createBombBroadcast',team,name,x,y);
	},
	switchSound:function(object){
		if(object.checked){
			this.enableSound();
		}else{
			this.disableSound();
		}
	},
	enableSound:function(){
		this.bSound=1;
	},
	disableSound:function(){
		this.bSound=0;
	},
	checkCoord:function(x,y){
		y=parseInt(y+0);
		x=parseInt(x+0);
		if(this.tCoordBomb[ y ] && this.tCoordBomb[ y ][ x ] && this.tCoordBomb[ y ][ x ]!=''){
			console.log('not libre tCoordBomb[ '+y+' ][ '+x+' ]');
			return false;
		}
		
		if(this.tCoordPerso[ y ] && this.tCoordPerso[ y ][ x ] && this.tCoordPerso[ y ][ x ]!=''){
			console.log('not libre tCoordPerso[ '+y+' ][ '+x+' ]');
			return false;
		}
		
		if(map.tMap[y] && map.tMap[y][x] && map.tMap[y][x]==1){
		
			return true;
			
		}
		return false;

	},
	isWalkable:function(x,y){
		if(this.tCoordBomb[y] && this.tCoordBomb[y][x] && this.tCoordBomb[y][x]!=''){
			return false;
		}
		
		if(this.tCoordPerso[y] && this.tCoordPerso[y][x] && this.tCoordPerso[y][x]!=''){
			return false;
		}
		return true;
	},
	resetKeys:function(){
		this.setTeamDirectionBroadcast('');
	},
	eventKeyDown:function(e){
		var touche = e.keyCode;

		this.resetKeys();
		if(touche==37){
			this.setTeamDirectionBroadcast('left');
		}
		if(touche==38){
			this.setTeamDirectionBroadcast('up');
		}
		if(touche==39){
			this.setTeamDirectionBroadcast('right');
		}
		if(touche==40){
			this.setTeamDirectionBroadcast('down');
		}
		
		if(touche==32){ //espace
			console.log('depot bombe');
			//boucle perso pour savoir ou creer la bombe
			var oPerso=this.getPersoByTeam(this.team);
				
			this.createBombBroadcast(oPerso.team,'normal',oPerso.getX(),oPerso.getY());
				
		}
	},
	setTeamDirection:function(sTeam,sDirection){
		this.tDirection[sTeam]=sDirection;
	},
	setTeamDirectionBroadcast:function(sDirection){
		socket.emit('Game.setTeamDirectionBroadcast',this.team,sDirection);
	},
	eventKeyUp:function(e){
		this.resetKeys();
	},
	saveBomb:function(oBomb){
        //on recupere les coordonnées du batiment 
        var y=parseInt(oBomb.y);
        var x=parseInt(oBomb.x);
            
		//on enregistre dans un tableau indexé
		//les nouvelles coordonnées
		if(!this.tCoordBomb[y]){
			this.tCoordBomb[y]=Array();
		}

		this.tCoordBomb[y][x]=oBomb;
		
		
	},
	clearBomb:function(oBomb){
		var y=oBomb.y;
		var x=oBomb.x;
		
		this.tCoordBomb[y][x]='';
	},
	removeBomb:function(oBomb){
		var tBombTmp=Array();
		for(var i=0;i<this.tBomb.length;i++){
			if(this.tBomb[i].x != oBomb.x || this.tBomb[i].y != oBomb.y){
				tBombTmp.push(this.tBomb[i]);
			}
		}
		this.tBomb=tBombTmp;
		
		this.tCoordBomb[oBomb.y][oBomb.x]='';
	},
	getBomb:function(x,y){
		y=parseInt(y);
		x=parseInt(x);
		
		if(this.tCoordBomb[y] &&  this.tCoordBomb[y][x]){
			return this.tCoordBomb[y][x];
		}
		return null;
	},
	clearPerso:function(oPerso){
		
		var y=oPerso.getY();
		var x=oPerso.getX();
		
		if(!this.tCoordPerso[y]){ return; }
		
		this.tCoordPerso[y][x]='';
		
	},
	removeBroadcastBombById:function(id){
		socket.emit('Game.removeBroadcastBombById',id);
	},
	removeBroadcastPersoById:function(id){
		socket.emit('Game.removeBroadcastPersoById',id);
	},
	removePerso:function(oPerso){
		var tPersoTmp=Array();
		for(var i=0;i<this.tPerso.length;i++){
			if(this.tPerso[i].getX() != oPerso.getX() || this.tPerso[i].getY() != oPerso.getY()){
				tPersoTmp.push(this.tPerso[i]);
			}
		}
		this.tPerso=tPersoTmp;
		
		this.tCoordPerso[oPerso.getY()][oPerso.getX()]='';
	},
	savePerso:function(oPerso){
		//on recupere les coordonnées de l'unité
		var y=oPerso.getY();
		var x=oPerso.getX();
		
		//on enregistre dans un tableau indexé
		//les nouvelles coordonnées
		if(!this.tCoordPerso[y]){
			this.tCoordPerso[y]=Array();
		}
		this.tCoordPerso[y][x]=oPerso;
				
	},
	getPerso:function(x,y){
		//console.log('search x:'+x+' '+y);
		if(this.tCoordPerso[y] &&  this.tCoordPerso[y][x]){
			return this.tCoordPerso[y][x];
		}
		return null;
	},
	
	refreshBomb:function(){
            
		for(var i=0;i< this.tBomb.length;i++){
			var oBomb= this.tBomb[i];
			if(oBomb.life < 14){
				//pendant 14 iterations, on va alterner entre deux sprites
				if(oBomb.life % 2 ){
				oBomb.idImg='bomb-0';
				}else{
				oBomb.idImg='bomb-1';
				}	
			}else if(oBomb.life < 17){
				//puis animation d'explosion
				if(oBomb.life % 2 ){
					oBomb.idImg='explosion';
				}else{
					oBomb.idImg='explosion-1';
				}
			}else if(oBomb.life < 19){
				oBomb.idImg='explosion-2';
			}else{
				oBomb.idImg='explosion-finish';
				
			}
			
			oBomb.life++;
			
			//on broadcast l'animation de la bombe
			oBomb.animateBroadcast(oBomb.idImg);
		}
                
	},
	refreshPerso:function(){
		
		//on boucle sur les persos existants
		for(var i=0;i< this.tPerso.length;i++){
			var oPerso= this.tPerso[i];
			if(oPerso.life <=0){ continue;}
			
				var vitesse=0.5;
				
				if(!this.tDirection[oPerso.team]){
					continue;
				}
				
				var sDirection=this.tDirection[oPerso.team];
				
				//on efface le dessin sur le calques
				oPerso.clear();
				
				//on initialise les nouvelles coordonnées
				var newX=oPerso.x;
				var newY=oPerso.y;
				var newXcheck=oPerso.getX();
				var newYcheck=oPerso.getY();
				
				
				if(newY != parseInt(newY)){
					//si entre deux cases, on ne peut pas descendre/monter
				}else if(sDirection=='right'){
					newX+=vitesse;
					newXcheck+=1;
				}else if(sDirection=='left'){
					newX-=vitesse;
					newXcheck-=1;
				}
				if(newX != parseInt(newX)){
					//si entre deux cases, on ne peut pas descendre/monter
				}else if(sDirection=='up'){
					newY-=vitesse;
					newYcheck-=1;
				}else if(sDirection=='down'){
					newY+=vitesse;
					newYcheck+=1;
				}
				
				if(this.checkCoord(newXcheck,newYcheck)){
					//si les coordonnées est libre
					oPerso.x=newX;
					oPerso.y=newY;
					
				}
				
				//on dessine le personnage
				oPerso.buildBroadcast('walking');
				
			
		}
		
		
	},
        
        
};

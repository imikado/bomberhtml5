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
    
    socket=io.connect('http://pnxt06:1338');
    
	socket.on('Game.createPerso',function(id, team,name,x,y){
		console.log('createPerso id:'+id + 'team : '+team);
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
		console.log('get perso by id '+id);
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
	
	socket.on('Game.createBomb',function(id,team,name,x,y){
		var oBomb=new Bomb(name,team);
		oBomb.x=x;
		oBomb.y=y;
		oBomb.id=id;
		oBomb.build();
		
		oGame.tBomb.push(oBomb);
		
	});
	
	socket.on('Game.setTeamDirection',function(team,sDirection){
		oGame.setTeamDirection(team,sDirection);
	});
	
	socket.on('Game.listTeam',function(tTeamConnected){
		
		for(var i=0;i<tTeam.length;i++){
			var a=getById('button-'+tTeam[i]);
			if(a){
				a.style.display='block';
			}
		}
		
		for(var i=0;i< tTeamConnected.length;i++){
			console.log('desactivation '+tTeamConnected[i]);
			var a=getById('button-'+tTeamConnected[i]);
			if(a){
				console.log('desactivation btn "'+ 'btn-'+tTeamConnected[i]);
				a.style.display='none';
			}else{
				console.log('trouve pas  btn "'+ 'btn-'+tTeamConnected[i]);
			}
		}
		
	});
	
	
    
}
Game.prototype={
	setTeam:function(team){
		this.team=team;
		
		getById('team').style.display='none';
				
		map.build();
		
		socket.emit('setTeamBroadcast',team);
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
	createBombBroadcast:function(team){
		console.log('socket create bomb'+team);
		socket.emit('Game.createBombBroadcast',team);
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
	resetKeys:function(){
		this.setTeamDirectionBroadcast('');
	},
	eventKeyDown:function(e){
		var touche = e.keyCode;

		//this.resetKeys();
		
		if(touche==32){ //espace
			console.log('depot bombe');	
			this.createBombBroadcast();
							
		}else	if(touche==37){
			this.setTeamDirectionBroadcast('left');
		}else	if(touche==38){
			this.setTeamDirectionBroadcast('up');
		}else if(touche==39){
			this.setTeamDirectionBroadcast('right');
		}else if(touche==40){
			this.setTeamDirectionBroadcast('down');
		}
		
		
	},
	setTeamDirection:function(sTeam,sDirection){
		this.tDirection[sTeam]=sDirection;
	},
	setTeamDirectionBroadcast:function(sDirection){
		socket.emit('Game.setTeamDirectionBroadcast',this.team,sDirection);
	},
	eventKeyUp:function(e){
		var touche = e.keyCode;
		if(touche!=32){
			this.setTeamDirectionBroadcast('');
		}
	},
	getBomb:function(x,y){
		y=parseInt(y);
		x=parseInt(x);
		
		if(this.tCoordBomb[y] &&  this.tCoordBomb[y][x]){
			return this.tCoordBomb[y][x];
		}
		return null;
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
	getPerso:function(x,y){
		//console.log('search x:'+x+' '+y);
		if(this.tCoordPerso[y] &&  this.tCoordPerso[y][x]){
			return this.tCoordPerso[y][x];
		}
		return null;
	},
	
        
        
};

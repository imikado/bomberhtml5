var http = require('http');

httpServer=http.createServer(function(req,res){
});

httpServer.listen(1338);

var io=require('socket.io').listen(httpServer,{ log: true });

var iId=0;

var tPerso=Array();
var tBomb=Array();

var tTeamConnected=Array();
var tSocket=Array();
var canvas;
var game;
var map;
var oGame;
var oImages;
var oSound;
var Perso=require('./bombermanM_PersoB.js');

var Game=require('./bombermanM_GameB.js');
var Map=require('./bombermanM_MapB.js');
var Bomb=require('./bombermanM_BombB.js');


var currentX=0;
var currentY=0;

var widthCase=40;
var heightCase=40;

var maxX=22;
var maxY=17;

var oLayer_map;
var oLayer_perso;
var oLayer_bomb;

var fps=200;

var socket; 

function newGame(){
	
	iId=0;
	
	tBomb=Array();
	tPerso=Array();

	//blue
	oData=new Perso('perso','blue');
	oData.team='blue';
	oData.x=1;
	oData.y=1;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//red
	oData=new Perso('perso','red');
	oData.team='red';
	oData.x=19;
	oData.y=1;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//green
	oData=new Perso('perso','green');
	oData.team='green';
	oData.x=19;
	oData.y=15;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//yellow
	oData=new Perso('perso','yellow');
	oData.team='yellow';
	oData.x=1;
	oData.y=15;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	oGame=new Game;
	
	map = new Map();
	
	for(var i=0;i<tPerso.length;i++){
		oGame.tPerso.push(tPerso[i]);
	}
	
	run();
}


function run(){
	oGame.refresh();
	setTimeout(run,fps);
	
}


function Data(){
	this.team;
	this.name;
	this.id;
	this.x;
	this.y;
};
Data.prototype={
	
};

function getPersoById(id){
	for(var i=0;i<tPerso.length;i++){
		if(tPerso[i].id==id){
			return i;
		}
	}
}
function getBombById(id){
	for(var i=0;i<tBomb.length;i++){
		if(tBomb[i].id==id){
			return tBomb[i];
		}
	}
}

function getTeamConnected(){
	var tTeamConnectedB=Array();
	for(var i=0;i< tColor.length;i++){
		if(tTeamConnected[tColor[i]]==1){
			tTeamConnectedB.push(tColor[i]);
		}
	}
	return tTeamConnectedB;
}


var tColor=Array('blue','red','green','yellow');

newGame();

io.sockets.on('connection', function(socket){
	
	oGame.socket=socket;
	//console.log('connected ');
	
	socket.on('connected',function(team){
		for(var i=0;i< tBomb.length;i++){
			socket.emit('Game.createBomb',tBomb[i].id,tBomb[i].team,'normal',tBomb[i].x,tBomb[i].y);
		}
		for(var i=0;i< tPerso.length;i++){
			socket.emit('Game.createPerso',tPerso[i].id,tPerso[i].team,'john',tPerso[i].x,tPerso[i].y);
		}
		
		var tTeamConnectedB=getTeamConnected();
		
		socket.emit('Game.listTeam',tTeamConnectedB);
	});
	
	
	
	socket.on('setTeamBroadcast',function(team){
		tTeamConnected[team]=1;
		tSocket[socket.id]=team;
		
		var tTeamConnectedB=getTeamConnected();
		
		socket.broadcast.emit('Game.listTeam',tTeamConnectedB);
	});
	
	socket.on('newGame',function(){
		newGame();
	});
	
	socket.on('Game.setTeamDirectionBroadcast',function( team,sDirection){
		
		oGame.setTeamDirection(team,sDirection);
		
		socket.broadcast.emit('Game.setTeamDirection',team,sDirection);
		socket.emit('Game.setTeamDirection',team,sDirection);
	});
	
	socket.on('Game.createBombBroadcast',function(team){
		
		console.log('recup perso by team: '+tSocket[socket.id]);
		var oPerso=oGame.getPersoByTeam(tSocket[socket.id]);
		
		var name='normal';
		
		var oBomb=new Bomb(name,team);
		oBomb.id=iId;
		oBomb.x=oPerso.getX();
		oBomb.y=oPerso.getY();
		
		iId++;
		
		socket.emit('Game.createBomb',oBomb.id,oBomb.team,oBomb.name,oBomb.x,oBomb.y);
		socket.broadcast.emit('Game.createBomb',oBomb.id,oBomb.team,oBomb.name,oBomb.x,oBomb.y);
		
		oGame.tBomb.push(oBomb);
		
		
	});
	
	socket.on('Perso.buildBroadcast',function(id,x,y){
		var i=getPersoById(id);
		if(!tPerso[i]){ return; }
		tPerso[i].x=x;
		tPerso[i].y=y;
		socket.broadcast.emit('Perso.build',id,x,y);
		socket.emit('Perso.build',id,x,y);
		
	});
	
	socket.on('Perso.animateBroadcast',function(id,action){
		socket.broadcast.emit('Perso.animate',id,action);
		socket.emit('Perso.animate',id,action);
	});
	
	
	socket.on('Bomb.animateBroadcast',function(id,action){
		socket.broadcast.emit('Bomb.animate',id,action);
		socket.emit('Bomb.animate',id,action);
	});
	
	socket.on('Game.removeBroadcastPersoById',function(id){
		var tTmp=Array();
		for(var i=0;i<tPerso.length;i++){
			if(tPerso[i].id!=id){
				tTmp.push(tPerso[i]);
			}
		}
		tPerso=tTmp;
		
		socket.broadcast.emit('Game.removePersoById',id);
		socket.emit('Game.removePersoById',id);
	});
	
	socket.on('Game.removeBroadcastBombById',function(id){
		var tTmp=Array();
		for(var i=0;i<tBomb.length;i++){
			if(tBomb[i].id!=id){
				tTmp.push(tBomb[i]);
			}
		}
		oGame.tBomb=tTmp;
		
		socket.broadcast.emit('Game.removeBombById',id);
		socket.emit('Game.removeBombById',id);
	});
	
	
	socket.on('disconnect', function () {
		tTeamConnected[ tSocket[socket.id] ]=0;
		
		var tTeamConnectedB=getTeamConnected();
		
		socket.emit('Game.listTeam',tTeamConnectedB);
		socket.broadcast.emit('Game.listTeam',tTeamConnectedB);
	});
	
});

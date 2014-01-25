var http = require('http');

httpServer=http.createServer(function(req,res){
});

httpServer.listen(1338);

var io=require('socket.io').listen(httpServer);

var iId=0;

var tPerso=Array();
var tBomb=Array();

function newGame(){
	
	iId=0;
	
	tBomb=Array();
	tPerso=Array();

	//blue
	oData=new Data();
	oData.team='blue';
	oData.x=1;
	oData.y=1;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//red
	oData=new Data();
	oData.team='red';
	oData.x=19;
	oData.y=1;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//green
	oData=new Data();
	oData.team='green';
	oData.x=19;
	oData.y=15;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

	//yellow
	oData=new Data();
	oData.team='yellow';
	oData.x=1;
	oData.y=15;
	oData.id=iId;
	tPerso.push(oData);

	iId++;

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


var tColor=Array('blue','red','green','yellow');

newGame();

io.sockets.on('connection', function(socket){
	
	
	
	console.log('connected ');
	
	socket.on('connected',function(team){
		for(var i=0;i< tBomb.length;i++){
			socket.emit('Game.createBomb',tBomb[i].id,tBomb[i].team,'normal',tBomb[i].x,tBomb[i].y);
		}

		for(var i=0;i< tPerso.length;i++){
			console.log('broadcast createPerso team:'+tPerso[i].team+' x:'+tPerso[i].x+' y:'+tPerso[i].y);
			socket.emit('Game.createPerso',tPerso[i].id,tPerso[i].team,'john',tPerso[i].x,tPerso[i].y);
		}
	});
	
	socket.on('newGame',function(){
		newGame();
	});
	
	socket.on('Game.setTeamDirectionBroadcast',function( team,sDirection){
		socket.broadcast.emit('Game.setTeamDirection',team,sDirection);
		socket.emit('Game.setTeamDirection',team,sDirection);
	});
	
	socket.on('Game.createBombBroadcast',function(team,name,x,y){
		
		var oBomb=new Data;
		oBomb.id=iId;
		oBomb.team=team;
		oBomb.name=name;
		oBomb.x=x;
		oBomb.y=y;
		
		iId++;
		
		socket.emit('Game.createBomb',oBomb.id,oBomb.team,oBomb.name,oBomb.x,oBomb.y);
		socket.broadcast.emit('Game.createBomb',oBomb.id,oBomb.team,oBomb.name,oBomb.x,oBomb.y);
		
		tBomb.push(oBomb);
		
		
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
		tBomb=tTmp;
		
		socket.broadcast.emit('Game.removeBombById',id);
		socket.emit('Game.removeBombById',id);
	});
	
	
	socket.on('disconnect', function () {
		io.sockets.emit('user disconnected');
	});
	
});

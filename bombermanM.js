var canvas;
var game;
var map;
var oGame;
var oImages;
var oSound;

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


function Images(){
	this.tOImg=new Array();
	this.tDetail=new Array();
	this.counter=0;
        this.total=0;
	this.tSrc=Array();
}
Images.prototype={
	add:function(src,idImg){
	    this.tSrc[this.total]=Array();
	    this.tSrc[this.total]['src']=src;
	    this.tSrc[this.total]['idImg']=idImg;
	    
	    this.total++;
	},
	load:function(){
	    
		for(var i=0;i< this.total;i++){
		    var idImg=this.tSrc[i]['idImg'];
		    
		    this.tOImg[idImg]=new Image();
		    this.tOImg[idImg].src=this.tSrc[i]['src'];
		    this.tOImg[idImg].onload=function(){
			    oImages.counter++;
			    preload2();
		    };
		    
		}		
	},
	setDetailOnId:function(id,y,x,width,height,idImg){
		this.tDetail[id]=new Array();
		this.tDetail[id]['x']=x;
		this.tDetail[id]['y']=y;
		this.tDetail[id]['width']=width;
		this.tDetail[id]['height']=height;
		this.tDetail[id]['idImg']=idImg;
	},
	drawImageOnLayer:function(id,x,y,width,height,sLayer){
		var oCanvasTmp;
		if(sLayer=='map'){
			oCanvasTmp=oLayer_map;
		}else if(sLayer=='perso'){
			oCanvasTmp=oLayer_perso;
		}else if(sLayer=='bomb'){
			oCanvasTmp=oLayer_bomb;
		}
		
		if(!this.tDetail[id]){
			console.log('id indefini '+id);
		}
		
		oCanvasTmp.drawImage2(this.tOImg[ this.tDetail[id]['idImg'] ],this.tDetail[id]['x'],this.tDetail[id]['y'],this.tDetail[id]['width'],this.tDetail[id]['height'],x,y,width,height);
		
	}
};

function preload(){
	
	
    oSound=new Sound();
        
	oImages=new Images();
	
	var tDetailTmp=new Array();
	tDetailTmp=[
		['bomb-ground','bomb-wall'],
		[
			'perso',
			
			'perso-attack',
			
			'perso_walkingright',
			'perso_walking2right',
			
			'perso_walkingleft',
			'perso_walking2left',
			
			'perso_walkingdown',
			'perso_walking2down',
			
			'perso_walkingup',
			'perso_walking2up'
			
		],
		[
			'bomb-0',
			'bomb-1',
			'bomb-2',
		],
		[
			'explosion',
		],
		
		
	];
	for(var y=0;y<tDetailTmp.length;y++){
		for(var x=0;x<tDetailTmp[y].length;x++){
			oImages.setDetailOnId(tDetailTmp[y][x],y*40,x*40,40,40,'1x1');
		}
	}
	
	oImages.add('img3/bomberman1x1.png','1x1');
	
	
	//oSound.add('img3/attack.mp3','attack');

	oImages.load();
	
	oSound.load();
}

function preload2(){
	
	if(oImages.counter < oImages.total){
		console.log('pas fini de charger images :'+oImages.counter+'/'+oImages.total);
		return;
	}
        
	if(oSound.counter < oSound.total){
		console.log('pas fini de charger sons :'+oSound.counter+'/'+oSound.total);
		//return;
		
	}
	
	
	
	oLayer_map=new Canvas('layer_map');
	oLayer_perso=new Canvas('layer_perso');
	oLayer_bomb=new Canvas('layer_bomb');	
	
	
	oGame=new Game();
	map = new Map();
	map.build();
	
	document.body.onkeyup=function (event){
		oGame.eventKeyUp(event);
	};
	
	setTimeout(load,1000);
}


function load(){
	socket.emit('connected');
	
	//on cache la div de chargement
	getById('loading').style.display='none';
	
	getById('team').style.display='block';
	
	//on construit la map, l'apercu 
	//et le cadre d'information de la map affichée	 
	map.build(); 
	
	//on affiche les batiments sur la carte
	oGame.rebuild();
	
}

var iRefreshBuild=0;
function run(){  
	
	//on raffraichit les persos et les bombes
	oGame.refresh();
	
	
	//dans N secondes on appelera de nouveau cette fonction 
	setTimeout(run,fps);
}






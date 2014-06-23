// JavaScript Document
var possPosX = 0;
var possPosY = 0;
function charMove(x,y){
	possPosX = cowPos[0] + x;
	possPosY = cowPos[1] + y;
	
	var objName = 'y' + possPosY + 'x' + possPosX;
	if((map[possPosY] == undefined) || (map[possPosY][possPosX] == undefined) || (map[possPosY][possPosX] == 17) || (overlay[objName] != undefined) && (overlay[objName][0] == 00)){
		alert('you cannot go there');
	} else {
		
		if(overlay[objName] != undefined){
			cowPos[0] = possPosX;
			cowPos[1] = possPosY;
			drawEnemies2();
			
			runTileCode(overlay[objName]);
			
		}
		cowPos[0] = possPosX;
		cowPos[1] = possPosY;
		
		if( ((xpos + ((chars[0][2][1] * 64) + (chars[0][2][0] * 64))) > (($('#gameScreen').width() / 2 - 128) + 300)) 
		|| ((xpos + ((chars[0][2][1] * 64) + (chars[0][2][0] * 64))) < (($('#gameScreen').width() / 2 - 128) - 300)) 
		|| ((ypos - ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)))) > (($('#gameScreen').height() / 2 - 128) + 300)) 
		|| ((ypos - ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)))) < (($('#gameScreen').height() / 2 - 128) - 300)) ){
			/*
			xpos = ypos = 0;
			xpos -= (cowPos[1] * 64) + (cowPos[0] * 64);
			ypos += ((cowPos[0] * 32) + (cowPos[1] * (-32)));
			xpos += ($('#gameScreen').width() / 2 - 128);
			ypos += ($('#gameScreen').height() / 2 - 64);
			*/
			
			getMap();
		}
		
	}
	drawEnemies2();
}

function draw(){
	var ctx = document.getElementById('screen').getContext('2d');
	ctx.clearRect(0,0,$('#gameScreen').width(),$('#gameScreen').height());
	
	var ovr = document.getElementById('objscreen').getContext('2d');
	ovr.clearRect(0,0,$('#gameScreen').width(),$('#gameScreen').height());
	
	var cursorH = xpos;
	var cursorV = ypos-64;
	
	var mapPrint = new Object();
		for(var r in map){
			
			
				cursorV = cursorV + 32;
			
			eval("mapPrint.row"+r+"=new Object()");
			for(var i in map[r]){
				var tile = new Image();
				tile.src = tileSrc[map[r][i]];
				
				
				ctx.drawImage(tile,cursorH,cursorV);
				
				var objName = 'x' + i + 'y' + r;
				if((overlay[r] != undefined) && (overlay[r][i] != undefined)){
					var tileOverlay = new Image();
					tileOverlay.src = overlay[r][i][1];
					
					ovr.drawImage(tileOverlay,cursorH,cursorV);
				}
				
				
				cursorH += 64;
				cursorV += -32;
				
				
			}
			
			cursorH = cursorH - (map[1].length * 64) + 64;
			cursorV = cursorV - (map[1].length * -32);
		}
	firstDraw();
}








function drawEnemies(){
	var cursorH = xpos;
	var cursorV = ypos-64;
	
	var overlayHtml = '';
	for(var r in map){
		
			
			
			cursorV = cursorV + 32;
			
			for(var i in map[r]){
				if(overlay[r] != undefined){
					if(overlay[r][i]!=undefined){
						for(var o in overlay[r][i]){
							/*
							var tile = new Image();
							tile.src = tileSrc[overlay[r][i][o]];
							cow = ctx.drawImage(tile,cursorH,cursorV);
							*/
							overlayHtml = overlayHtml + '<div id="cow" style="width:128px;height:64px;position:absolute;top:'+ cursorV +'px;left:'+ cursorH +'px;background-image:url('+ tileSrc[overlay[r][i][o]] +');background-repeat:no-repeat;"></div>';
							
						}
					}
				}
				cursorH += 64;
				cursorV += -32;
			}
			
			cursorH = cursorH - (map[1].length * 64) + 64;
			cursorV = cursorV - (map[1].length * -32);
	}
	$('#overlay').html(overlayHtml);
}
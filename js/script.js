// JavaScript Document


var xpos = 0;
var ypos = 0;
var evenOddToggle = 'o';
var mapID = '0';


// Common declrations
var tileSrc = new Array();
var map = new Array();
var overlay = new Object();
var chars = new Array();


//Get map function, should be called before every draw()
function getMap(command){
	$.post("map.php", command,
		 function(data){
		 //load data.map into the map array
		map = data.map;
		 //load data.overlay into the overlay object
  		overlay = data.overlay;
		 //load data.tileSrc into the tile array
		tileSrc = data.tileSrc;
		 //load data.character;
		chars = data.chars;
		mapid = data.mapid;

		xpos = ypos = 0;
		xpos -= (chars[0][2][1] * 64) + (chars[0][2][0] * 64);
		ypos += ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)));
		xpos += ($('#gameScreen').width() / 2 - 128);
		ypos += ($('#gameScreen').height() / 2 - 64);
		 //Redraw the map
                
                 window.setTimeout(function(){
                  draw();  
                 },3000);
                /*
                        var onLoadCount = $("img","#preloader").length;
                      var count = 0;
                      $("img","#preloader").bind("load",function(){
                            count++;
                            if( count === onLoadCount ){

                            }
                      });
            */
            }, "json");

}

// temp overlay map
// Overlay object types
// 00 = wall
// 01 = death pit
// 02 = teleporter
// 03 = intramap teleport
var teleport1 = [7,19];



function gameAlert(text){
	$('#alertBox').html(text);
	$('#alertBox').fadeIn(500);
	$('#alertBox').fadeOut(1000);
}
function gameWin(){
	$('#winBox').html('Mmmm! Finally some tasty silage!<br /> <img src="images/happycow.jpg" /> <br /><a href="index.html">Play again?</a>');
	$('#winBox').fadeIn(500);
}

function runTileCode(object){
	//Wall action is already set

	// 01 Death Pit. For the test, death pits will alert the user and return the character home.
	if(object[0] == 01){
		gameAlert('You died, are you suicidal?');
		possPosX = 0;
		possPosY = 0;
	}
	// Teleporters pull item 3 from the object array. Item 4 is an array as [x,y] map locations to the destination.
	if(object[0] == 02 ){
		gameAlert(object[4]);
		possPosX = object[3][0];
		possPosY = object[3][1];
	}
	// Intramap teleporter object[5]
	if(object[0] == 03){

	}
	alert('tile code ran for ' + object[2]);
}

//This is the death event.
function death(x,y){
	//For now, we will animate the character moving onto the space then send the character to position 0,0.
	chars[0][2] = [x,y];
	drawEnemies2();
	chars[0][2] = [0,0];
	drawEnemies2();
}


function draw(){
        $('#loading').show();
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

				if( ($('#gameScreen').width() > cursorH ) && (-128 < cursorH) && ($('#gameScreen').height() > cursorV) && (-64 < cursorV)){
                                    ctx.drawImage(tile,cursorH,cursorV);

                                    var objName = 'y' + r + 'x' + i;
                                    if( overlay[objName] != undefined){
                                            var tileOverlay = new Image();
                                            tileOverlay.src = tileSrc[overlay[objName][1]];

                                            ovr.drawImage(tileOverlay,cursorH,cursorV);
                                    }
                                }
				cursorH += 64;
				cursorV += -32;


			}

			cursorH = cursorH - (map[1].length * 64) + 64;
			cursorV = cursorV - (map[1].length * -32);
		}
	firstDraw();
}



function firstDraw(){
	var cursorH = xpos;
	var cursorV = ypos - 32;
	var overlayHtml = '';
	for(var e in chars){

		var exactposX = cursorH + (chars[e][2][0] * 64) + (chars[e][2][1] * 64);
		var exactposY = cursorV + ((chars[e][2][1] * 32) + (chars[e][2][0] * (-32)));

		overlayHtml = overlayHtml + '<div id="' + chars[e][3] + '" style="width:128px; height:64px; position:absolute; top:'+ exactposY +'px; left:'+ exactposX +'px; background-image:url('+ chars[e][1]['right'] +'); background-repeat:no-repeat;"></div>';

	}



	$('#overlay').html(overlayHtml);
        $('#loading').hide();

}

function drawEnemies2(){
	var cursorH = xpos;
	var cursorV = ypos - 32;

	for(var e in chars){

		var exactposX = cursorH + (chars[e][2][0] * 64) + (chars[e][2][1] * 64);
		var exactposY = cursorV + ((chars[e][2][1] * 32) + (chars[e][2][0] * (-32)));

		var exactposXstr = exactposX + 'px';
		var exactposYstr = exactposY + 'px';



		$('#' + chars[e][3]).animate({
		top: exactposYstr,
		left: exactposXstr
		},200);
	}


}

function charMoveB(x,y){
	//var charPosNew = new Array();
	//First we gotta request a move from the server.
	$.post("map.php", { "pos": 'TRUE', 'xpos': x, 'ypos': y, 'curx': chars[0][2][0], 'cury': chars[0][2][1], 'mapid': mapid},
		 function(data){
		 //The server will respond with the new X,Y data
		 //The sever will also respond with a code regarding the position, possibly with extra instructions such as loading a new map, or a teleport position, or other infromation.

		 //The position code, this will tell the client what to do next.
  		code = data.code;

		switch(code){
			case 100:
			//Code 100 is the most common, it will mean your character will move normally.
				 //Because the character can just move into the new spot, let's justgrab the new position data and call it a day.
				chars = data.chars;
				drawEnemies2();
			break;

			case 0:
			//This is a wall, you simply cannot move, for testing we have an alert regarding this but otherwise we could just do nothing.
			gameAlert('You cannot go here!');
			break;

			case 1:
			//This is an instant death, and will call a death event. HAHA!
				death();
			break;

			case 2:
			//This is a teleporter and will send you anywhere within the map
			break;

			case 3:
			//This is an intra-map teleporter, and will send you to a diffrent map
			break;

                        case 4:
			//This is an intra-map teleporter, and will send you to a diffrent map
                        chars = data.chars;
			drawEnemies2();
                        gameWin();
			break;
		}


		if( ((xpos + ((chars[0][2][1] * 64) + (chars[0][2][0] * 64))) > (($('#gameScreen').width() / 2 - 128) + ($('#gameScreen').width() / 2)))
		|| ((xpos + ((chars[0][2][1] * 64) + (chars[0][2][0] * 64))) < (($('#gameScreen').width() / 2 + 128) - ($('#gameScreen').width() / 2)))
		|| ((ypos - ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)))) > (($('#gameScreen').height() / 2 - 64) + ($('#gameScreen').height() / 2)))
		|| ((ypos - ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)))) < (($('#gameScreen').height() / 2 + 64) - ($('#gameScreen').height() / 2))) ){

                        xpos = ypos = 0;
			xpos -= ((chars[0][2][1] * 64) + (chars[0][2][0] * 64));
                        ypos += ((chars[0][2][0] * 32) + (chars[0][2][1] * (-32)));
                        xpos += ($('#gameScreen').width() / 2 - 128);
                        ypos += ($('#gameScreen').height() / 2 - 64);
                        //Redraw the map
                        draw();
		}



  		}, "json");
}



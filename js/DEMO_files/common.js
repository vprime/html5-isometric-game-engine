/* 
 * Commonly used classes
 * 
 *  draw : Functions for drawing the map and sprites.
 *  service : Functions for communicating with the server.
 *  
 */

// Game Core
var game = {
	init: function(){
		ui.showLoading();
		game.eventListeners();
		ui.init();
		draw.init();
	},
	
	eventListeners: function(){
		game.mergeKeyBindings( player );
		game.buildKeyBindingIndex();
		game.keyListener();
	},
	
	keyBinding: {},
	
	keyBindingIndex: {},
	
	buildKeyBindingIndex: function(){
		game.keyBindingIndex = {};
		
		for (var action in game.keyBinding){
			for (var key in game.keyBinding[action].key){
				game.keyBindingIndex[game.keyBinding[action].key[key]] = action;
			}
		}
	},
	
	mergeKeyBindings:function(object){
		for (var keyname in object.keyBinding ) {
			game.keyBinding[keyname] = object.keyBinding[keyname];
		}
	},
	
	keyListener: function(){
		$(document).keydown(function(event){
			var action = game.keyBindingIndex[event.keyCode];
			console.log(game.keyBindingIndex);
			console.log(action);
			game.keyBinding[action].run();
		});
	},
	
	codes: {
		100: function() {
			// No effect
		},
		00: function() {
			// Blocked
			ui.showAlert('I can\'t go there.');
		},
		01: function() {
			// Death
			ui.showAlert('You died');
		},
		02: function() {
			// Teleport
		},
		03: function() {
			// Change map
		},
		04: function() {
			// Game is won
			ui.showWin();
		},
	}
	
};


// User Interface
var ui = {
	init:function(){
		ui.eventListeners();
		ui.hideAlert();
		ui.hideWin();
	},
	
	eventListeners:function(){
		$('#blog').click(function(){
           browserWindow('http://blog.vincentprime.com/');
        });
	},
	
	updateBrowserMessage: 'Your browser does not support the HTML5 Canvas element. Please update your system, or download <a href="http://mozilla.com">Mozilla Firefox</a>.',
	
	browser:function(url){
		if ($('#browser').length == 0 ) {
			var browser = '<div id="browser"><div id="title">browser</div><div id="close-browser" class="close-button" onclick="$(\'#browser\').hide();">x</div><iframe src="' + url + '" /></div>';
			$('#gameScreen').after(browser);
		} else {
			$('#browser').show();
			$('#browser iframe').attr('src', url);
		}
	},
	
	showAlert:function(message){
		$('#alertBox').html(message);
		$('#alertBox').fadeIn(500);
		ui.hideAlert();
	},
	hideAlert:function(){
		$('#alertBox').fadeOut(1000);
	},
	
	showWin:function(){
		$('#winBox').html('Mmmm! Finally some tasty silage!');
		$('#wintBox').fadeIn(500);
	},
	hideWin:function(){
		$('#winBox').hide();
	},
	
	showLoading:function(){
		$('#loading').show();
	},
	hideLoading:function(){
		$('#loading').hide();
	},
};

// Player functions
var player = {
	keyBinding: {
		up:{
			description:'Move up',
			key:[38],
			run: function(){
				player.move.up();
			}
		},
		down:{
			description:'Move down',
			key:[40],
			run: function(){
				player.move.down();
			}
		},
		left:{
			description:'Move left',
			key:[37],
			run: function(){
				player.move.left();
			}
		},
		right:{
			description:'Move right',
			key:[39],
			run: function(){
				player.move.right();
			}
		},
	},
	
	move: {
		up: function(){
			player.movePlayer([0, -1]);
		},
		down: function(){
			player.movePlayer([0, 1]);
		},
		left: function(){
			player.movePlayer([-1, 0]);
		},
		right: function(){
			player.movePlayer([1, 0]);
		}
	},
	
	movePlayer: function(XY){
		service.getPlayerMove(sprite.characters[0][2], XY, draw.mapID, function(data){
			// Update the location data.
			sprite.characters = data.chars;
			
			// Run any special effects that are required for the position update.
			game.codes[data.code]();
		});
	},
};

// Sprite Functionality
var sprite = {
	characters: {
	},
};


// Drawing Functionality
var draw = {
	init: function(){
		draw.loadMapData();
		draw.autoRedraw();
	},
	
	autoRedraw: function(){
		draw['redrawProcess'] = setInterval(function(){
			draw.drawSprites();
		}, 200);
	},
	
	pauseRedraw: function(){
		clearInterval(draw.redrawProcess);
	},
	
	tiles: {
		height: 64,
		width: 128,
		source: {
			10:'images/tileset_10.png',
			17:'images/tileset_17.png',
			22:'images/tileset_22.png',
			23:'images/tileset_23.png',
			24:'images/tileset_24.png',
			25:'images/tileset_25.png',
			'wall1':'images/tileset_21.png',
			'pit':'images/tileset_07.png',
			'teleport':'images/tileset_02.png',
			
			//Character tiles
			'cow':{
				'up':'images/tileset_cow_03_left.png',
				'right':'images/tileset_cow_03.png',
				'down':'images/tileset_cow_03.png',
				'left':'images/tileset_cow_03_left.png'
			}
		},
	},
	mapLayer: {},
	objectLayer: {},
	mobLayer: {},
	mapID: 0,
	activeLayers:[
		'mapLayer',
	],
	spriteCache: {},
	
	viewportXY: [0,0],
	
	redraw: function(){
		draw.drawLayers();
	},
	
	drawLayers: function(){
		for( var layer in draw.activeLayers ){
			draw.drawLayer(draw.activeLayers[layer]);
		}
	},
	
    drawLayer: function(layer){
		/* Drawlayer draws the passed layer name.
		 * Layer is the element ID of the canvas element, 
		 * and it's the name of the location of which to find the layer in the draw object.
		 */
		//Show the loading screen.
		ui.showLoading();
		
		draw.pauseRedraw();
		
		console.log('refresh map');
		//Make a jquery selector
		var layerid = '#' + layer;
		
		// Gather the canvas size.
		var canvasWidth = $('#gameScreen').width();
		var canvasHeight = $('#gameScreen').height();

		//see if the layer exists
		if( $(layerid).length == 0 ){
			//if the layer dosen't exist, create it.
			var zindex = 'z-index:' + draw[layer].zindex + ';';
			var width = 'width:' + canvasWidth + 'px;';
			var height = 'height:' + canvasHeight + 'px;';
			var style = 'style="' + zindex + width + height + '"';
			var layerhtml = '<canvas id="' + layer + '"' + style +' width="'+ canvasWidth +'px" height="'+ canvasHeight +'px">'+ ui.updateBrowserMessage +'</canvas>';
			
			// Currently each layer must be added lowest first. We add the layer after the #obj element.
			$('#gameScreen').prepend(layerhtml);
		}
		
		// Form the context for drawing on the HTML5 canvas. 
		var ctx = document.getElementById(layer).getContext('2d');
		
		// Clear the board
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		
		// Set the cursor draw position.
		var cursorX = draw.viewportXY[0] - (draw.tiles.width/2);
		var cursorY = draw.viewportXY[1] - (draw.tiles.height/2);
		
		for(var row in draw[layer]){
			if ( row == 'zindex') {
				continue;
			}
			// Step the vertical position down 32 pixels to account for the new row.
			cursorY = cursorY + (draw.tiles.height/2);
			// Step the horizontal position across 64 pixel to account for the new row.
			//cursorX = cursorX + (draw.tiles.width/2);
			
			// block counter, get the number of blocks in this row starting from the last one.
			var block = draw[layer][row].length;
			
			// Move the cursor all the way to the end of the row. 
			cursorX += block * (draw.tiles.width/2);
			cursorY += block * ((draw.tiles.height/2) * -1);
			
			// Iterate through the available blocks
			while(block >= 0){
				
				// If the block isn't empty, then we'll print it.
				if (draw[layer][row][block] != 0){
					
					// Load the tile image location into draw memory.
					var tile = new Image();
					tile.src = draw.tiles.source[draw[layer][row][block-1]];
					
					// If the block is within the confines of our view, then draw it. 
					if( ( canvasWidth > cursorX ) && ((draw.tiles.width * -1) < cursorX) && ( canvasHeight > cursorY) && ((draw.tiles.height * -1) < cursorY)){
						ctx.drawImage(tile, cursorX, cursorY);
					}
					
				}
				
				// Move the cursor one step.
				cursorX -= (draw.tiles.width/2);
				cursorY -= ((draw.tiles.height/2) * -1);
				
				// Count down the drawn block.
				block -= 1;
			}
			// Moves the cursor to the start of the next row.
			cursorX = cursorX + (draw.tiles.width);
			cursorY = cursorY - (draw.tiles.height/2);
			
		}
		draw.autoRedraw();
		ui.hideLoading();
    },

    drawSprites: function() {
		/*
		 * Draws and Updates all the sprites on the map.
		 * Should be refactored into an HTML5 layer.
		 */
		
		// Define X and Y
		var x = 0;
		var y = 1;
		
		ui.showLoading();
		for ( var toon in sprite.characters ){
			// Shorten the variable to make the next steps easy.
			var spriteStatus = sprite.characters[toon];
			var spriteLocation = spriteStatus[2];
			var spriteID = spriteStatus[3];
			var spriteImages = spriteStatus[1];
			var spriteName = spriteStatus[0];
			
			// Get the location to draw
			var exactPosition = draw.cursorOffsetBlockToPixel(spriteLocation);
			
			// Check if the sprite exists.
			if ($('#' + spriteID ).length > 0) {
				// Don't animate if you don't have to.
				if ((draw.spriteCache[spriteID][x] != exactPosition[x]) || (draw.spriteCache[spriteID][y] != exactPosition[y])){
					// Update the cache.
					draw.spriteCache[spriteID] = exactPosition;
					console.log(draw.spriteCache);
					console.log(exactPosition);
					console.log('animating '+ spriteID);
					// Animate to the new position
					$('#' + spriteID ).animate({
						top: exactPosition[y],
						left: exactPosition[x]
					},200);
					draw.moveViewport();
				}
			} else {
				// Write to the sprite container
				draw.spriteCache[spriteID] = exactPosition;
				$('#overlay').append('<div id="' + spriteID + '" style="width:128px; height:64px; position:absolute; top:'+ exactPosition[y] +'px; left:'+ exactPosition[x] +'px; background-image:url('+ spriteImages['right'] +'); background-repeat:no-repeat;" title="' + spriteName + '"></div>');
			}
		}
		ui.hideLoading();

    },
	
	cursorOffsetBlockToPixel: function(XY){
		// Define X and Y
		var x = 0;
		var y = 1;
		
		// Define cursor location. 
		var cursorX = draw.viewportXY[0];
		var cursorY = draw.viewportXY[1] - (draw.tiles.height/2);
		
		// Convert block position to pixels
		var pixelXY = draw.blockToPixel(XY);
		
		var exactXY = [];
		// Calculate the X & Y positions.
		exactXY[x] = cursorX + pixelXY[0];
		exactXY[y] = cursorY + pixelXY[1];
		
		return exactXY;
	},
	
	blockToPixel: function(XY){
		// Define X and Y
		var x = 0;
		var y = 1;
		
		// block width and height is half the size of the tile.
		var blockWidth = draw.tiles.width/2;
		var blockHeight = draw.tiles.height/2;
		
		// Multiply the block position by the pixel size of the block offsets. 
		return [
			((XY[x] * blockWidth) + (XY[y] * blockWidth)),
			((XY[y] * blockHeight) + (XY[x] * (-blockHeight)))
		];
	},
	
	moveViewport: function(){
		/* Move Viewport
		 * looks at the player's current location. 
		 * If the player is close to the edge, 
		 * then update the viewport and redraw the map.
		 */
		draw.pauseRedraw();
		// Shorthand some variables to make things easy to read
		var player = draw.cursorOffsetBlockToPixel(sprite.characters[0][2]);
		var playerX = player[0];
		var playerY = player[1];
		
		// Gather the canvas size.
		var canvasWidth = $('#gameScreen').width();
		var canvasHeight = $('#gameScreen').height();
		
		// Wall Locations
		var topWall = draw.tiles.height;
		var bottomWall = canvasHeight - draw.tiles.height;
		var leftWall = draw.tiles.width;
		var rightWall = canvasWidth - draw.tiles.width;
		
		// Check if player has it one of the walls
		if( ( playerY < topWall )
		|| ( playerY > bottomWall )
		|| ( playerX < leftWall )
		|| ( playerX > rightWall ) ){
			console.log('player touched a wall');
			// Re-center the viewport on the player.
			var xpos = 0;
			var ypos = 0;
			var rawPlayerLocation = draw.blockToPixel(sprite.characters[0][2]);
			
			xpos -= rawPlayerLocation[0];
			xpos += (canvasWidth / 2 - draw.tiles.width);
			console.log(xpos);
			
			ypos -= rawPlayerLocation[1];
			ypos += (canvasHeight / 2 - draw.tiles.height);
			console.log(ypos);
			
			draw.viewportXY = [xpos, ypos];
			
			// redraw
			draw.redraw();
		}
		draw.autoRedraw();
	},
	
	loadMapData: function(callback){
		service.getMapData(function(data){
			// Core map layer
			draw.mapLayer = data.map.map;
			
			// Object Layer
			draw.objectLayer = data.overlay;
			
			// Tile source data
			//draw.tiles.source = data.tileSrc;
			
			// Player Data
			sprite.characters = data.chars;
			
			// Map Identifier
			draw.mapID = data.mapid;
			
			// Set the map home view position, for now we'll hard code this but It should be defined by the server itself.
			var xposition = 0;
			var yposition = 0;
			
			// Load character location
			PlayerX = sprite.characters[0][2][0];
			PlayerY = sprite.characters[0][2][1];
			
			// This is some wild math that will take the position of the player, then figure out where the screen should be looking.
			xposition -= (PlayerY * 64) + (PlayerX * 64);
			yposition += ((PlayerX * 32) + (PlayerY * (-32)));
			
			// Then it takes the size of the screen, and takes the screen width and height into account. 
			xposition += ($('#gameScreen').width() / 2 - 128);
			yposition += ($('#gameScreen').height() / 2 - 64);
			
			// Set position
			draw.viewportXY[0] = xposition;
			draw.viewportXY[1] = yposition;
			
			// Run callback
			if( callback ){
				callback(data);
			}
			
			// Redraw everything
			draw.redraw();
		});
	},
};

// Service provides communication to and from the server. 
var service = {
	
	// Get map data.
	getMapData: function(callback) {
		var mapURL = 'map.php';
		var commands = {};
		$.post(mapURL, commands, function(data){
			// Run Callback
			callback(data);
			return data;
		}, 'json');
	},
	
	// Check Player Move
	getPlayerMove: function(oldXY, newXY, mapID, callback) {
		var updateURL = 'map.php';
		var commands = {
			'pos': 'TRUE',
			'xpos': newXY[0],
			'ypos': newXY[1],
			'curx': oldXY[0],
			'cury': oldXY[1],
			'mapid': mapID,
		};
		$.post(updateURL, commands, function(data){
			callback(data);
			return data;
		}, 'json');
	},
	
};
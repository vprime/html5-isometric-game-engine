 

// Drawing Functionality
var draw = {
	init: function(){
		draw.loadMapData();
		//draw.autoRedraw();
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
	layerContexts: {},
	
	spriteCache: {},
	limitToViewport: false,
	
	viewportXY: [0,0],
	
	redraw: function(){
		draw.drawLayers();
	},
	
	drawLayers: function(){
		for( var layer in draw.activeLayers ){
			draw.drawLayer(draw.activeLayers[layer]);
		}
	},
	
	getCacheCanvas: function(layer){
		if ($('#cache-'+layer).length == 0){
			// Gather the canvas size.
			var canvasWidth = $('#gameScreen').width();
			var canvasHeight = $('#gameScreen').height();
			var layerhtml = '<canvas id="cache-'+layer+'" width="'+ canvasWidth +'px" height="'+ canvasHeight +'px"></canvas>';
			$('#cache').prepend(layerhtml);
		}
		return document.getElementById('cache-'+layer).getContext('2d');
	},
	
    drawLayer: function(layer){
		/* Drawlayer draws the passed layer name.
		 * Layer is the element ID of the canvas element, 
		 * and it's the name of the location of which to find the layer in the draw object.
		 */
		//Show the loading screen.
		ui.showLoading();
		
		console.log('refresh map');
		
		// Gather the canvas size.
		var canvasWidth = $('#gameScreen').width();
		var canvasHeight = $('#gameScreen').height();
		
		// Get the cache canvas
		var ctx = draw.getCacheCanvas(layer);
		
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
					
					// Limit draw distance to viewport?
					if ( draw.limitToViewport ) {
						// If the block is within the confines of our view, then draw it. 
						if( ( canvasWidth > cursorX ) && ((draw.tiles.width * -1) < cursorX) && ( canvasHeight > cursorY) && ((draw.tiles.height * -1) < cursorY)){
							ctx.drawImage(tile, cursorX, cursorY);
						}
					} else {
						ctx.drawImage(tile,cursorX, cursorY);
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
		draw.drawDisplayCanvas(layer);
		ui.hideLoading();
    },
	
	drawDisplayCanvas: function(layer){
		// Gather the canvas size.
		var canvasWidth = $('#gameScreen').width();
		var canvasHeight = $('#gameScreen').height();
		console.log(canvasWidth);
		
		//see if the layer exists
		if( $('#' + layer).length == 0 ){
			//if the layer dosen't exist, create it.
			var zindex = 'z-index:' + draw[layer].zindex + ';';
			var width = 'width:' + canvasWidth + 'px;';
			var height = 'height:' + canvasHeight + 'px;';
			var style = 'style="' + zindex + width + height + '"';
			var layerhtml = '<canvas id="' + layer + '"' + style +' width="'+ canvasWidth +'px" height="'+ canvasHeight +'px">'+ ui.updateBrowserMessage +'</canvas>';
			
			// Currently each layer must be added lowest first. We add the layer after the #obj element.
			$('#gameScreen').prepend(layerhtml);
		}
		// Get the display canvas
		var ctx = document.getElementById(layer).getContext('2d');
		var cache = document.getElementById('cache-'+layer);
		// Write the cache to the display
		ctx.drawImage(cache, 0, 0, canvasWidth, canvasHeight);
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
	
	moveViewport: function(XY){
		/* Move Viewport
		 * When the XY is passed, move the viewport to the new location.
		 */
		
		draw.viewportXY[0] += XY[0];
		draw.viewportXY[1] += XY[1];
		
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
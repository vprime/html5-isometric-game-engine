 
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
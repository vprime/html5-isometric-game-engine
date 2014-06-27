 
// Player functions
var player = {
	init: function(){
		player.eventListeners();
	},
	
	eventListeners: function(){
		$('#overlay').mousedown(function(){
			player.startMovement();
		});
		$('#overlay').mouseup(function(){
			player.stopMovement();
		});
		$('#overlay').mousemove(function(event){
			if ( player.moving ) {
				player.movePlayer([event.clientX, event.clientY]);
			}
		});
	},
	
	moving: false,
	
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
	
	speed: 1,
	
	startMovement: function(){
		player.moving = true;
	},
	
	stopMovement: function(){
		player.moving = false;
	},
	
	movePlayer: function(mousePosition){
		draw.movePlayer(mousePosition);
	},
	
};
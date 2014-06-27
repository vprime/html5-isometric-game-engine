 
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
			player.mousePosition = [event.clientX, event.clientY];
		});
	},
	
	mousePosition: [0,0],
	
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
	
	speed: 10,
	
	
	startMovement: function(){
		player['movingProcess'] = setInterval(function(){
			player.movePlayer();
		}, 50);
	},
	
	stopMovement: function(){
		clearInterval(player.movingProcess);
	},
	
	movePlayer: function(){
		draw.movePlayer(player.mousePosition);
	},
	
};
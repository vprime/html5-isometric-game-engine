// Game Core
var game = {
	init: function(){
		ui.showLoading();
		game.eventListeners();
		ui.init();
		draw.init();
		player.init();
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
		0: function() {
			// Blocked
			ui.showAlert('I can\'t go there.');
		},
		1: function() {
			// Death
			ui.showAlert('You died');
		},
		2: function() {
			// Teleport
		},
		3: function() {
			// Change map
		},
		4: function() {
			// Game is won
			ui.showWin();
		},
	}
	
};
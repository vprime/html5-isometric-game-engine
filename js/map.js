var map = {
	runTileCode: function(tile){
		var tileCode = map.tileCodeMap[tile];
		return tileCode();
	},
	tileCodeMap: {
		10: game.codes.ground,
		17: game.codes.water,
		22: game.codes.wall,
		23: game.codes.wall, 
		24: game.codes.wall,
		25: game.codes.win,
	},
};
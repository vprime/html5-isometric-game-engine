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
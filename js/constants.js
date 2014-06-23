/* 
 * Constant variables
 */


var tiles = {
    width: 128,
    height: 64,
    halfheight: 32,
    src:{
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
	}
}

var xpos = 0;
var ypos = 0;
var evenOddToggle = 'o';
var mapID = '0';
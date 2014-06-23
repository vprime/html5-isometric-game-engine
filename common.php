<?php
//common.php
//Common classes and functions

$mysql = array(
		'database' => 'html5-game-engine',
		'user' => 'root',
		'password' => 'root',
		'host' => 'localhost',
	);
	
class Object
{
	function __empty__()
	{
		continue;
	}
}
class MysqlStringEscaper
{
	function __get($value)
	{
		return mysql_real_escape_string($value);
	}
}
$str = new MysqlStringEscaper;

function connect_database(){
	global $mysql;
	$link = mysqli_connect($mysql['host'], $mysql['user'], $mysql['password'], $mysql['database']);
	if (mysqli_connect_errno()) {
		printf('Could not connect: %s\n' . mysqli_connect_error());
		exit();
	}
	return $link;
	
}




	
	

//Create a map.
function buildmap(){

	$size = array(10,10);

	$gen = new Backtracer();
	$maze = $gen->run('raw',$size);

	//We create a map, and pad it to add 20 impassable blocks to each edge.
	$map = $gen->zeros(array((($size[0] * 2) + 40),(($size[1] * 2) + 40)), 17);



	//We want to start on row 19, so we have that padding.
	$r = 19;
	foreach ($maze as $row){
		//Start 20 cells in, so we have that padding.
		$c = 19;
		foreach ($row as $cell){
			//Mark current cell passable.
			$map[$r][$c] = 10;

			

			//We only need to check the east and south wall, as the west is just your western neighbor's east wall.

			if($cell[2] == 1){
				//Impassable
				$map[$r][$c + 1] = 22;
				$map[$r + 1][$c + 1] = 22;
			} else {
				//Passable
				$map[$r][$c + 1] = 10;
			}
			//If it's the last row, we won't have to check the south wall.
			if($r == (($size[1] * 2) + 19) || $cell[1] == 1){
				//Impassable
				$map[$r + 1][$c] = 23;
				$map[$r + 1][$c + 1] = 23;

			} else {
				//Passable
				$map[$r + 1][$c] = 10;
			}

			if($cell[2] == 1 && $cell[1] == 1 || $cell[2] == 0 && $cell[1] == 0){
				$map[$r + 1][$c + 1] = 24;
			}


			$c++;
			$c++;
		}
		$r++;
		$r++;
	}
	return $map;
}


?>

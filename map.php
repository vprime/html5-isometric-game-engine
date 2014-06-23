<?php
// Map.php
include_once 'common.php';

//Include the maze class
include_once 'maze.php';

if(isset($_REQUEST['mapid'])){
    
    //Look on database for the map
    $sql_link = connect_database();
    $sql = "SELECT mapdata FROM maps WHERE mapid=".mysqli_real_escape_string($sql_link,$_REQUEST['mapid']);
    $sql_result = mysqli_query($sql_link,$sql);
    if (!$sql_result) {
                    die('Invalid search map sql: ' . mysql_error());
    }
    
    //If the map dosen't exist, create a new one and put it in the database.
    if(mysqli_num_rows($sql_result)){
        $map = mysqli_fetch_array($sql_result);
        $map = unserialize($map[0]);
        $mapid = $_REQUEST['mapid'];
    } else {
        $map = buildmap();

        //put the new map into the database.
        $sql = "INSERT INTO maps (mapdata) VALUES ('".mysqli_real_escape_string($sql_link,serialize($map))."')";
        $sql_result = mysqli_query($sql);
        if (!$sql_result) {
            die('Invalid post map 1 sql: ' . mysql_error());
        }
        $mapid = mysqli_insert_id($sql_link);
    }
    mysqli_close($sql_link);
    
} else {
    //Generate the map
    $map = buildmap();
    
    //Put it in the database
    $map = buildmap();
    $sql_link = connect_database();
        //put the new map into the database.
        $sql = "INSERT INTO maps (mapdata) VALUES ('".mysqli_real_escape_string($sql_link,serialize($map))."')";
        $sql_result = mysqli_query($sql_link,$sql);
        if (!$sql_result) {
            die('Invalid post map 2 sql: ' . mysql_error());
        }
        
    $mapid = mysqli_insert_id($sql_link);

    mysqli_close($sql_link);
}


//Set the start position data for the cow.
if(isset($_REQUEST['curx']) && isset($_REQUEST['cury'])){
    $location = array(
   'xpos' => $_REQUEST['curx'],
   'ypos' => $_REQUEST['cury']
);
} else {
$location = array(
   'xpos' => 19,
   'ypos' => 19
);
}



// Tiles

$tileSrc = array();
$tileSrc[10] = 'images/tileset_10.png';
$tileSrc[17] = 'images/tileset_17.png';

$tileSrc[22] = 'images/tileset_22.png';
$tileSrc[23] = 'images/tileset_23.png';
$tileSrc[24] = 'images/tileset_24.png';
$tileSrc[25] = 'images/tileset_25.png';
$tileSrc['wall1'] = 'images/tileset_21.png';
$tileSrc['pit'] = 'images/tileset_07.png';
$tileSrc['teleport'] = 'images/tileset_02.png';

//character tiles
$tileSrc['cow'] = array();
$tileSrc['cow']['up'] = 'images/tileset_cow_03_left.png';
$tileSrc['cow']['right'] = 'images/tileset_cow_03.png';
$tileSrc['cow']['down'] = 'images/tileset_cow_03.png';
$tileSrc['cow']['left'] = 'images/tileset_cow_03_left.png';


//user character
$user = array('You',$tileSrc['cow'],array($location['xpos'],$location['ypos']),'cow1');	

// Characters
$chars = array($user);	



//overlay
class overlay {
	function __construct() {
            $this->{'y39x39'} = array(4,'25','silage');
		
	}
}
$overlay = new overlay();
class data {
	public function __construct() {
		$this->{'map'} = new Object();
		if(!isset($_REQUEST['pos'])){
			global $map;
			$this->map->{'map'} = $map;
			$this->map->map['zindex'] = 10;
		}

		global $chars;
        global $mapid;
		global $overlay;
		$this->map->{'overlay'} = $overlay;
		$this->{'chars'} = $chars;
        $this->{'mapid'} = $mapid;
	}
	public function __set($key, $value)
    {
        	$this->$key = $value;
    }
}

$data = new data();

// Move character
if(isset($_REQUEST['pos']) && (isset($_REQUEST['curx'])) && (isset($_REQUEST['cury'])) && (isset($_REQUEST['xpos']) || isset($_REQUEST['ypos']))){
	
	
	if($_REQUEST['xpos'] != '' && $_REQUEST['xpos'] != 0){
		switch($_REQUEST['xpos']){
			case 1:
				$pos_poss = 'y'.$_REQUEST['cury'].'x'.($_REQUEST['curx'] + 1);
				$pos_poss_x = $_REQUEST['curx'] + 1;
				$pos_poss_y = $_REQUEST['cury'];
				break;
			case -1:
				$pos_poss = 'y'.$_REQUEST['cury'].'x'.($_REQUEST['curx'] + -1);
				$pos_poss_x = $_REQUEST['curx'] + -1;
				$pos_poss_y = $_REQUEST['cury'];
				break;
			default:
				die('invalid data');
				break;
		}
		
	} elseif($_REQUEST['ypos'] != '' && $_REQUEST['ypos'] != 0){
		switch($_REQUEST['ypos']){
			case 1:
				$pos_poss = 'y'.($_REQUEST['cury'] + 1).'x'.$_REQUEST['curx'];
				$pos_poss_x = $_REQUEST['curx'];
				$pos_poss_y = $location['ypos'] + 1;
				break;
			case -1:
				$pos_poss = 'y'.($_REQUEST['cury'] + -1).'x'.$_REQUEST['curx'];
				$pos_poss_x = $_REQUEST['curx'];
				$pos_poss_y = $_REQUEST['cury'] + -1;
				break;
			default:
				die('invalid data');
				break;
		}
	}
	
	if(isset($overlay->$pos_poss)){
		$code = $overlay->{$pos_poss}[0];
		$data->code = $code;
	} else {
		$code = 100;
		$data->code = 100;
	}
	if($code != 0 && isset($map[$pos_poss_y][$pos_poss_x]) && $map[$pos_poss_y][$pos_poss_x] != 17 && $map[$pos_poss_y][$pos_poss_x] != 22 && $map[$pos_poss_y][$pos_poss_x] != 23 && $map[$pos_poss_y][$pos_poss_x] != 24){
                $data->chars[0][2] = array($pos_poss_x,$pos_poss_y);
	} else {
		$data->code = 0;
	}
}	


// map info
//if(isset($_REQUEST['mapid']) || isset($_REQUEST['test'])){
//print json
print json_encode($data);

//}

?>
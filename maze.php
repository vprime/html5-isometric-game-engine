<?php
	/*
	*@author: Vincent Prime
	* I'm going to attempt a maze generation software, by common theory maze generation algorithm
	* Recursive Backtracer
	*/

class Backtracer{
	
	//This is the core function to run.
	//The $start tells the backtracer where to begin in an X,Y corrds. Defaults to top left corner.
	//$end is same as start, only it will default to bottom right.
	//The $shape is the width and height of the maze.
	//$output allows you to choose between 
	//raw = The $maze array, a 2D array of arrays storing wall data. (good for a JSON output.)
	//html = Generated HTML display (DEFAULT)
	
	function run($output = 'html',$shape = array(20,20),$start = array(0,0),$end = FALSE){
		$cell = array(1,1,1,1);
		$this->vis = $this->zeros($shape);
		$this->map = $this->zeros($shape,$cell);
		
		//Mark the begining cell
		$this->start = $start;
		
		//Mark the end cell
		if($end == FALSE){
			$this->end = $shape;
		}else{
			$this->end = $end;
		}
		
		//Set the current position as the start cell.
		$this->pos = $start;
		
		//Create the stack
		$this->stack = array();
		
		//run cycle(), the repetitive process in the generator
		$state = TRUE;
		while ($state != FALSE){
			$state = $this->cycle();
		}
		
		switch($output){
			case 'html':
				return $this->printMaze();
				break;
			case 'raw':
				return $this->map;
				break;
		}
		
	}
	
	
	//This is similar to zeros from NumPy, used to make a 2D grid zeroed out. 
	function zeros($shape,$dtype = "int"){
		$i = 0;
		
		$zeroed = array();
		switch ($dtype){
			case "int":
				$z = 0;
				break;
			case "bool":
				$z = FALSE;
				break;
			case "str":
				$z = "0";
				break;
			default:
				$z = $dtype;
		}
		while($i <= $shape[1]){
			$temp = array();
			$ii = 0;
			while($ii <= $shape[0]){
				$temp[$ii] = $z;
				$ii++;
			}
			$zeroed[$i] = $temp;
			unset($temp,$ii);
			$i++;
		}
		return $zeroed;
	}
	
	function cycle() {
		
		//Mark the current cell visited.
		$this->vis[$this->pos[1]][$this->pos[0]] = 1;
		
		//Get open unvisited neighbors
		$this->openneighbors = $this->scanNeighbors();
				
		//check if any good neighbors returned for our location.
		$numberopen = count($this->openneighbors);
		if($numberopen >= 1){
			//if so, we continue forward.
			//Add the current position to the stack.
			$this->stack[] = array($this->pos[0],$this->pos[1]);
			$this->subCycle();
			return TRUE;
		} else {
			//if not, then we go back a step in the stack, if there is a last position.
			//Use pop to rip out the last position.
			if(count($this->stack) > 0){
				
				$this->pos = array_pop($this->stack);
				
				$this->subCycle();
				return TRUE;
			} else {
				// There's nothing else to do, we're finished.
				return FALSE;
			}
			
		}
		
		
	}
	
	function subCycle(){
		//Randomly choose one of the neighbors
		$rndNeigh = rand(0, (count($this->openneighbors) - 1));
		
		
		//Remove wall between chosen neighbor and current cell.
		//and make that neighbor the chosen cell.
		if ( !isset($this->openneighbors[$rndNeigh]) ){
			return FALSE;
		}
		switch($this->openneighbors[$rndNeigh]){
			case "n":
				$this->map[$this->pos[1]][$this->pos[0]][0] = 0;
				$this->map[($this->pos[1] - 1)][$this->pos[0]][1] = 0;
				$this->pos[1] = $this->pos[1] - 1;
				break;
			case "s":
				$this->map[$this->pos[1]][$this->pos[0]][1] = 0;
				$this->map[($this->pos[1] + 1)][$this->pos[0]][0] = 0;
				$this->pos[1] = $this->pos[1] + 1;
				break;
			case "e":
				$this->map[$this->pos[1]][$this->pos[0]][2] = 0;
				$this->map[$this->pos[1]][($this->pos[0] + 1)][3] = 0;
				$this->pos[0] = $this->pos[0] + 1;
				break;
			case "w":
				$this->map[$this->pos[1]][$this->pos[0]][3] = 0;
				$this->map[$this->pos[1]][($this->pos[0] - 1)][2] = 0;
				$this->pos[0] = $this->pos[0] - 1;
				break;
		}
		
	}
	
	function scanNeighbors(){
		//Get neighbors on the x axsis that exist and are not visited.
		$neighbors = array();
		if(isset($this->vis[$this->pos[1]][($this->pos[0] - 1)]) && $this->vis[$this->pos[1]][($this->pos[0] - 1)] == 0){
			$neighbors[] = 'w';
		}
		if(isset($this->vis[$this->pos[1]][($this->pos[0] + 1)]) && $this->vis[$this->pos[1]][($this->pos[0] + 1)] == 0){
			$neighbors[] = 'e';
		}
		if(isset($this->vis[($this->pos[1] - 1)][$this->pos[0]]) && $this->vis[($this->pos[1] - 1)][$this->pos[0]] == 0){
			$neighbors[] = 'n';
		}
		if(isset($this->vis[($this->pos[1] + 1)][$this->pos[0]]) && $this->vis[($this->pos[1] + 1)][$this->pos[0]] == 0){
			$neighbors[] = 's';
		}
		return $neighbors;
	}
	
	function printMaze(){
		$html = '<div id="maze">';
		$r = 0;
		foreach( $this->map as $row ){
			$html .= '<div class="row" id="row-'.$r.'">';
			$c = 0;
			foreach( $row as $cell){
				$html .= '<div class="cell';
				//Check to see if this is the begining or end cell, if so then set a class for it.
				if(($r == $this->start[1]) && ($c == $this->start[0])){
					$html .= ' start';
				} elseif (($r == $this->end[1]) && ($c == $this->end[0])){
					$html .= ' end';
				}
				
				$html .= '" id="row-'.$r.'-cell-'.$c.'" style="';
				if($cell[0] == 1){
					$html .= 'border-top-color: black;';
				}
				if($cell[1] == 1){
					$html .= 'border-bottom-color: black;';
				}
				if($cell[2] == 1){
					$html .= 'border-right-color: black;';
				}
				if($cell[3] == 1){
					$html .= 'border-left-color: black;';
				}
				
				$html .= '" title="Cell '.$r.'.'.$c.'"></div>';
				$c++;
			}
			$html .= "</div>\n";
			unset($c);
			$r++;
		}
		$html .= '</div>';
		unset($r);
		return $html;
	}
	
	function ___set($name, $value){
		$this->$name = $value;
	}
	
}
	
	
?>

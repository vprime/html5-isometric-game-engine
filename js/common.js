/* 
 * Commonly used functions
 * 
 *  
 */
 function compareBlocks(array1, array2){
 	for (var key in array1){
 		if ( array1[key] != array2[key] ){
 			return false;
 		}
 	}
 	return true;
 }
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$('#blog').click(function(){
           browserWindow('http://blog.vincentprime.com/');
        });


function browserWindow(url){
    var browser = '<div id="browser"><div id="title">browser</div><div id="close-browser" class="close-button" onclick="$(\'#browser\').hide();">x</div><iframe src="' + url + '" /></div>';
    $('#gameScreen').after(browser);
}
HTML5 Isometric Game Engine
===========================

Currently very alpha, though MASTER is stable. Common.js holds the core of the game engine. map.php is used to generate test maps from a recursive backtracer. The demonstration game is a labyrinth. You are a cow, your pasture is a maze of fences. The rancher is presumably drunk, or sadistic. You're just hungry. Find yourself the Silage so you can eat. 

###To install:###
* Create a LAMP server
* Setup the database in common.php
* Run install.sql to your database.

###To play:###
Open the location in a modern browser capable of using HTML5 Canvas.
Requires an Internet connection to load jQuery.

###Bugs:###
* Silage doesn't show, and winning doesn't work. Assume the lower right corner is the end.
* Movement needs to be completely redone, it's too blocky and slow.
* Too much chatter with PHP. 
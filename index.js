var express  = require('express'),
	http 	 = require('http'),
	socketIO = require('socket.io'),
	Game 	 = require('./Game');

/**
 * app - The Express server instance: http://expressjs.com/
 */
var app 	= express();

/**
 * server - The http server instance: https://nodejs.org/api/http.html
 *        - This is the actual 'listener' for HTTP connections, both express
 *          and socket.io use it on incoming connections
 */
var server 	= http.createServer(app);

/**
 * io - The socket.io instance: http://socket.io/
 */
var io 		= socketIO(server);

/**
 * The port we're going to listen on
 * @type {Number}
 */
var port 	= 3000;

/**
 * Starts up the server instance listening on the given port!
 */
server.listen(port, function () {
  console.info('Server listening at port %d', port);
});


app.get('/', function(req, res) {
	res.redirect('/app.html');
})

/**
 * Binds the /public directory to serve files if no other routes are found
 */
app.use(express.static(__dirname + '/public'));


/**
 * Called when a new socket.io connection is received
 * @param  {Socket} socket  - The websocket to the user
 */

var socketList = [];
var readySocketList = [];

io.on('connection', function (socket) {
	
	console.log('Socket Connected:', socket.id);
	socketList.push(socket);


	socket.on('disconnect', function() {
		console.log('Socket Disconnected:', socket.id);
		socketList.splice(socketList.indexOf(socket), 1);
	});


	socket.on('setReady', function(isReady) {
		console.log('Socket setReady:', socket.id, isReady);
		if (isReady && readySocketList.indexOf(socket) === -1) {

			// If there is somebody else ready:
			if (readySocketList.length > 0) {
				var opponent = readySocketList.shift();

				// CREATE A GAME
				Game.createGame(socket, opponent);

			} else {
				readySocketList.push(socket);
			}

		}
	});


});

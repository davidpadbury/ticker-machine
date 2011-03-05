var connect = require('connect'),
		io = require('socket.io'),
		Ticker = require('./lib/ticker').Ticker;

var server = connect.createServer(
		connect.staticProvider(__dirname + '/public')
);

var socket = io.listen(server),
		counter = 0,
		updateCounters = function() {
			socket.broadcast(JSON.stringify({
				command:'counter',
				data: counter
			}));
		};

socket.on('connection', function(client) {
	// Create a ticker for this instance
	var ticker = new Ticker();

	counter = counter + 1;
	updateCounters();

	client.on('message', function(msgtxt) {
		var msg = JSON.parse(msgtxt);

		switch (msg.command) {
			case "change-rate":
				ticker.setRate(msg.data);
				break;

			default:
				console.log('Unhandled command "' + msg.command + '".');
				break;
		}
	});

	client.on('disconnect', function() {
		ticker.stop();
		counter = counter - 1;
		updateCounters();
	});

	ticker.on('tick', function(tick) {
		client.send(JSON.stringify({
			command:'tick',
			data: tick
		}));
	});

});

server.listen(3000);
console.log('ticker-machine started on 3000');

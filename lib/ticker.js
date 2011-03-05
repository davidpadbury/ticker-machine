var util = require('util'),
		events = require('events'),
		defaultRate = 200;

/**
 * Creates a new Ticker
 * @param {Number} [rate] How frequently we should tick in milliseconds
 */
function Ticker(rate) {
	events.EventEmitter.call(this);

	// Initialize with given rate, or if that's falsy the default
	this.setRate(rate || defaultRate);
}

util.inherits(Ticker, events.EventEmitter);

/**
 * Set the rate at which the ticker ticks
 * @param {Number} rate Rate for ticks in milliseconds
 */
Ticker.prototype.setRate = function(rate) {
	var self = this;

	// Clear any previous timer we may have set
	this.stop();

	this.intervalId = setInterval(function() {
		// Generate a number
		var tick = Math.round(Math.random() * 1000);

		// Notify any subscribers of a new tick
		self.emit('tick', tick);
	}, rate);
}

/**
 * Stops the ticker
 */
Ticker.prototype.stop = function() {
	if (this.intervalId) {
		clearInterval(this.intervalId);
	}
}

exports.Ticker = Ticker;

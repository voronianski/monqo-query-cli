var Logme = require('logme').Logme;
var colors = require('colors');

Logme.prototype.clean = function (str) {
	return this.log('clean', arguments);
};

var mq = 'mq'.cyan;

var stat = function (name) {
	var str = ' [' + name + ']';
	return colors.magenta(str);
};

var logger = new Logme({
	theme: {
		info: mq + stat('info') + ' :message',
		error: mq + stat('error') + ' :message'.red,
		warning:  mq + stat('warning') + ' :message'.yellow,
		clean: ':message'
	}
});

module.exports = logger;
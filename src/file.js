var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Table = require('cli-table');

var mqconfig = path.join(__dirname, '../.mqconfig');

function setup (connection, options, callback) {
	checkConfigFile(function (err) {
		if (err) {
			return callback(err);
		}

		var fields = ['db', 'name', 'url', 'active'];
		options = _(options).pick(fields);

		if (_(options).isEmpty()) {
			return callback('Please add options to change active connection');
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			var changed = false;

			if (err) {
				return callback(err);
			}

			data = JSON.parse(data);

			data.connections.forEach(function (c) {
				if (options.name === c.name) {
					return callback('This name is already in use!');
				}

				if (options.active && c.name !== connection) {
					c.active = false;
				}

				if (connection === c.name) {
					fields.forEach(function (field) {
						if (options[field]) {
							c[field] = options[field];
						}
					});
					changed = true;
				}
			});

			if (!changed) {
				return callback('Sorry, but there is no connections with that name');
			}

			data.edited = new Date();

			fs.writeFile(mqconfig, JSON.stringify(data), function (err) {
				if (err) {
					return callback(err);
				}

				return callback(null);
			});
		});
	});
}

function showConnections (callback) {
	checkConfigFile(function (err) {
		if (err) {
			return callback(err);
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			if (err) {
				return callback(err);
			}

			var table = new Table({
				head: ['Name', 'Connection', 'Database', 'Status'],
				colWidths: [10, 35, 15, 10],
				style : { compact: true }
			});

			data = JSON.parse(data);

			data.connections.forEach(function (c) {
				var status = c.active ? 'active' : '';
				table.push([c.name, c.url, c.db, status]);
			});

			return callback(null, table.toString());
		});
	});
}

function addConnection (connection, callback) {
	checkConfigFile(function (err) {
		if (err) {
			return callback(err);
		}

		if (!/^mongodb:\/\/.*?:\d+$/.test(connection.url)) {
			return callback('Connection url is incorrect, example: mongodb://connection:port');
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			if (err) {
				return callback(err);
			}

			data = JSON.parse(data);

			_(data.connections).find(function (c) {
				if (c.name === connection.name) {
					return callback('Sorry, but name "' + connection.name + '" is already in use');
				}
			});

			connection.active = false;
			data.connections.push(connection);
			data.edited = new Date();

			fs.writeFile(mqconfig, JSON.stringify(data), function (err) {
				if (err) {
					return callback(err);
				}

				return callback(null);
			});
		});
	});
}

function removeConnection (connection, callback) {
	checkConfigFile(function (err) {
		if (err) {
			return callback(err);
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			if (err) {
				return callback(err);
			}

			data = JSON.parse(data);

			data.connections.forEach(function (c, i) {
				if (c.name === connection) {
					data.connections.splice(i, 1);
				}
			});

			data.edited = new Date();

			fs.writeFile(mqconfig, JSON.stringify(data), function (err) {
				if (err) {
					return callback(err);
				}

				return callback(null);
			});
		});
	});
}

function checkConfigFile (callback) {
	var defaults = {
		connections: [{
			name: 'default',
			url: 'mongodb://localhost:27017',
			db: 'test',
			active: true
		}]
	};

	fs.exists(mqconfig, function (exists) {
		if (exists) {
			return callback(null);
		}

		fs.appendFile(mqconfig, JSON.stringify(defaults), function (err) {
			return callback(err);
		});
	});
}

module.exports = {
	setup: setup,
	showConnections: showConnections,
	addConnection: addConnection,
	removeConnection: removeConnection
};
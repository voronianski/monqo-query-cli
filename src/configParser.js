var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var userhome = require('userhome');
var Table = require('cli-table');

/**
 * Change property in connections settings
 * @param connection {String} - 'default';
 * @param options {Object} - { db: 'test', active: true };
 * @param filePath {String} - optional, reinit another config file;
 */
function setup (connection, options, callback, filePath) {
	if (!connection || typeof connection !== 'string') {
		return callback('Connection is not specified properly');
	}

	checkConfigFile(function (err, mqconfig) {
		if (err) {
			return callback(err);
		}

		var fields = ['db', 'name', 'url', 'active'];
		options = _(options).pick(fields);

		if (_(options).isEmpty()) {
			return callback('Please add options to change active connection');
		}

		if (options.url && !matchMongodbUrl(options.url)) {
			return callback('Connection url is incorrect, example: mongodb://connection:port');
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

				return callback(null, data);
			});
		});
	}, filePath);
}

/**
 * Show available connections table
 * @param filePath {String} - optional, reinit another config file;
 */
function showConnections (callback, filePath) {
	checkConfigFile(function (err, mqconfig) {
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

			return callback(null, table.toString(), table);
		});
	}, filePath);
}

/**
 * Add connection to settings
 * @param connection {Object} - { name: 'test', url: 'mongodb://user:pass@example.com:27017', db: 'dev' };
 * @param filePath {String} - optional, reinit another config file;
 */
function addConnection (connection, callback, filePath) {
	if (!connection || typeof connection !== 'object') {
		return callback('Connection param is not correct');
	}

	checkConfigFile(function (err, mqconfig) {
		if (err) {
			return callback(err);
		}

		if (!matchMongodbUrl(connection.url)) {
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

				return callback(null, data);
			});
		});
	}, filePath);
}

/**
 * Remove connection from settings
 * @param connection {String} - 'default';
 * @param filePath {String} - optional, reinit another config file;
 */
function removeConnection (connection, callback, filePath) {
	if (!connection || typeof connection !== 'string') {
		return callback('Connection param is not correct');
	}

	checkConfigFile(function (err, mqconfig) {
		if (err) {
			return callback(err);
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			if (err) {
				return callback(err);
			}

			data = JSON.parse(data);
			var connects = data.connections;

			if (connects.length === 1) {
				return callback('Sorry, you cannot remove last connection instance.');
			}

			connects.forEach(function (c, i) {
				if (c.name === connection) {
					if (c.active) {
						var next = connects[0].name === c.name ? connects[1] : connects[0];
						next.active = true;
					}
					connects.splice(i, 1);
				}
			});

			data.edited = new Date();

			fs.writeFile(mqconfig, JSON.stringify(data), function (err) {
				if (err) {
					return callback(err);
				}

				return callback(null, data);
			});
		});
	}, filePath);
}

/**
 * Check if config file exists in root folder (will add default if not)
 * @param filePath {String} - optional, reinit another config file;
 */
function checkConfigFile (callback, filePath) {
	var mqconfig = userhome('.mqconfig.json');

	var defaults = {
		connections: [{
			name: 'default',
			url: 'mongodb://localhost:27017',
			db: 'test',
			active: true
		}]
	};

	if (filePath && typeof filePath === 'string') {
		mqconfig = path.join(__dirname, filePath);
	}

	fs.exists(mqconfig, function (exists) {
		if (exists) {
			return callback(null, mqconfig);
		}

		fs.appendFile(mqconfig, JSON.stringify(defaults), function (err) {
			return callback(err, mqconfig);
		});
	});
}

/**
 * Get current active connection data
 * @param filePath {String} - optional, reinit another config file;
 */
function getConnectionConfig (callback, filePath) {
	checkConfigFile(function (err, mqconfig) {
		if (err) {
			return callback(err);
		}

		fs.readFile(mqconfig, 'utf-8', function (err, data) {
			if (err) {
				return callback(err);
			}

			data = JSON.parse(data);

			var obj = _(data.connections).find(function (c) {
				return c.active === true;
			});

			return callback(null, obj);
		});
	}, filePath);
}

function matchMongodbUrl (str) {
	if (!str && typeof str !== 'string') {
		return false;
	}

	var matcher = /^mongodb:\/\/.*?:\d+$/.test(str);
	return matcher;
}

module.exports = {
	setup: setup,
	showConnections: showConnections,
	addConnection: addConnection,
	removeConnection: removeConnection,
	checkConfigFile: checkConfigFile,
	getConnectionConfig: getConnectionConfig
};
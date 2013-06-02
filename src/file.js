var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Table = require('cli-table');

var mqconfig = path.join(__dirname, '../.mqconfig'); // TO DO: move to ~/ dir

function activate (name, callback) {
	fs.readFile(mqconfig, 'utf-8', function (err, data) {
		if (err) {
			return callback(err);
		}

		data = JSON.parse(data);
		data.active = name;

		return callback(null);
	});
}

function setup (connection, options, callback) {
	var fields = ['db', 'name', 'url', 'active'];
	options = _(options).pick(fields);

	if (_(options).isEmpty()) {
		return callback('Add options to change active connection');
	}

	fs.readFile(mqconfig, 'utf-8', function (err, data) {
		if (err) {
			return callback(err);
		}

		data = JSON.parse(data);

		data.connections.forEach(function (c) {

			if (options['name'] === c.name) {
				return callback('This name is already in use!');
			}

			if (connection === c.name) {
				fields.forEach(function (field) {
					if (options[field]) {
						c[field] = options[field];
					}
				});
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
}

function showConnections (callback) {
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
}

function addConnection (connection, callback) {
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

		fs.writeFile(mqconfig, JSON.stringify(data), function (err) {
			if (err) {
				return callback(err);
			}

			return callback(null);
		});
	});
}

function removeConnection () {

}

module.exports = {
	activate: activate,
	setup: setup,
	showConnections: showConnections,
	addConnection: addConnection,
	removeConnection: removeConnection
};
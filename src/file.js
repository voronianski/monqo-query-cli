var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Table = require('cli-table');

var mqconfig = path.join(__dirname, '../.mqconfig');

function activate () {

}

function setupField (connection, options, callback) {
	if (!options || typeof options !== 'object') {
		return callback('Options are incorrect!');
	}

	var fields = ['db', 'name', 'url'];
	options = _(options).pick(fields);

	fs.readFile(mqconfig, 'utf-8', function (err, data) {
		if (err) {
			return callback(err);
		}

		data = JSON.parse(data);

		var cname = connection || data.active;

		data.connections.forEach(function (c) {
			var active = data.active === c.name;

			if (options['name'] === c.name) {
				return callback('This name is already in use!');
			}

			if (c.name === cname) {
				fields.forEach(function (field) {
					if (options[field]) {
						c[field] = options[field];
						data.active = options['name'] && active ? options['name'] : data.active;
					}
				});
			}
		});

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
			style : {compact: true, 'padding-left': 1}
		});

		data = JSON.parse(data);

		data.connections.forEach(function (c) {
			var status = c.name === data.active ? 'active' : '';
			table.push([c.name, c.url, c.db, status]);
		});

		return callback(null, table.toString());
	});
}

function addConnection (connection, callback) {
	fs.readFile(mqconfig, 'utf-8', function (err, data) {
		if (err) {
			return callback(err);
		}

		data = JSON.parse(data);
		_(data.connections).find(function (c) {
			if (c.name === connection.name) {
				return callback('Sorry, but name "' + connection.name +'" is already in use');
			}
		});

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
	setupField: setupField,
	showConnections: showConnections,
	addConnection: addConnection,
	removeConnection: removeConnection
};
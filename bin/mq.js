#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var programm = require('commander');
var colors = require('colors');
var dbUtil = require('../src/connector.js');
var config = require('../src/file.js');

var version = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))).version;

programm
	.version(version)
	.option('-s, --save <file>', 'save output to specified file');

programm
	.command('connections')
	.description('show available connections')
	.action(function () {
		config.showConnections(function (err, table) {
			handleError(err);

			console.log(table);
			process.exit();
		});
	});

programm
	.command('create')
	.description('create new connection')
	.action(function () {
		programm.prompt({ name: 'Connection name: ', url: 'Connection url: ', db: 'Database name: '}, function (obj) {
			config.addConnection(obj, function (err) {
				handleError(err);

				console.log('New connection "%s" was successfully created'.yellow, obj.name);
				console.log('View all connections with "mq connections" or activate it with "mq set --active <name>"');
				process.exit();
			});
		});
	});

programm
	.command('remove <connection>')
	.description('remove existing connection')
	.action(function (name) {
		config.removeConnection(name, function (err) {
			handleError(err);

			console.log('Connection "%s" is successfully removed'.yellow, name);
			process.exit();
		});
	});

programm
	.command('set <connection>')
	.description('setup fields to connection or current active if not specified')
	.option('--db <value>', 'setup database name')
	.option('--url <value>', 'setup connection url')
	.option('--name <value>', 'setup connection name')
	.option('--active', 'set connection as active')
	.action(function (connection, options) {
		config.setup(connection, options, function (err) {
			handleError(err);

			console.log('Database config changed succesfully!'.yellow);
			process.exit();
		});
	});

programm
	.command('find [query]')
	.description('select documents in collection')
	.option('--url <connection>', 'set connection url string, default: localhost:27017')
	.option('--db <name>', 'set db name for searching')
	.option('-c, --collection <name>', 'set collection name for searching')
	.option('--count', 'display only count of documents')
	.action(function (query, options) {
		dbUtil.find(query, options, function (err, docs) {
			handleError(err);

			var documents = docs.length > 1 ? 'documents' : 'document';
			console.info('Found %s %s in "%s" collection:'.yellow, docs.length, documents, options.collection);

			if (!options.count) {
				console.log(docs);
			}
			process.exit();
		});
	});

programm.parse(process.argv);

function handleError (error) {
	if (error) {
		console.error(colors.red(error));
		process.exit(1);
	}
}
#! /usr/bin/env node

/**
 * Code licensed under the BSD License
 * Dmitri Voronianski <dmitri.voronianski@gmail.com>
 *
 * (c) 2013 All Rights Reserved.
 */

var fs = require('fs');
var path = require('path');
var program = require('commander');
var logger = require('../src/logger.js');
var dbUtil = require('../src/connector.js');
var configUtil = require('../src/configParser.js');

var version = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))).version;

program
	.version(version)
	.option('-s, --save <file>', 'save output to specified file');

program
	.command('connections')
	.description('show available connections')
	.action(function () {
		configUtil.showConnections(function (err, table) {
			handleError(err);

			logger.clean(table);
			process.exit();
		});
	});

program
	.command('create')
	.description('create new connection')
	.action(function () {
		program.prompt({ name: 'Connection name: ', url: 'Connection url: ', db: 'Database name: '}, function (obj) {
			configUtil.addConnection(obj, function (err) {
				handleError(err);

				logger.info('New connection "%s" was successfully created', obj.name);
				logger.info('View all connections with "mq connections" or activate it with "mq set --active <name>"');
				process.exit();
			});
		});
	});

program
	.command('remove <connection>')
	.description('remove existing connection')
	.action(function (name) {
		configUtil.removeConnection(name, function (err) {
			handleError(err);

			logger.info('Connection "%s" is successfully removed', name);
			process.exit();
		});
	});

program
	.command('setup <connection>')
	.description('setup fields to connection or current active if not specified')
	.option('--db <value>', 'setup database name')
	.option('--url <value>', 'setup connection url')
	.option('--name <value>', 'setup connection name')
	.option('--active', 'set connection as active')
	.action(function (connection, options) {
		configUtil.setup(connection, options, function (err) {
			handleError(err);

			logger.info('Database config changed succesfully!');
			process.exit();
		});
	});

program
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
			logger.info('Found %s %s in "%s" collection:', docs.length, documents, options.collection);

			if (!options.count) {
				logger.info(docs);
			}
			process.exit();
		});
	});

program.command('*').action(function () {
	this.help();
});

if (process.argv.length == 2) {
	logger.warning('No command specified with "mq".\n');
	logger.info('Check out all available commands with "mq --help"');
}

program.parse(process.argv);

function handleError (error) {
	if (error) {
		logger.error(error);
		process.exit(1);
	}
}
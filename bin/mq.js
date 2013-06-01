#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
var commander = require('commander');
var colors = require('colors');
var dbUtil = require('../src/connector.js');
var config = require('../src/file.js');

var	version = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'))).version;

commander
	.version(version)
	.option('-s, --save <file>', 'save output to specified file');

commander
	.command('connections')
	.description('show available connections')
	.action(function () {
		config.showConnections(function (err, table) {
			handleError(err);

			console.log(table);
			process.exit();
		})
	});

commander
	.command('set [connection]')
	.description('setup fields to connection or current active if not specified')
	.option('--db <value>', 'setup database name')
	.option('--url <value>', 'setup connection url')
	.option('--name <value>', 'setup connection name')
	.action(function (connection, options) {
		config.setupField(connection, options, function (err) {
			handleError(err);

			console.log('Database config changed succesfully!'.yellow);
			process.exit();
		});
	});

commander
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

		// TO DO: operators - http://docs.mongodb.org/manual/reference/operator/
	});

commander.parse(process.argv);

function handleError (error) {
	if (error) {
		console.error(colors.red(error));
		process.exit(1);
	}
}
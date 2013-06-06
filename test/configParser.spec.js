describe('./src/configParser.spec.js', function () {
	'use strict';

	var fs = require('fs');
	var should = require('should');
	var configUtil = require('../src/configParser.js');

	var mqconfig = '../.mqconfig-test';
	var config, error;

	before(function (done) {
		fs.exists(mqconfig, function (exists) {
			if (exists) {
				fs.unlink(path.join(__dirname, mqconfig), function (err) {
					if (err) {
						return done(err);
					}
					return done();
				});
			}

			return done();
		});
	});

	describe('checkConfigFile() method', function () {
		beforeEach(function (done) {
			configUtil.checkConfigFile(function (err) {
				error = err;
				done();
			}, mqconfig);
		});

		it('should not return an error', function () {
			should.not.exist(error);
		});
	});

	describe('addConnection() method', function () {
		before(function (done) {
			var data = {
				name: 'mocha-test',
				url: 'mongodb://user:pass@example.com:27017',
				db: 'dev'
			};

			configUtil.addConnection(data, function (err, res) {
				should.not.exist(error);
				should.exist(res);
				config = res.connections[1];

				done();
			}, mqconfig);
		});

		it('should add connection with name "mocha-test"', function () {
			config.should.have.property('name', 'mocha-test');
		});

		it('should add connection with url "mongodb://user:pass@example.com:27017"', function () {
			config.should.have.property('url', 'mongodb://user:pass@example.com:27017');
		});

		it('should add connection with db "dev"', function () {
			config.should.have.property('db', 'dev');
		});
	});

	describe('setup() method', function () {
		before(function (done) {
			var data = {
				name: 'mocha-test-changed',
				active: true
			};

			configUtil.setup('mocha-test', data, function (err, res) {
				should.not.exist(error);
				should.exist(res);
				config = res.connections[1];

				done();
			}, mqconfig);
		});

		it('should have changed connection name', function () {
			config.should.have.property('name', 'mocha-test-changed');
		});

		it('should be active connection', function () {
			config.active.should.be.true;
		});
	});

	describe('showConnections() method', function () {
		var table;

		before(function (done) {
			configUtil.showConnections(function (err, str, res) {
				should.not.exist(error);
				should.exist(res);
				table = res;

				done();
			}, mqconfig);
		});

		it('should create table object with two connections', function () {
			table.length.should.equal(2);
		});

		it('should have table name heading', function () {
			table.options.head.should.include('Name');
		});

		it('should have table connection heading', function () {
			table.options.head.should.include('Connection');
		});

		it('should have table database heading', function () {
			table.options.head.should.include('Database');
		});

		it('should have table status heading', function () {
			table.options.head.should.include('Status');
		});
	});

	describe('removeConnection() method', function () {
		before(function (done) {
			configUtil.removeConnection('mocha-test-changed', function (err, res) {
				should.not.exist(error);
				should.exist(res);
				config = res;

				done();
			}, mqconfig);
		});

		it('should not contain connection object in config', function () {
			config.connections.length.should.equal(1);
		});
	});
});
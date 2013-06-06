describe('./src/configParser.spec.js', function () {
	'use strict';

	var config = require('../src/configParser.js');
	var should = require('should');
	var fs = require('fs');
	var path = require('path');

	var mqconfig = '../.mqconfig-test';
	var result, error;

	beforeEach(function (done) {
		fs.unlink(path.join(__dirname, mqconfig), function (err) {
			if (err) {
				return done(err);
			}
			done();
		});
	});

	describe('checkConfigFile() method', function () {
		beforeEach(function (done) {
			config.checkConfigFile(function (err) {
				error = err;
				done();
			}, mqconfig);
		});

		it('should not return an error', function () {
			should.not.exist(error);
		});
	});

	describe('saveConfigFile() method', function () {
		beforeEach(function (done) {
			var data = {
				name: 'mochaTest',
				db: 'dev',
				active: true
			};

			config.saveConfigFile(JSON.stringify(data), function (err) {
				error = err;
				done();
			}, mqconfig);
		});

		it('should not return an error', function () {
			should.not.exist(error);
		});
	});

	describe('addConnection() method', function () {

	});

	describe('removeConnection() method', function () {

	});

	describe('setup() method', function () {

	});

	describe('showConnections() method', function () {

	});
});
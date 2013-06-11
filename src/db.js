var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;

module.exports = db = {};

db.find = function (query, options) {

};

db.showDbs = function (callback) {
	MongoClient.connect('mongodb://localhost:27017/likeastoredb', function (err, db) {
		if (err) {
			return callback(err);
		}

		var adminDb = db.admin();
		adminDb.listDatabases(function (err, dbs) {
			if (err) {
				return callback(err);
			}

			callback(null, dbs);
		});
	});
};

// http://mongodb.github.io/node-mongodb-native/api-generated/admin.html
// http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html

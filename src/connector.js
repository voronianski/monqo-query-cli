var mongo = require('mongojs');
var fs = require('fs');
var path = require('path');
//var mqconfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../.mqconfig')));
var url = 'mongodb://localhost:27017/likeastoredb';

// TO DO: switch nativa mongodb driver api - http://mongodb.github.io/node-mongodb-native/api-generated/admin.html
function find (query, options, callback) {
	var queryObject = createQueryObject(query);

	if (!options.collection) {
		return callback('Sorry, but collection is not specified');
	}

	mongo(url).collection(options.collection).find(queryObject).toArray(function (err, res) {
		if (err) {
			return callback(err);
		}

		if (!res.length) {
			return callback('No documents found');
		}

		return callback(null, res);
	});
}

function createQueryObject (str) {
	if (!str) {
		return {};
	}

	var queries = str.split('&&');
	var obj = {};

	queries.forEach(function (q) {
		q = q.trim();

		var index = q.indexOf(':');
		var field = q.slice(0, index).replace(/^\"+|\"+$/g, '');
		var value = q.slice(index + 1).trim().replace(/^\"+|\"+$/g, '');

		value = isNaN(value) ? value : +value;
		obj[field] = value;
	});

	return obj;
}

module.exports = {
	find: find
};
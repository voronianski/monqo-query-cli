/**
 * Mongo-query-cli ascii text helper
 */

var colors = require('colors');

var text = [
	'                                                                                _ _ ',
	' _ __ ___   ___  _ __   __ _  ___         __ _ _   _  ___ _ __ _   _        ___| (_)',
	'|  _   _ \\ / _ \\|  _ \\ / _  |/ _ \\ _____ / _  | | | |/ _ \\  __| | | |_____ / __| | |',
	'| | | | | | (_) | | | | (_| | (_) |_____| (_| | |_| |  __/ |  | |_| |_____| (__| | |',
	'|_| |_| |_|\\___/|_| |_|\\__. |\\___/       \\__  |\\__._|\\___|_|   \\__. |      \\___|_|_|',
	'                       |___/                |_|                |___/                '
].join('\n');

text = colors.cyan(text);
module.exports = text;
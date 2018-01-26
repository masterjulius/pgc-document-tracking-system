var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	DepartmentLogSchema = mongoose.Schema({
		departmentId: ObjectId,
		userId: ObjectId,
		logType: String, // Add Update Delete Restore
		host: String,
		path: String,
		request: String,
		status: Number,
		responseSize: Number,
		referrer: String,
		userAgent: String,
		values: Array
	});

// 	{
// 	host: '127.0.0.1:3000',
// 	connection: 'keep-alive',
// 	'cache-control': 'max-age=0',
// 	'upgrade-insecure-requests': '1',
// 	'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
// 	accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
// 	'accept-encoding': 'gzip, deflate, br',
// 	'accept-language': 'en-US,en;q=0.9',
// 	cookie: 'connect.sid=s%3AoX2zp_5PORR4tuxVZMWlh8xNqHmaxecz.0RqKi2umWCqEyC%2F%2BwGOSD6dQmgVNTZH5u4XXClUx3VE',
// 	'if-none-match': 'W/"5b8-GbPOMXjRz+cd+KBNl7dAMkikWbE"'
// }
var DepartmentLog = module.exports = mongoose.model('DepartmentLog', DepartmentLogSchema, 'DepartmentLogs');

module.exports.saveToLogs = function(logDatas, callback) {
	logDatas.save(callback);
}	


var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	bcrypt = require('bcryptjs'),
	UserSchema = mongoose.Schema({
		username: {
			type: String,
			index:true
		},
		password: {
			type: String
		},
		roles: {
			type: ObjectId,
			ref: 'Role'
		},
		isActive: {
			type: Boolean,
			default: true
		}
	});


var User = module.exports = mongoose.model('User', UserSchema, 'Users');

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.getActiveUsersExcept = function(id, callback) {
	User.find({ $not: { _id: id } }, callback);
}

module.exports.getUserByUsername = function(username, callback) {
	User.findOne({username: username}, callback);
}

module.exports.comparePassword = function(password, hash, callback) {
	bcrypt.compare(password, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
}


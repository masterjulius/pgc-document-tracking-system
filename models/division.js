var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	DivisionSchema = mongoose.Schema({
		department: {
			type: ObjectId,
			ref: 'Department'
		},
		name: {
			type: String,
			required: true,
			uppercase: true,
			index: true
		},
		fullName: {
			type: String,
			required: true,
		},
		description: String,
		createdDate: {
			type: Date,
			default: Date.now
		},
		createdBy: String,
		updatedDate: {
			type: Date,
			default: Date.now
		},
		updatedBy: ObjectId,
		isActive: {
			type: Boolean,
			default: true
		}
	});

var Division = module.exports = mongoose.model('Division', DivisionSchema, 'Divisions');

module.exports.getDivisionById = function(id, callback) {
	Division.findById(id, callback).populate('department');
}

module.exports.getActiveDivisions = function(callback) {
	Division.find({
		isActive: true
	}, callback).populate('department').sort('-createdDate');
}
module.exports.createNewDivision = function(newDivision, callback) {
	newDivision.save(callback);
}
module.exports.updateDivision = function(id, set, callback) {
	Division.update({ _id: id }, { $set: set}, callback);
}
module.exports.deleteRestoreDivision = function(id, set, callback) {
	Division.update({ _id: id }, { $set: set}, callback);
}
module.exports.getDeletedDivisions = function(callback) {
	Division.find({
		isActive: false
	}, callback).sort('-updatedDate');
}
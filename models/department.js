var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	DepartmentSchema = mongoose.Schema({
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
		divisions: [{
			type: ObjectId,
			ref: 'Division'
		}],
		createdDate: {
			type: Date,
			default: Date.now
		},
		createdBy: String,
		updatedDate: {
			type: Date,
			default: Date.now
		},
		updatedBy: String,
		isActive: {
			type: Boolean,
			default: true
		}
	});

var Department = module.exports = mongoose.model('Department', DepartmentSchema, 'Departments');

module.exports.getDepartmentById = function(id, callback) {
	Department.findById(id, callback);
}

module.exports.getActiveDepartments = function(callback) {
	Department.find({
		isActive: true
	}, callback).sort('-createdDate');
}

module.exports.createNewDepartment = function(newDeparment, callback) {
	newDeparment.save(callback);
}

module.exports.updateDepartment = function(id, set, callback) {
	Department.update({ _id: id }, { $set: set}, callback);
}

module.exports.deleteRestoreDepartment = function(id, set, callback) {
	Department.update({ _id: id }, { $set: set }, callback);
}

module.exports.getDeletedDepartments = function(callback) {
	Department.find({
		isActive: false
	}, callback).sort('-updatedDate');
}
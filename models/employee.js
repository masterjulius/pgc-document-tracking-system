var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	EmployeeSchema = mongoose.Schema({
		firstName: {
			type: String,
			required: true,
			index: true
		},
		middleName: {
			type: String,
			required: true
		},
		lastName: {
			type: String,
			required: true
		},
		department: {
			type: ObjectId,
			ref: 'Department'
		},
		division: {
			type: ObjectId,
			ref: 'Division'
		},
		createdDate: {
			type: Date,
			default: Date.now
		},
		createdBy: {
			type: ObjectId,
			ref: 'User'
		},
		updatedDate: {
			type: Date,
			default: Date.now
		},
		updatedBy: {
			type: ObjectId,
			ref: 'User'
		},
		isActive: {
			type: Boolean,
			default: true
		}
	});

var Employee = module.exports = mongoose.model('Employee', EmployeeSchema, 'Employees');

module.exports.getEmployeeById = function(id, callback) {
	Employee.findById(id, callback)
	.populate('department')
	.populate('division')
	.populate('createdBy')
	.populate('updatedBy');
}

module.exports.getActiveEmployees = function(callback) {
	Employee.find({
		isActive: true
	}, callback)
	.populate('department')
	.populate('division')
	.populate('createdBy')
	.populate('updatedBy')
	.sort('-createdDate');
}

module.exports.getEmployeeDistinctField = function(fieldName, callback) {
	Employee.find({
		isActive: true
	}, callback)
	.distinct(fieldName);
}

module.exports.createNewEmployee = function(newDeparment, callback) {
	newDeparment.save(callback);
}

module.exports.updateEmployee = function(id, set, callback) {
	Employee.update({ _id: id }, { $set: set}, callback);
}

module.exports.deleteRestoreEmployee = function(id, set, callback) {
	Employee.update({ _id: id }, { $set: set }, callback);
}

module.exports.getDeletedEmployees = function(callback) {
	Employee.find({
		isActive: false
	}, callback).sort('-updatedDate');
}
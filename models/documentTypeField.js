var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	DocumentTypeFieldSchema = mongoose.Schema({
		name: {
			type: String,
			index: true,
			required: true
		},
		description: String,
		inputType: String,
		defaults: String,
		valueTable: String,
		createdDate: {
			type: Date,
			default: Date.now
		},
		createdBy: ObjectId,
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

var DocumentTypeField = module.exports = mongoose.model('DocumentTypeField', DocumentTypeFieldSchema, 'DocumentTypeFields');

module.exports.createNewField = function(newField, callback) {
	newField.save(callback);
}


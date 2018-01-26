var mongoose = require('mongoose'),
	ObjectId = mongoose.Schema.ObjectId,
	documentTypeSchema = mongoose.Schema({
		name: {
			type: String,
			index: true,
			required: true
		},
		description: String,
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

var DocumentType = module.exports = mongoose.model('DocumentType', documentTypeSchema, 'DocumentTypes');

module.exports.getDocumentTypeById = function(id, callback) {
	DocumentType.findById(id, callback);
}

module.exports.getActiveDocumentTypes = function(callback) {
	DocumentType.find({
			isActive: true
		}, callback).sort('-createdDate');
}

module.exports.createNewDocumentType = function(newDocumentType, callback) {
	newDocumentType.save(callback);
}

module.exports.updateDocumentType = function(id, set, callback) {
	DocumentType.update({ _id: id }, { $set: set }, callback);
}

module.exports.deleteDocumentType = function(id, set, callback) {
	DocumentType.update({ _id: id }, { $set: set }, callback);
}

module.exports.getDeletedDocumentTypes = function(callback) {
	DocumentType.find({
		isActive: false
	}, callback).sort('-updatedDate');
}
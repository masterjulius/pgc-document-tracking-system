var express = require('express'),
	router = express.Router(),
	// import Models
	DocumentType = require('../models/documentType'),
	DocumentTypeField = require('../models/documentTypeField'),
	utils = require('../helpers/utils');

/**
 * Main API
 */
router.get('/', utils.ensureAuthenticated, (req, res) => {
	var jsonResponse = { error: 404, message: 'You don\'t have the necessary credentials to access these datas' }
	res.header('Content-Type','application/json');
	res.send( formatJSON(jsonResponse) );
});

/**
 * -----------------------------------------------------------------------------------------------------
 * | Document Types Block																				|
 * -----------------------------------------------------------------------------------------------------
 */

/* Get Types */
router.get('/documents/types', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	DocumentType.getActiveDocumentTypes((err, documentTypes) => {
		if (err) throw err;
		res.header('Content-Type','application/json');
		res.send( formatJSON(documentTypes) );
	});
});

/* Save Types */
router.post('/documents/types/save', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	/**
	 * TODO: Create a functionality that checks for user role or capability to manage datas.
	 */
	var reqBody = req.body,
		newDocumentType = new DocumentType({
			name: reqBody.name,
			description: reqBody.description,
			createdBy: user._id,
			updatedBy: user._id,
		});
	DocumentType.createNewDocumentType(newDocumentType, (err, documentType) => {
		if (err) throw err;
		res.header('Content-Type','application/json');
		res.send( formatJSON(documentType) );
	});

});

/* Save Document Type Field */
router.post('/documents/types/field/save', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	/**
	 * TODO: Create a functionality that checks for user role or capability to manage datas.
	 */
	var reqBody = req.body,
		newDocumentField = new DocumentTypeField({
			name: reqBody.name,
			description: reqBody.description,
			inputType: reqBody.inputType,
			defaults: reqBody.defaults,
			valueTable: reqBody.valueTable,
			createdBy: user._id,
			updatedBy: user._id
		});

	DocumentTypeField.createNewField(newDocumentField, (err, field) => {
		if (err) throw err;
		res.header('Content-Type','application/json');
		res.send( formatJSON(field) );
	});
});

/**
 * -----------------------------------------------------------------------------------------------------
 * | End of Document Types Block																		|
 * -----------------------------------------------------------------------------------------------------
 */

// Format JSON
function formatJSON( data ) {
	return JSON.stringify(data, null, 4);
}

// Finally export the router
module.exports = router;
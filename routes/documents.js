var express = require('express'),
	router = express.Router()
	DocumentType = require('../models/documentType'),
	utils = require('../helpers/utils');

// Initializations
var colors = ['red', 'blue', 'lime accent-4', 'green', 'blue-grey darken-1', 'orange darken-4', 'brown darken-4', 'blue darken-4', 'red accent-3', 'purple accent-4', 'teal', 'amber accent-3', 'deep-orange darken-4', 'grey darken-3', 'light-green darken-3', 'pink'];

router.get('/', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	if (user) {
		res.render('dashboard/document/files/lists', {layout: 'dashboard'});
	} else {
		res.redirect('/');
	}
});

/**
 * -----------------------------------------------------------------------------------------------------
 * | Document Types Block																				|
 * -----------------------------------------------------------------------------------------------------
 */

router.get('/types', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	if (user) {
		DocumentType.getActiveDocumentTypes((err, documentTypes) => {
			if (err) throw err;
			utils.generateRandomInt();
			res.render('dashboard/document/types/lists', {layout: 'dashboard', data: documentTypes, colors: colors, startColor: utils.generateRandomInt( colors.length )});
		});
	} else {
		res.redirect('/');
	}
});

router.get('/types/:_id', utils.ensureAuthenticated, (req, res) => {
	var user = res.locals.user;
	if (user) {
		var id = req.param('id');
		res.render('dashboard/document/types/single', {layout: 'dashboard'});
	} else {
		res.redirect('/');
	}
});

/**
 * -----------------------------------------------------------------------------------------------------
 * | End of Document Types Block																		|
 * -----------------------------------------------------------------------------------------------------
 */

module.exports = router;
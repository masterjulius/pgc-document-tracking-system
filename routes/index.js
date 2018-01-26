var express = require('express'),
	router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
	res.render('index', {pageTitle: 'Account Sign In — Document Tracking System'});
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		res.redirect('/dashboard');	
	} else {
		return next();
	}
}

module.exports = router;
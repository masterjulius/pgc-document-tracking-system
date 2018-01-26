module.exports.generateRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Ensure Authentication
module.exports.ensureAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();	
	} else {
		res.redirect('/');
	}
}
var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/user');	

// LOGIN GROUP
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, (err, user) => {
			if (err) throw err;
			if (!user) return done(null, false, {message: 'Unknown User'});

			User.comparePassword(password, user.password, (err, isMatch) => {

				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid Password'});
				}

			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

// Login request
router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/',
		failureFlash: true
	}),
	(req, res) => {
		res.redirect('/dashboard')
	}
);

// Logout
router.get('/logout', (req, res, next) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/');
});

// END OF LOGIN GROUP

// Authentication
function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();	
	} else {
		res.redirect('/');
	}
}

module.exports = router;
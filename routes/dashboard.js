var express = require('express'),
	router = express.Router();

router.get('/', (req, res) => {
	var user = res.locals.user;
	res.render('dashboard/main', {layout: 'dashboard'})
});

module.exports = router;	
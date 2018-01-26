var express = require('express'),
	router = express.Router(),
	Department = require('../models/department'),
	DepartmentLog = require('../models/department-log');

// Main
router.get('/', (req, res) => {
	// Get datas
	var user = res.locals.user;
	if (user) {
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			res.render('dashboard/department/lists', {layout: 'dashboard', data: departments});
		});
	} else {
		res.redirect('/');
	}
});

// Add New
router.get('/new', (req, res) => {
	res.render('dashboard/department/new', {layout: 'dashboard'})
});

router.post('/new', (req, res) => {
	var user = res.locals.user,
		requestBody = req.body,
		name = requestBody.name,
		fullName = requestBody.fullName,
		description = requestBody.description;

	// Validate
	req.checkBody('name', 'Accronym is required').notEmpty();
	req.checkBody('fullName', 'Full office name is required').notEmpty();

	var errors = req.validationErrors(true);

	if (errors) {
		res.render('dashboard/department/error-form', {
			layout: 'dashboard',
			errors: errors,
			value: requestBody
		});
	} else {

		var newDeparment = new Department({
			name: name,
			fullName: fullName,
			description: description,
			createdBy: user._id,
			updatedBy: user._id
		});

		Department.createNewDepartment(newDeparment, (err, department) => {
			if (err) throw err;
			req.flash('success_msg', 'Successfully created Department!');
			var targetUrl = '/departments/edit/' + department._id;
			if ( requestBody.newForm ) {
				targetUrl = '/departments/new/';
			}
			res.redirect(targetUrl);
		});

	}


});

// Edit
router.get('/edit/:_id', (req, res) => {
	var id = req.param('_id');
	Department.getDepartmentById(id, (err, department) => {
		if (err) throw err;
		res.render('dashboard/department/edit', {layout: 'dashboard', data: department});
	});
});

router.post('/edit', (req, res) => {
	var user = res.locals.user,
		requestBody = req.body,
		id = requestBody._id,
		query = {
			name		: requestBody.name,
			fullName	: requestBody.fullName,
			description	: requestBody.description,
			updatedDate: Date.now(),
			updatedBy: user._id
		}
	Department.updateDepartment(id, query, (err, department) => {
		if (err) throw err;
		req.flash('success_msg', 'Successfully edited Department!');
		res.redirect('/departments/edit/' + id);
	});
});

// View

// Log View

// Delete
router.get('/delete/:_id', (req, res) => {
	var requestBody = req.body,
		id = req.param('_id');	
	res.render('dashboard/dialogs/confirm', {
		layout: 'dashboard',
		dialogData: {
			targetUrl: '/departments/delete/',
			msg: 'Are you sure you want to delete this department?',
			_id: id
		}
	});
});

router.post('/delete', (req, res) => {
	var user = res.locals.user,
		requestBody = req.body,
		id = requestBody._id;
	if ( requestBody.confirmYes ) {
		// Delete Now
		Department.deleteRestoreDepartment(id,
			{
				updatedDate: Date.now(),
				updatedBy: user._id,
				isActive: false
			},
			(err, department) => {
				if (err) throw err;
				req.flash('success_msg', 'Successfully deleted department');
				res.redirect('/departments/');
			});
	} else {
		res.redirect('/departments/');
	}
});

// Recycle Bin
router.get('/recycles', (req, res) => {
	// Get datas
	var user = res.locals.user;
	if (user) {
		Department.getDeletedDepartments((err, departments) => {
			if (err) throw err;
			res.render('dashboard/department/recycles.handlebars', {layout: 'dashboard', data: departments});
		});
	} else {
		res.redirect('/');
	}
});

// Restore
router.get('/restore/:_id', (req, res) => {
	var user = res.locals.user;
	if (user) {
		id = req.param('_id');	
		res.render('dashboard/dialogs/confirm', {
			layout: 'dashboard',
			dialogData: {
				targetUrl: '/departments/restore/',
				msg: 'Are you sure you want to restore this department?',
				_id: id
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/restore', (req, res) => {
	var user = res.locals.user
	if (user) {
		var requestBody = req.body,
			id = requestBody._id;
		if ( requestBody.confirmYes ) {
			// Restore Now
			Department.deleteRestoreDepartment(id,
				{
					updatedDate: Date.now(),
					updatedBy: user._id,
					isActive: true
				},
				(err, department) => {
					if (err) throw err;
					req.flash('success_msg', 'Successfully delete department');
					res.redirect('/departments/');
				});
		} else {
			res.redirect('/departments/');
		}
	} else {
		res.redirect('/');
	}
});

module.exports = router;	
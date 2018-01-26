var express = require('express'),
	router = express.Router(),
	Department = require('../models/department'),
	Division = require('../models/division');

router.get('/', (req, res) => {
	var user = res.locals.user;
	if (user) {
		Division.getActiveDivisions((err, divisions) => {
			if (err) throw err;
			res.render('dashboard/division/lists', {layout: 'dashboard', data: divisions});
		});
	} else {
		res.redirect('/');
	}
});

// New
router.get('/new', (req, res) => {
	var user = res.locals.user;
	if (user) {
		// Get Departments
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			departments = JSON.stringify(departments);
			res.render('dashboard/division/new', {layout: 'dashboard', departments: departments});
		});
	} else {
		res.redirect('/');
	}
});

router.post('/new', (req, res) => {
	var user = res.locals.user,
		requestBody = req.body,
		departmentId = requestBody.departmentId,
		name = requestBody.name,
		fullName = requestBody.fullName,
		description = requestBody.description;

	// Validate
	req.checkBody('departmentId', 'Department is required').notEmpty();
	req.checkBody('name', 'Accronym is required').notEmpty();
	req.checkBody('fullName', 'Full office name is required').notEmpty();

	var errors = req.validationErrors(true);

	if (errors) {
		// Get Departments
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			var departments = JSON.stringify(departments);
			res.render('dashboard/division/error-form', {
				layout: 'dashboard',
				errors: errors,
				value: req.body,
				departments: departments,
				targetUrl: 'new/'
			});
		});	
	} else {

		var newDivision = new Division({
			department: departmentId,
			name: name,
			fullName: fullName,
			description: description,
			createdBy: user._id,
			updatedBy: user._id
		});

		Division.createNewDivision(newDivision, (err, division) => {
			if (err) throw err;
			// Find Department By Id
			Department.getDepartmentById(departmentId, (err, deptRes) => {
				// Push To deptRes
				deptRes.divisions.push( division._id );
				// Save use save() method
				deptRes.save( (err, success) => {
					if (err) throw err;
					// Next Action
					req.flash('success_msg', 'Successfully created Division!');
					var targetUrl = '/divisions/edit/' + division._id;
					if ( requestBody.newForm ) {
						targetUrl = '/divisions/new/';
					}
					res.redirect(targetUrl);
				} );
			});

		});

	}

});

// Edit
router.get('/edit/:_id', (req, res) => {
	// Get Departments
	var user = res.locals.user;
	if (user) {
		var id = req.param('_id');
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			var departments = JSON.stringify(departments);
			Division.getDivisionById(id, (err, division) => {
				if (err) throw err;
				res.render('dashboard/division/edit', {layout: 'dashboard', departments: departments, datas: division});
			});
		});
	} else {
		res.redirect('/');
	}
});

router.post('/edit/', (req, res) => {
	var user = res.locals.user,
		requestBody = req.body,
		departmentId = requestBody.departmentId,
		name = requestBody.name,
		fullName = requestBody.fullName,
		description = requestBody.description;

	// Validate
	req.checkBody('departmentId', 'Department is required').notEmpty();
	req.checkBody('name', 'Accronym is required').notEmpty();
	req.checkBody('fullName', 'Full office name is required').notEmpty();

	var errors = req.validationErrors(true);

	if (errors) {
		// Get Departments
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			var departments = JSON.stringify(departments);
			res.render(
				'dashboard/division/error-form',
				{
					layout: 'dashboard',
					errors: errors,
					value: req.body,
					departments: departments,
					formEdit: true,
					targetUrl: 'edit/'
				}
			);
		});
	} else {

	}
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
			targetUrl: '/divisions/delete/',
			msg: 'Are you sure you want to delete this division?',
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
		Division.deleteRestoreDivision(id,
			{
				updatedDate: Date.now(),
				updatedBy: user._id,
				isActive: false
			},
			(err, department) => {
				if (err) throw err;
				req.flash('success_msg', 'Successfully deleted division');
				res.redirect('/divisions/');
			}
		);
	} else {
		res.redirect('/departments/');
	}
});

// Recycle Bin
router.get('/recycles', (req, res) => {
	var user = res.locals.user;
	if (user) {
		Division.getDeletedDivisions((err, divisions) => {
			if (err) throw err;
			res.render('dashboard/division/recycles', {layout: 'dashboard', data: divisions});
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
				targetUrl: '/divisions/restore/',
				msg: 'Are you sure you want to restore this division?',
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
			Division.deleteRestoreDivision(
				id,
				{
					updatedDate: Date.now(),
					updatedBy: user._id,
					isActive: true
				},
				(err, department) => {
					if (err) throw err;
					req.flash('success_msg', 'Successfully delete division');
					res.redirect('/divisions/');
				}
			);
		} else {
			res.redirect('/departments/');
		}
	} else {
		res.redirect('/');
	}
});

module.exports = router;
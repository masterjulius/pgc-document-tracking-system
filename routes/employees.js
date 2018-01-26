var express = require('express'),
	router = express.Router()
	Employee = require('../models/employee'),
	Department = require('../models/department'),
	Division = require('../models/division');

// Main
router.get('/', (req, res) => {
	var user = res.locals.user;
	if (user) {
		Employee.getActiveEmployees((err, employees) => {
			if (err) throw err;
			res.render('dashboard/employee/lists', {layout: 'dashboard', data: employees});
		});
	} else {
		res.redirect('/');
	}
});

// Add New
router.get('/new', (req, res) => {
	var user = res.locals.user;
	if (user) {
		// Get Departments
		Department.getActiveDepartments((err, departments) => {
			if (err) throw err;
			Division.getActiveDivisions((err, divisions) => {
				if (err) throw err;
				// Get Distinct First Names
				Employee.getEmployeeDistinctField('firstName', (err, firstNames) => {
					// Get  Distinct Middle Names
					if (err) throw err;
					Employee.getEmployeeDistinctField('middleName', (err, middleNames) => {
						// Get  Distinct Last Names
						if (err) throw err;
						Employee.getEmployeeDistinctField('lastName', (err, lastNames) => {
							// Get  Distinct Last Names
							if (err) throw err;	
							res.render(
								'dashboard/employee/new',
								{
									layout: 'dashboard',
									autofillDatas: {
										departments: JSON.stringify(departments),
										divisions: JSON.stringify(divisions),
										firstNames: JSON.stringify(firstNames),
										middleNames: JSON.stringify(middleNames),
										lastNames: JSON.stringify(lastNames),
									}
								}
							);
								
						});	
					});
				});

			});	
		});
	} else {
		res.redirect('/');
	}
});

router.post('/new', (req, res) => {
	var user = res.locals.user,
		reqBody = req.body,
		departmentId = reqBody.departmentId,
		divisionId = reqBody.divisionId,
		firstName = reqBody.firstName,
		middleName = reqBody.middleName,
		lastName = reqBody.lastName;
	
	// Validate
	req.checkBody('departmentId', 'Department is required').notEmpty();
	req.checkBody('divisionId', 'Division is required').notEmpty();
	req.checkBody('firstName', 'First Name is required').notEmpty();
	req.checkBody('lastName', 'Last Name is required').notEmpty();

	var errors = req.validationErrors(true);

	if (errors) {
		res.render(
			'dashboard/employee/error-form',
			{
				layout: 'dashboard',
				errors: errors,
				value: reqBody
			}
		);
	} else {

		var newEmployee = new Employee({
			firstName : firstName,
			middleName : middleName,
			lastName : lastName,
			department : departmentId,
			division : divisionId,
			createdBy : user._id,
			updatedBy : user._id
		});

		Employee.createNewEmployee(newEmployee, (err, employee) => {
			if (err) throw err;
			req.flash('success_msg', 'Successfully created Department!');
			var targetUrl = '/employees/edit/' + employee._id;
			if ( reqBody.newForm ) {
				targetUrl = '/employees/new/';
			}
			res.redirect(targetUrl);
		});

	}

});

// Edit
router.get('/edit/:_id', (req, res) => {
	var user = res.locals.user;
	if (user) {
		var id = req.param('_id');
		Employee.getEmployeeById(id, (err, employee) => {
			if (err) throw err;
			// Get Departments
			Department.getActiveDepartments((err, departments) => {
				if (err) throw err;
				// Get Divisions
				Division.getActiveDivisions((err, divisions) => {
					if (err) throw err;
					// Get Distinct First Names
					Employee.getEmployeeDistinctField('firstName', (err, firstNames) => {
						// Get  Distinct Middle Names
						if (err) throw err;
						Employee.getEmployeeDistinctField('middleName', (err, middleNames) => {
							// Get  Distinct Last Names
							if (err) throw err;
							Employee.getEmployeeDistinctField('lastName', (err, lastNames) => {
								// Get  Distinct Last Names
								if (err) throw err;

								res.render(
									'dashboard/employee/edit',
									{
										layout: 'dashboard',
										datas: employee,
										autofillDatas: {
											departments: JSON.stringify(departments),
											divisions: JSON.stringify(divisions),
											firstNames: JSON.stringify(firstNames),
											middleNames: JSON.stringify(middleNames),
											lastNames: JSON.stringify(lastNames),
										}
									}
								);

							});	
						});
					});
				});	
			});
		});
	} else {
		res.redirect('/');
	}
});

router.post('/edit', (req, res) => {
	var user = res.locals.user,
		reqBody = req.body,
		employeeId = reqBody.employeeId,
		departmentId = reqBody.departmentId,
		divisionId = reqBody.divisionId,
		firstName = reqBody.firstName,
		middleName = reqBody.middleName,
		lastName = reqBody.lastName;

	// Validate
	req.checkBody('departmentId', 'Department is required').notEmpty();
	req.checkBody('divisionId', 'Division is required').notEmpty();
	req.checkBody('firstName', 'First Name is required').notEmpty();
	req.checkBody('lastName', 'Last Name is required').notEmpty();

	var errors = req.validationErrors(true);

	if (errors) {
		res.render(
			'dashboard/employee/error-form',
			{
				layout: 'dashboard',
				errors: errors,
				value: reqBody,
				formEdit: true
			}
		);
	} else {
		var query = {
			firstName: firstName,
			middleName: middleName,
			lastName: lastName,
			department: departmentId,
			division: divisionId,
			updatedDate: Date.now(),
			updatedBy: user._id
		}
		Employee.updateEmployee(employeeId, query, (err, employee) => {
			if (err) throw err;
			req.flash('success_msg', 'Successfully updated Employee');
			res.redirect('/employees/edit/' + employeeId);
		});
	}

});

// View

// Log View

// Delete
router.get('/delete/:_id', (req, res) => {
	var user = res.locals.user;
	if (user) {
		var requestBody = req.body,
			id = req.param('_id');	
		res.render('dashboard/dialogs/confirm', {
			layout: 'dashboard',
			dialogData: {
				targetUrl: '/employees/delete/',
				msg: 'Are you sure you want to delete this employee?',
				_id: id
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/delete', (req, res) => {
	var user = res.locals.user;
	if (user) {
		var requestBody = req.body,
			id = requestBody._id;
		if ( requestBody.confirmYes ) {
			// Delete Now
			Employee.deleteRestoreEmployee(id,
				{
					updatedDate: Date.now(),
					updatedBy: user._id,
					isActive: false
				},
				(err, department) => {
					if (err) throw err;
					req.flash('success_msg', 'Successfully deleted employee');
					res.redirect('/employees/');
				}
			);
		} else {
			res.redirect('/employees/');
		}	
	} else {
		res.redirect('/');
	}
});

// Recycle Bin
router.get('/recycles', (req, res) => {
	var user = res.locals.user;
	if (user) {
		// Get Deleted Employees
		Employee.getDeletedEmployees((err, employees) => {
			if (err) throw err;
			res.render('dashboard/employee/recycles', {layout: 'dashboard', data: employees});
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
				targetUrl: '/employees/restore/',
				msg: 'Are you sure you want to restore this employee?',
				_id: id
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/restore', (req, res) => {
	var user = res.locals.user;
	if (user) {
		var reqBody = req.body,
			id = reqBody._id;
		if ( reqBody.confirmYes ) {
			// Delete Now
			Employee.deleteRestoreEmployee(id,
				{
					updatedDate: Date.now(),
					updatedBy: user._id,
					isActive: true
				},
				(err, department) => {
					if (err) throw err;
					req.flash('success_msg', 'Successfully restored employee');
					res.redirect('/employees/');
				}
			);
		} else {
			res.redirect('/employees/');
		}	
	} else {
		res.redirect('/');
	}
});

module.exports = router;
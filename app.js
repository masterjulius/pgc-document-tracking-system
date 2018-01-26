var express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	exphbs = require('express-handlebars'),
	expressValidator = require('express-validator'),
	flash = require('connect-flash'),
	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongo = require('mongodb'),
	mongoose = require('mongoose'),
	port = process.env.PORT || 3000;

mongoose.connect('mongodb://su:pAssw0rd@127.0.0.1:27017/DocumentTracking', {auth:{authdb:"admin"}});
var db = mongoose.connection;

var routes = require('./routes/index'),
	users = require('./routes/users'),
	dashboard = require('./routes/dashboard'),
	departments = require('./routes/departments');
	divisions = require('./routes/divisions');
	employees = require('./routes/employees'),
	documents = require('./routes/documents'),
	// API route
	api = require('./routes/api');	

// Initialize app
var app = express();

// jQuery Plugins

// Initialize view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
	defaultLayout:'layout',
	helpers: require("./helpers/handlebars.js").helpers
}));
// app.engine('handlebars', );
app.set('view engine', 'handlebars');

// Use public forder
app.use('/virtualpath', express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.reqHeaders = req.headers;
	res.locals.ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
	// console.log(res.locals.reqHeaders);
	next();
});

// Use Routes
app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/departments', departments);
app.use('/divisions', divisions);
app.use('/employees', employees);
app.use('/documents', documents);
app.use('/api', api);

// Set Port
app.set('port', ( port ));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port') );
});
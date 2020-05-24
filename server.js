var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");

var helmet = require("helmet");
var logger = require("morgan");
var session = require("express-session");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var compression = require("compression");
var cookieParser = require("cookie-parser");

var configDB = require("./server/config/database");
var routes = require("./server/routes/index");

var app = express();

// configuration for authentications with passport
require("./server/config/passport")(passport);

// configuration to connect to our database
mongoose.connect(configDB.url);

// view engine setup
app.set("views", path.join(__dirname, "/server/views"));
app.set("view engine", "ejs");

// disable default x-powered-by from express
app.disable("x-powered-by");

// setting up favicon icon for application.
app.use(favicon(__dirname + "/public/favicon.ico"));

// setting up logging for dev environment
app.use(logger("dev"));

// http header setup for various attacks.
app.use(helmet());

// setting up body and cookie parsers.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// configuration required for passport
app.use(session({ secret: "thisisassessionsecretwhichwillbetoolongtotraceback" }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(path.join(__dirname, "/public"), { maxAge: 60000 })); //Expose //public

app.use(compression()); // Setting up compression technique.

// Setting up default routing mechanism.
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	console.log(err.message);
	res.render("error", {
		message: err.message,
		error: {},
	});
});

module.exports = app;

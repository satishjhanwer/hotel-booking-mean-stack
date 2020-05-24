/*jslint node: true */
"use strict";

var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

/**
 * expose this function to our app using module.exports
 * @param  {[type]} passport
 * @return {[type]}
 */
module.exports = function (passport) {
	/**
	 * required for persistent login sessions
	 * passport needs ability to serialize and deserialize users out of session
	 * used to serialize the user for the session
	 *
	 * @param  {[type]}   user
	 * @param  {Function} done
	 * @return {[type]}
	 */
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	/**
	 * used to deserialize the user
	 *
	 * @param  {[type]}   id
	 * @param  {Function} done
	 * @return {[type]}
	 */
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	/**
     * we are using named strategies since we have one for login and one for signup
     * by default, if there was no name, it would just be called 'local'
     *
     * @param  {[type]} req
     * @param  {[type]} email
     * @param  {[type]} password

     * @return {[type]}
     */
	passport.use(
		"local-signup",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				if (email) {
					email = email.toLowerCase(); // avoid case-sensitive e-mail matching
				}

				/**
				 * asynchronous
				 * User.findOne wont fire unless data is sent back
				 *
				 * @return {[type]}
				 */
				process.nextTick(function () {
					User.findOne({ email: email }, function (err, user) {
						if (err) {
							return done(err);
						}
						if (user) {
							return done(null, { error: "That email is already taken." });
						} else {
							var newUser = new User();
							newUser.email = email;
							newUser.firstName = req.body.firstName;
							newUser.lastName = req.body.lastName;
							newUser.password = newUser.generateHash(password);

							newUser.save(function (err) {
								if (err) {
									throw err;
								}
								return done(null, newUser);
							});
						}
					});
				});
			},
		),
	);

	/**
	 * we are using named strategies since we have one for login and one for signup
	 * by default, if there was no name, it would just be called 'local'
	 *
	 * @param  {[type]} req
	 * @param  {[type]} email
	 * @param  {[type]} password
	 * @return {[type]}
	 */
	passport.use(
		"local-login",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				passReqToCallback: true,
			},
			function (req, email, password, done) {
				if (email) {
					email = email.toLowerCase();
				}

				/**
				 * asynchronous
				 * User.findOne wont fire unless data is sent back
				 *
				 * @return {[type]}
				 */
				process.nextTick(function () {
					User.findOne({ email: email }, function (err, user) {
						if (err) {
							return done(err);
						}
						if (!user) {
							return done(null, { error: "No user found. " });
						}
						if (!user.validPassword(password)) {
							return done(null, { error: "Oops! Wrong password." });
						} else {
							return done(null, user);
						}
					});
				});
			},
		),
	);
};

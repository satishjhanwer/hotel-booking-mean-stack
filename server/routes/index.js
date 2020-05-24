/*jslint node: true */
"use strict";

var express = require("express");
var passport = require("passport");

var router = express.Router();

var User = require("../models/user");
var Hotel = require("../models/hotel");
var Booking = require("../models/booking");

/**
 * route middleware to make sure a user is logged in
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {Boolean}
 */
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/");
}

/**
 * route middleware to make sure a admin user is logged in
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {Boolean}
 */
function isAdminLoggedIn(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin === true) {
		return next();
	}
	res.redirect("/");
}

/**
 * route middleware to ensure user is logged in - ajax get
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {Boolean}
 */
function isLoggedInAjax(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.json({ redirect: "/login" });
	} else {
		next();
	}
}

/**
 * route to handle user registration request
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
router.post("/signup", function (req, res, next) {
	if (!req.body.email || !req.body.password) {
		return res.json({ error: "Email and Password required" });
	}
	passport.authenticate("local-signup", function (err, user, info) {
		if (err) {
			return res.json(err);
		}
		if (user.error) {
			return res.json({ error: user.error });
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.json(err);
			}
			return res.json({ redirect: "/profile" });
		});
	})(req, res);
});

/**
 * route to handle login request
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {[type]}
 */
router.post("/login", function (req, res, next) {
	if (!req.body.email || !req.body.password) {
		return res.json({ error: "Email and Password required" });
	}
	passport.authenticate("local-login", function (err, user, info) {
		if (err) {
			return res.json(err);
		}
		if (user.error) {
			return res.json({ error: user.error });
		}
		req.logIn(user, function (err) {
			if (err) {
				return res.json(err);
			}
			return res.json(user);
		});
	})(req, res);
});

/**
 * route to handle logout request.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.post("/logout", function (req, res) {
	req.logout();
	res.json({ success: "You have been logout successfully!!!." });
});

/**
 * route to load user date on user home page.
 * Only if user is logged in and user is having admin rights.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get("/api/admin/users/", isLoggedInAjax, isAdminLoggedIn, function (req, res) {
	User.find()
		.where("_id")
		.ne(req.user._id)
		.sort("firstName")
		.exec(function (err, users) {
			if (err) {
				return res.json(err);
			}
			return res.json(users); // return all users in JSON format
		});
});

/**
 * route to delete user based on user id.
 * Only if user is logged in and user is having admin rights.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.delete("/api/admin/users/:id", isLoggedInAjax, isAdminLoggedIn, function (req, res) {
	User.findOne({ _id: req.params.id }).exec(function (err, user) {
		if (err) {
			return res.json(err);
		}
		if (user) {
			user.remove();
			return res.json({ redirect: "/admin" });
		} else {
			return res.json(err);
		}
	});
});

/**
 * route to list down all hotels and load a specific hotel detail if id is provided.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get("/api/hotels/:id?", isLoggedInAjax, function (req, res) {
	if (req.params.id) {
		Hotel.findOne({ _id: req.params.id }, function (err, hotel) {
			if (err) {
				return res.json(err);
			}
			if (hotel) {
				return res.json(hotel); // return hotel in JSON format
			} else {
				return res.json(err);
			}
		});
	} else {
		Hotel.find(function (err, hotels) {
			if (err) {
				return res.json(err);
			}
			return res.json(hotels); // return all hotels in JSON format
		});
	}
});

/**
 * route to create new hotel based on request data.
 * Only if user is logged in and user is having admin rights.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.post("/api/admin/hotels", isLoggedInAjax, isAdminLoggedIn, function (req, res) {
	var hotel = new Hotel(req.body);
	hotel.save(function (err) {
		if (err) {
			throw err;
		}
		return res.json({ redirect: "/admin" });
	});
});

/**
 * route to delete hotel based on hotel id.
 * Only if user is logged in and user is having admin rights.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.delete("/api/admin/hotels/:id", isLoggedInAjax, isAdminLoggedIn, function (req, res) {
	Hotel.findOne({ _id: req.params.id }).exec(function (err, hotel) {
		if (err) {
			return res.json(err);
		}
		if (hotel) {
			hotel.remove();
			return res.json({ redirect: "/admin" });
		} else {
			return res.json(err);
		}
	});
});

/**
 * route to load hotels based on searched term.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.post("/api/hotels/search", isLoggedInAjax, function (req, res) {
	var regex = new RegExp(req.body.term, "i"); // 'i' makes it case insensitive
	Hotel.find({ name: regex })
		.where("roomCount")
		.gt(0)
		.sort("name")
		.exec(function (err, hotels) {
			if (err) {
				return res.json(err);
			}
			if (!hotels.length) {
				return res.json({
					error: "No hotel found for the given search input. ",
				});
			}
			Booking.find({ user: req.user })
				.populate("hotel")
				.exec(function (err, bookings) {
					if (err) {
						return res.json(err);
					}
					if (!bookings.length) {
						return res.json(hotels); // return all hotels in JSON format
					}
					var resultHotels = [];
					for (var i = hotels.length - 1; i >= 0; i--) {
						if (bookings.indexOf(hotels[i]) !== -1) {
							resultHotels.push(hotels);
						}
					}
					if (!resultHotels.length) {
						return res.json({
							error: "No hotel found for the given search input. ",
						});
					}
					return res.json(resultHotels); // return all hotels in JSON format
				});
		});
});

/**
 * route to list down all the bookings done my user.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get("/api/bookings", isLoggedInAjax, function (req, res) {
	Booking.find({ user: req.user }, function (err, bookings) {
		if (err) {
			return res.json(err);
		}
		return res.json(bookings); // return all bookings in JSON format
	});
});

/**
 * route to create a new booking based on user data.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.post("/api/bookings", isLoggedInAjax, function (req, res) {
	Hotel.findOne({ _id: req.body.hotel._id }, function (err, hotel) {
		if (err) {
			return res.json(err);
		}
		if (hotel) {
			hotel.bookHotel(function (err, hotel) {
				if (err) {
					throw err;
				}
				var booking = new Booking();
				booking.creditCardName = req.body.creditCardName;
				booking.creditCard = req.body.creditCard;
				booking.securityCode = req.body.securityCode;
				booking.month = req.body.month;
				booking.year = req.body.year;
				booking.roomType = req.body.roomType;
				booking.checkInDate = new Date(req.body.checkInDate);
				booking.checkOutDate = new Date(req.body.checkOutDate);
				booking.hotel = hotel;
				booking.user = req.user;
				booking.save(function (err) {
					if (err) {
						throw err;
					}
					return res.json({ redirect: "/profile" });
				});
			});
		} else {
			return res.json(err);
		}
	});
});

/**
 * route to cancel booking based on booking id.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.delete("/api/bookings/:id", isLoggedInAjax, function (req, res) {
	Booking.findOne({ _id: req.params.id, user: req.user._id }).exec(function (err, booking) {
		if (err) {
			return res.json(err);
		}

		if (booking) {
			Hotel.findOne({ _id: booking.hotel }, function (err, hotel) {
				if (err) {
					return res.json(err);
				}
				hotel.cancelHotel(function (err, hotel) {
					if (err) {
						throw err;
					}
					booking.remove();
					return res.json({ redirect: "/profile" });
				});
			});
		} else {
			return res.json(err);
		}
	});
});

/**
 * general route to load templates.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get("*", function (req, res) {
	let user = {};
	if (req.user) {
		user = {
			isAdmin: req.user.isAdmin,
			email: req.user.email,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
		};
	}
	res.render("index", {
		title: "Hotel Booking System",
		user: user,
	});
});

module.exports = router;

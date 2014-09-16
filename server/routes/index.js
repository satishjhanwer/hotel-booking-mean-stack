/*jslint node: true */
"use strict";

var express  = require('express');
var passport = require('passport');

var router   = express.Router();

var Hotel    = require('../models/hotel');
var Booking  = require('../models/booking');

/**
 * route middleware to make sure a user is logged in
 *
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 * @return {Boolean}
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
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
        return res.json( { redirect: '/login' } );
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
router.post('/signup', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
            return res.json(err);
        }
        if (user.error) {
            return res.json({ error: user.error });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.json(err);
            }
            return res.json({ redirect: '/profile' });
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
router.post('/login', function(req, res, next) {
    if(!req.body.email || !req.body.password){
        return res.json({ error: 'Email and Password required' });
    }
    passport.authenticate('local-login', function(err, user, info) {
        if(err){
            return res.json(err);
        }
        if (user.error) {
            return res.json({ error: user.error });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.json(err);
            }
            return res.json({ redirect: '/profile' });
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
router.post('/logout', function(req, res) {
    req.logout();
    res.json({ redirect: '/logout' });
});

/**
 * route to load user date on user home page.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get('/api/userData', isLoggedInAjax, function(req, res) {
    return res.json(req.user);
});

/**
 * route to list down all hotels and load a specific hotel detail if id is provided.
 * Only if user is logged in.
 *
 * @param  {[type]} req
 * @param  {[type]} res
 * @return {[type]}
 */
router.get('/api/hotels/:id?', isLoggedInAjax, function(req, res){
    if(req.params.id){
        Hotel.findOne({ _id: req.params.id }, function(err, hotel) {
            if (err) {
                return res.json(err);
            }
            if(hotel){
                return res.json(hotel); // return hotel in JSON format
            }
            else{
                return res.json(err);
            }
        });
    }else{
        Hotel.find(function(err, hotels) {
            if (err) {
                return res.json(err);
            }
            return res.json(hotels); // return all hotels in JSON format
        });
    }
});

/**
 * route to load hotels based on searched term.
 * Only if user is logged in.
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
router.post('/api/hotels/search', isLoggedInAjax, function(req, res){
    var regex = new RegExp(req.body.term, 'i');  // 'i' makes it case insensitive
    Hotel.find({name: regex}, function(err, hotels) {
        if (err) {
            return res.json(err);
        }
        return res.json(hotels); // return all hotels in JSON format
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
router.get('/api/bookings', isLoggedInAjax, function(req, res){
    Booking.find({user: req.user}, function(err, bookings) {
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
router.post('/api/bookings', isLoggedInAjax, function(req, res){
    Hotel.findOne({ _id: req.body.hotel._id }, function(err, hotel){
        if(err){
            return res.json(err);
        }
        if(hotel){
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
            booking.save(function(err){
                if (err) {
                    throw err;
                }
                return res.json( { redirect: '/profile' } );
            });
        }else{
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
router.delete('/api/bookings/:id', isLoggedInAjax, function(req, res){
    Booking.findOne({ _id: req.params.id, user: req.user._id}).exec(function(err, booking){
        if(err){
            return res.json(err);
        }

        if(booking){
            booking.remove();
            return res.json( { redirect: '/profile' } );
        }else{
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
router.get('*', function(req, res) {
  res.render('index', { title: 'Hotel Booking System', user: req.user ? req.user : null });
});

module.exports = router;

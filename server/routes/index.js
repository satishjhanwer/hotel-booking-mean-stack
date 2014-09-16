var express = require('express');
var passport = require('passport');
var router = express.Router();
var Hotel = require('../models/hotel');
var Booking = require('../models/booking');

router.post('/logout', function(req, res) {
   req.logout();
   res.json({ redirect: '/logout' });
});

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

router.get('/api/userData', isLoggedInAjax, function(req, res) {
  console.log(req.user);
  return res.json(req.user);
});

router.get('/api/hotels/:id?', isLoggedInAjax, function(req, res){
    if(req.params.id){
        Hotel.findOne({ _id: req.params.id }, function(err, hotel) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
              res.send(err);
            if(hotel){
              res.json(hotel); // return hotel in JSON format
            }
            else{
              res.send(err);
            }
        });
    }else{
        Hotel.find(function(err, hotels) {
          // if there is an error retrieving, send the error. nothing after res.send(err) will execute
          if (err)
            res.send(err);

          res.json(hotels); // return all hotels in JSON format
        });
    }
});


router.get('/api/bookings', isLoggedInAjax, function(req, res){
    Booking.find({user: req.user}, function(err, bookings) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err);

      res.json(bookings); // return all hotels in JSON format
    });
});

router.post('/api/bookings', isLoggedInAjax, function(req, res){
    console.log(req.body);
    Hotel.findOne({ _id: req.body.hotel._id }, function(err, hotel){
        if(err)
            res.sned(err);

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
                if (err)
                    throw err;
                return res.json( { redirect: '/profile' } );
            });
        }else{
          res.send(err);
        }
    });
});

router.delete('/api/bookings/:id', isLoggedInAjax, function(req, res){
    Booking.findOne({ _id: req.params.id, user: req.user._id}).exec(function(err, booking){
        if(err)
            res.send(err);

        if(booking != null){
            booking.remove();
            return res.json( { redirect: '/profile' } );
        }else{
          res.send(err);
        }
    });
});

router.post('/api/hotels/search', isLoggedInAjax, function(req, res){
    console.log(req.body.term);
    var regex = new RegExp(req.body.term, 'i');  // 'i' makes it case insensitive
    Hotel.find({name: regex}, function(err, hotels) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err);

      res.json(hotels); // return all hotels in JSON format
    });
});

router.get('*', function(req, res) {
  res.render('index', { title: 'Express', user: req.user ? req.user : null });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}

// route middleware to ensure user is logged in - ajax get
function isLoggedInAjax(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.json( { redirect: '/login' } );
  } else {
    next();
  }
}

module.exports = router;

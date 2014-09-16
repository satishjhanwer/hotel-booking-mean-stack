// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var hotelSchema = mongoose.Schema({
    name         : String,
    address      : String,
    zip          : String,
    city         : String,
    state        : String,
    rate         : Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Hotel', hotelSchema);

// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var bookingSchema = Schema({
    creditCardName         : String,
    creditCard             : String,
    securityCode           : Number,
    month                  : Number,
    year                   : Number,
    roomType               : String,
    checkInDate            : Date,
    checkOutDate           : Date,
    hotel                  : { type: Schema.Types.ObjectId, ref: 'Hotel' },
    user                   : { type: Schema.Types.ObjectId, ref: 'User' }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Booking', bookingSchema);

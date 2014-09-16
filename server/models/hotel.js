/*jslint node: true */
"use strict";

// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * define the schema for our hotel model
 * @type {Schema}
 */
var hotelSchema = new Schema({
    name         : String,
    address      : String,
    zip          : String,
    city         : String,
    state        : String,
    rate         : Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Hotel', hotelSchema);

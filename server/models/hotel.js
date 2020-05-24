/*jslint node: true */
"use strict";

// load the things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * define the schema for our hotel model
 * @type {Schema}
 */
var hotelSchema = new Schema({
	name: String,
	address: String,
	zip: String,
	city: String,
	state: String,
	rate: Number,
	roomCount: Number,
});

/**
 * use to update room count status when new hotel booking is done.
 *
 * @return {[type]}
 */
hotelSchema.methods.cancelHotel = function (callback) {
	this.roomCount += 1;
	this.save(callback);
};

/**
 * use to update room count status when hotel booking is cancel.
 *
 * @return {[type]}
 */
hotelSchema.methods.bookHotel = function (callback) {
	this.roomCount -= 1;
	this.save(callback);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("Hotel", hotelSchema);

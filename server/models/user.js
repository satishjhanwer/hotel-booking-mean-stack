/*jslint node: true */
"use strict";

// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

/**
 * define the schema for our booking model
 * @type {Schema}
 */
var userSchema = new Schema({
    email        : {required: true, unique: true, type: String },
    password     : {required: true, type: String },
    firstName    : {required: true, type: String },
    lastName     : {required: true, type: String },
    isAdmin      : {default: false, type: Boolean}
});

/**
 * generating a hash
 *
 * @param  {[type]} password
 * @return {[type]}
 */
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * checking if password is valid
 *
 * @param  {[type]} password
 * @return {[type]}
 */
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 username: {
    type: String,
    required: true,
 },
 email: {
    type: String,
    required: true,
    unique: true,
 },
 password: {
    type: String,
    required: true,
 },
 createdAt: {
    type: Date,
    default: Date.now(),
 },
 role:{
   type: String,
   enum: ['data-entry', 'data-analyst']
 },
 task:{
   type: String
 },
 isAdmin:{
    type: Boolean,
    default: false,
 }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
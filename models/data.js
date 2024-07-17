const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
 company_name: {
    type: String,
    required: true,
 },
 url:{
    type: String,
    required:true
 },
 email: {
    type: String,
    required: true,

 },
 phone: {
    type: String,
 
 },
 handles: {
    type: String,

 },
 createdAt: {
    type: Date,
    default: Date.now(),
 },
 source:{
    type: String,
    default:"Webiste"
 },
 entered_by:{
    type: String
 }
});

const Data = mongoose.model('scraped_data', dataSchema);
module.exports = Data;
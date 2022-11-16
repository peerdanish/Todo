const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
	username: String,
	email: String,
	password: String,
});

const userModel = new mongoose.model('user', userSchema);

module.exports = userModel;

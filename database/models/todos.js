const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
	id: String,
	todo: String,
	checked: Boolean,
	profilePic: String,
});

const todoModel = new mongoose.model('todo', todoSchema);

module.exports = todoModel;

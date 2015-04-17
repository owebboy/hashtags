var mongoose = require('mongoose');
mongoose.connect('mongodb://url-here');

var hashTagSchema = mongoose.Schema({
	hashtag: String,
	created: Date,
	likes: Number
});

module.exports.hashTag = mongoose.model('hashTag', hashTagSchema)
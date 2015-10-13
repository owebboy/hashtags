var mongoose = require('mongoose');

var uri = process.env.MONGOURI;

mongoose.connect(uri);

var HashTagSchema = mongoose.Schema({
	hashtag: String,
	created: Date,
	likes: Number,
	cool: String
});

module.exports = mongoose.model('HashTags', HashTagSchema)

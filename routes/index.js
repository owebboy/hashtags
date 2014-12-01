var express = require('express');
var filter  = require('bad-words');
var router  = express.Router();

// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://yolo:yolo@proximus.modulusmongo.net:27017/juhuTe7t');

var hashTagSchema = mongoose.Schema({
  hashtag: String,
  created: Date,
  likes: Number
});

var hashTag = mongoose.model('hashTag', hashTagSchema);

/* GET home page. */
router.get('/', function(req, res) {
  hashTag.find().sort('-likes').exec(function(err, hashtags) {
    if (err) return console.log(err);
    console.log(hashtags);
    res.render('index', { title: 'Hashtags', list: hashtags });
  });
});

/* POST yolo page */
router.post('/yolo', function(req, res) {
  var yolo = filter.clean(req.body.yourHashtag);
  var yoloTag = new hashTag({ hashtag: yolo, created: new Date, likes: 0 });
  yoloTag.save( function(err, yoloTag) {
    if (err) return console.log(err);
  })
  res.redirect('/');
});

/* Delete single hashtag */
router.get('/del/:id', function(req, res) {
  hashTag.find({ _id: req.params.id }).remove().exec(function() {
    res.redirect('/');
  });
});

/* Like single hashtag */
router.get('/like/:id', function(req, res) {
  var like = hashTag.where({ _id: req.params.id });
  like.findOne(function (err, hashtag) {
    var liked = hashtag.likes;
    hashTag.findOneAndUpdate({ _id: req.params.id }, { likes: liked + 1 }, { upsert: true }, function(err) {
      if (err) return console.log(err);
      res.redirect('/');
    });
  });
});

/* Dislike single hashtag */
router.get('/dislike/:id', function(req, res) {
  var dislike = hashTag.where({ _id: req.params.id });
  dislike.findOne(function (err, hashtag) {
    var disliked = hashtag.likes;
    hashTag.findOneAndUpdate({ _id: req.params.id }, { likes: disliked - 1 }, { upsert: true }, function(err) {
      if (err) return console.log(err);
      res.redirect('/');
    });
  });
});

/* Edit Mode */
router.get('/edit/:id', function(req, res) {
  hashTag.find({ _id: req.params.id }, function(err, result) {
    console.log(result);
    res.render('edit', { result: result });
  });
});

/* Post Edit Mode */
router.post('/edit/:id', function(req, res) {
  hashTag.findOneAndUpdate({ _id: req.params.id }, { hashtag: filter.clean(req.body.newHashtag) }, { upsert: true }, function(err) {
    if (err) return console.log(err);
    res.redirect('/');
  });
});

module.exports = router;

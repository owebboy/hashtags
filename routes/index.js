var express = require('express');
var filter  = require('bad-words');
var router  = express.Router();

// cool
var cool = require('cool-ascii-faces')

// mongoose
var mongoose = require('mongoose');
var HashTags = require('../models/hashtag.js');

/* GET home page. */
router.get('/', function(req, res) {
  HashTags.find({}, {}, { sort: '-likes' }, function(err, tags) {
    if (err) return console.error(err);
    console.log(tags);
    res.render('index', { title: 'HashTags', list: tags });
  });
});

/* POST yolo page */
router.post('/yolo', function(req, res) {
  var yolo = new HashTags({ hashtag: req.body.yourHashtag, created: new Date, likes: 0, cool: cool(), dislikes: 0 });
  yolo.save( function(err, yoyo) {
    if (err) return console.error(err);
  })
  res.redirect('/');
});

/* Like single hashtag */
router.get('/like/:id', function(req, res) {
  HashTags.findOne({ _id: req.params.id }, function (err, hashtag) {
    if (err) return console.error(err);
    var liked = hashtag.likes;
    HashTags.findOneAndUpdate({ _id: req.params.id }, { likes: liked + 1 }, { upsert: true }, function(err) {
      if (err) return console.error(err);
      res.redirect('/');
    });
  });
});

/* Dislike single hashtag */
router.get('/dislike/:id', function(req, res) {
  HashTags.findOne({ _id: req.params.id }, function (err, hashtag) {
    var disliked = hashtag.likes;
    HashTags.findOneAndUpdate({ _id: req.params.id }, { likes: disliked - 1 }, { upsert: true }, function(err) {
      if (err) return console.error(err);
      res.redirect('/');
    });
  });
});

/* Edit Mode */
router.get('/edit/:id', function(req, res) {
  HashTags.find({ _id: req.params.id }, function(err, result) {
    res.render('edit', { result: result });
  });
});

/* Post Edit Mode */
router.post('/edit/:id', function(req, res) {
  HashTags.findOneAndUpdate({ _id: req.params.id }, { hashtag: filter.clean(req.body.newHashtag) }, { upsert: true }, function(err) {
    if (err) return console.error(err);
    res.redirect('/');
  });
});

module.exports = router;

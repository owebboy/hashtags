var express = require('express');
var router  = express.Router();

// censorship is the future
var profanity = require('profanity-censor');
var slug = require('slug')

// cool
var cool = require('cool-ascii-faces');

// mongoose
var mongoose = require('mongoose');
var HashTags = require('../models/hashtag.js');

/* GET home page. */
router.get('/', function(req, res) {
  HashTags.find({}, {}, { sort: '-likes' }, function(err, tags) {
    if (err) return console.error(err);
    res.render('index', { title: 'HashTags', filter: 'most_liked', list: tags });
  });
});

/* filters */

/* GET most recent first */
router.get('/filter/most_recent', function(req, res) {
  HashTags.find({}, {}, { sort: '-created' }, function(err, tags) {
    if (err) return console.error(err);
    res.render('index', { title: 'HashTags', filter: 'most_recent', list: tags });
  });
});
/* GET most disliked first */
router.get('/filter/most_disliked', function(req, res) {
  HashTags.find({}, {}, { sort: { 'likes' : 1 } }, function(err, tags) {
    if (err) return console.error(err);
    res.render('index', { title: 'HashTags', filter: 'most_disliked', list: tags });
  });
});

/* POST yolo page */
router.post('/yolo/:filter', function(req, res) {
  var hashtag = req.body.yourHashtag;
  var removeHashTag = hashtag.replace(/[^\w\s]/gi, '');
  var clean = slug(removeHashTag);
  var yolo = new HashTags({ hashtag: clean, created: new Date, likes: 0, cool: cool(), dislikes: 0 });
  yolo.save( function(err, yoyo) {
    if (err) return console.error(err);
  })
  if (req.params.filter === 'most_liked') {
    res.redirect('/');
  } else if (req.params.filter === 'most_disliked') {
    res.redirect('/filter/most_disliked');
  } else if (req.params.filter === 'most_recent') {
    res.redirect('/filter/most_recent');
  }
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
  var hashtag = req.body.newHashtag;
  var removeHashTag = hashtag.replace(/[^\w\s]/gi, '');
  var clean = slug(removeHashTag);
  HashTags.findOneAndUpdate({ _id: req.params.id }, { hashtag: clean }, { upsert: true }, function(err) {
    if (err) return console.error(err);
    res.redirect('/');
  });
});

module.exports = router;

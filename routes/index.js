var express = require('express');
var router = express.Router();

// mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://yolo:yolo@proximus.modulusmongo.net:27017/juhuTe7t');

var hashTagSchema = mongoose.Schema({
  hashtag: String,
  created: Date
});

var hashTag = mongoose.model('hashTag', hashTagSchema);

/* GET home page. */
router.get('/', function(req, res) {
  hashTag.find().sort('-created').exec(function(err, hashtags) {
    if (err) return console.log(err);
    console.log(hashtags);
    res.render('index', { title: 'Hashtags', list: hashtags });
  });
});

/* POST yolo page */
router.post('/yolo', function(req, res) {
  var yolo = req.body.yourHashtag;
  var yoloTag = new hashTag({ hashtag: yolo, created: new Date });
  yoloTag.save( function(err, yoloTag) {
    if (err) return console.log(err);
  })
  res.render('yolo', { yolo: yolo });
});

/* START OVER PATH - DELETES ALL HASHTAGS */
router.get('/del/all', function(req, res) {
  hashTag.remove({}, function(err) {
    res.redirect('/');
  });
});

module.exports = router;

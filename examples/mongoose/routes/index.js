var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat', { name: String });

// prepare data
Cat.create({ name: 'Zildjian' }, function(err, result) {
  if (!err) {
    console.log('Created.');
  }
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', cat: Cat.findOne({name: 'Zildjian'})});
};

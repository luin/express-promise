var Sequelize = require("sequelize");

var sequelize = new Sequelize('test', 'root', '', {
  host: "127.0.0.1",
  port: 3306
});


var Project = sequelize.define('Project', {
  title: Sequelize.STRING
});

sequelize.sync();

Project.create({
  title: 'First project'
}).done(function() {
  console.log('Created.');
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(typeof Project.find({where: {title: 'First project'}}).done);
  res.render('index', { title: 'Express', project: Project.find({where: {title: 'First project'}}) });
};

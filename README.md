# express-promise
An [express.js](http://expressjs.com) middleware for easy rendering async query.

[![Build Status](https://travis-ci.org/luin/express-promise.png?branch=master)](https://travis-ci.org/luin/express-promise)

## Cases
### 1. previously

    app.get('/users/:userId', function(req, res) {
        User.find(req.params.userId).then(function(user) {
            Project.getMemo(req.params.userId).then(function(memo) {
                res.json({
                    user: user,
                    memo: memo
                });
            });
        });
    });

### 1. now

    app.get('/users/:userId', function(req, res) {
        res.json({
            user: User.find(req.params.userId),
            memo: Project.getMemo(req.params.userId)
        });
    });

### 2. previously

    app.get('/project/:projectId', function(req, res) {
        var field = req.query.fields.split(';');
        var result = {};

        var pending = 0;
        if (field.indexOf('people') !== -1) {
            pending++;
            Project.getField(req.params.projectId).then(function(result) {
                result.people = result;
                if (--pending) {
                    output();
                }
            });
        }

        if (field.indexOf('tasks') !== -1) {
            pending++;
            Project.getTaskCount(req.params.projectId).then(function(result) {
                result.tasksCount= result;
                if (--pending) {
                    output();
                }
            });
        }

        function output() {
            res.json(result);
        }
    });

### 2. now
    app.get('/project/:projectId', function(req, res) {
        var field = req.query.fields.split(';');
        var result = {};

        if (field.indexOf('people') !== -1) {
            result.people = Project.getField(req.params.projectId);
        }

        if (field.indexOf('tasks') !== -1) {
            result.tasksCount = Project.getTaskCount(req.params.projectId);
        }

        res.json(result);
    });

## Install
    $ npm install express-promise

## Usage
Just `app.use` it!

    app.use(require('express-promise')());

This library supports the following methods: `res.send`, `res.json`, `res.render`.

If you want to let express-promise support nodejs-style callbacks, you can use [dotQ](https://github.com/luin/dotQ) to convert the nodejs-style callbacks to Promises. For example:

    require('dotq');
    app.use(require('express-promise')());

    var fs = require('fs');
    app.get('/file', function(req, res) {
        res.send(fs.readFile.promise(__dirname + '/package.json', 'utf-8'));
    });

### Skip traverse

As a gesture to performance, when traverse an object, we call `toJSON` on it to reduce the properties we need to traverse recursively. However that's measure has some negative effects. For instance, all the methods will be removed from the object so you can't use them in the template.

If you want to skip calling `toJSON` on an object(as well as stop traverse it recursively), you can use the `skipTraverse` option. If the function return `true`, express-promise will skip the object.

    app.use(require('express-promise')({
      skipTraverse: function(object) {
        if (object.hasOwnProperty('method')) {
          return true;
        }
      }
    }))

## Libraries
express-promise works well with some ODM/ORM libraries such as [Mongoose](http://mongoosejs.com) and [Sequelize](http://sequelizejs.com). There are some examples in the /examples folder.

### Mongoose
When query a document without passing a callback function, Mongoose will return a [Query](http://mongoosejs.com/docs/queries.html) instance. For example:

    var Person = mongoose.model('Person', yourSchema);
    var query = Person.findOne({ 'name.last': 'Ghost' }, 'name occupation');

Query has a `exec` method, when you call `query.exec(function(err, result) {})`, the query will execute and the result will return to the callback function. In some aspects, Query is like Promise, so express-promise supports Query as well. You can do this:

    exports.index = function(req, res){
      res.render('index', {
        title: 'Express',
        cat: Cat.findOne({name: 'Zildjian'})
      });
    };

and in the index.jade, you can use `cat` directly:

    p The name of the cat is #{cat.name}

### Sequelize
Sequelize supports Promise after version 1.7.0 :)

## Articles and Recipes
* [Node Roundup: Bedecked, Knockout.sync.js, express-promise](http://dailyjs.com/2013/09/18/node-roundup/)
* [减少异步嵌套，Express-promise](http://zihua.li/2013/09/express-promise/) [Chinese]

## License
The MIT License (MIT)

Copyright (c) 2013 Zihua Li

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/luin/express-promise/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


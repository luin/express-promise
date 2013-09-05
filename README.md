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
    app.use(require('express-promise')());


# THIS LIB IS STILL UNDER DEVELOPMENT
# COMMING VERY SOON!@!

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

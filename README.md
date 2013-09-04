# express-promise
An [express.js](http://expressjs.com) middleware for easy rendering async query.

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

## Usage

  npm install express-promise


  app.use(require('express-promise')());


# THIS LIB IS STILL UNDER DEVELOPMENT
# COMMING SOON!@!

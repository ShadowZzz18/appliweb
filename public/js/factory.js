app.factory('tasksFactory', function($http) {

    var factory = {}

    factory.insertList = function(list, cb) {

        var req = {
            name : list.name,
            author : list.author,
            tlist : list.tlist
        }

        $http.post('/insertList', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.insertTask = function(task, listid, cb) {

        var req = {
            author : task.author,
            content : task.content, 
            done : task.done,
            listid : listid
          };
       
          console.log(req)
          $http.post('/insertTask', req)
          .then( function( res ) {
            cb( res );
          });
    }

    factory.deleteList = function(id, cb) {

        var req = {
            _id : id
        };

        $http.post('/deleteList', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.deleteTask = function(id, cb) {

        var req = {
            _id : id
        };

        $http.post('/deleteTask', req )
          .then( function( res ){
            cb( res );
          });
    }

    factory.updateList = function(list, cb) {

        var req = {
            _id : list._id,
            name : list.name,
            tlist : list.tlist
        }

        $http.post('/updateList', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.updateTask = function(task, cb) {

        var req = {
            _id : task._id, 
            content : task.content, 
            done : task.done
        };

        $http.post('/updateTask', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.getListSet = function(author, cb) {

        var req = {
            author : author
        }

        $http.post('/getListSet', req).success(function(res) {
            console.log(res);
            cb(res);
        }).error(function(err){
            console.log(err);
        });
    }

    factory.getTaskSet = function(author, cb) {
        
        var req = {
            author : author
        }

        $http.post('/getTaskSet', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.getListTaskSet = function(list, cb) {

        var req = {
            list : list
        }

        $http.post('/getListTaskSet', req).success(function(res) {
            cb(res);
        }).error(function(err){
            cb(err);
        });
        
    }

    factory.addAccount = function(username, password, cb) {

        var req = {
            username : username, 
            password : password
        }

        $http.post('/addAccount', req)
        .then(function(res) {
            cb(res)
        })
    }

    factory.findAccount = function(username, password, cb) {

        var req = {
            username : username,
            password : password
        }

        $http.post('/findAccount', req).then(function(res) {
            console.log(res)
            cb(res.data.success)
        })
    }

    return factory
})
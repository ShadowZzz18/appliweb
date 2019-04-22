var dataLayer = require('./models/dataLayer');
const express = require('express')
const port = process.env.PORT || 8080
const ip = "0.0.0.0"
var app = express()
var morgan = require('morgan')
var bodyParser = require('body-parser')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

app.post('/insertList', function(req, res) {

    var dataList = {
        name : req.body.name,
        author : req.body.author,
        tlist : req.body.tlist
    }
    dataLayer.insertList(dataList, function(success) {
        res.send(success)
    });
})

app.post('/insertTask', function(req, res) {

    var dataTask = {
        author : req.body.author,
        content : req.body.content, 
        done : req.body.done
    };

    console.log('server.js : ' + req.body.listid)
    dataLayer.insertTask(dataTask, req.body.listid, function(err) {
        if(err)
            res.send({success: false, err: err})
        else
            res.send({success: true})
    });
});

app.post('/deleteList', function(req,res) {

    var dataList = {
        _id : req.body._id
    };
    dataLayer.deleteList(dataList, function(success) {
        res.send(success)
    })
})

app.post('/deleteTask', function(req, res) {

    var dataTask = {
        _id : req.body._id
    };

    dataLayer.deleteTask(dataTask, function(success) {
        res.send(success)
    })
})

app.post('/updateList', function(req, res) {

    var dataList = {
        _id : req.body._id,
        name : req.body.name, 
        tlist : req.body.tlist
    }
    dataLayer.updateList(dataList, function(success) {
        res.send(success)
    })
})

app.post('/updateTask', function(req, res) {

    var dataTask = {
        _id : req.body._id,
        content : req.body.content, 
        done : req.body.done
    };

    dataLayer.updateTask(dataTask, function(success) {
        res.send(success)
    })
})

app.post('/getListSet', function(req, res) {
    dataLayer.getListSet(req.body.author, function(lists) {
        res.send({success : true, lists : lists})
    })
})

app.post('/getTaskSet', function(req, res) {
    dataLayer.getTaskSet(req.body.author, function(tasks) {
        res.send({success : true, tasks : tasks})
    })
})

app.post('/getListTaskSet', function(req, res) {

    dataLayer.getListTaskSet(req.body.list, function(taskSet) {
        res.send({taskSet : taskSet})
    })

})

app.post('/addAccount', function(req, res) {

    var user = {
        username : req.body.username, 
        password : req.body.password
    }
    dataLayer.addAccount(user, function(err) {
        if(err) {
            res.send({success: false, err : err})
        }else {
            res.send({success : true})
        }
    })
})

app.post('/findAccount', function(req, res) {
    if(!req.body.username || !req.body.password) {
        res.send({
            success: false,
            err: "username ou password manquant"
        })
    }else {

        var user = {
            username : req.body.username,
            password : req.body.password
        }
        dataLayer.findAccount(user, function(err, success) {
            if(success) {
                res.send({success: true})
            }else {
                res.send({success:false, err:err})
            }    
        })
    }
})

app.get('/', function(req, res) {
    res.render("connect.html")
})

app.get('/tasklist', function(req, res) {
    res.render("tasklist.html")
})

app.get('/creation', function(req, res) {
    res.render("creation.html")
})

app.listen(port, ip, function() {
	console.log("listening on " + ip + ":" + port)
});
var MongoClient = require("mongodb").MongoClient
var mongodb = require('mongodb');
var mongoose = require('mongoose')
var uri = "mongodb+srv://Arnaud:Leboss18@appliweb-slgoh.gcp.mongodb.net/Appli_web?retryWrites=true"
var uuidv4 = require('uuid/v4')

mongoose.connect(uri, { useNewUrlParser: true }, function (err) {
  if (err) throw err
  console.log('Connection with mongo initialized');
  console.log('http://localhost:3000');
})

var taskSchema = mongoose.Schema({
  _id: String,
  author: String,
  content: String,
  done: Boolean
});

var userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});

var listSchema = mongoose.Schema({
  _id: String,
  name: String,
  author: String,
  tlist: Array
});

var tasks = mongoose.model('tasks', taskSchema);
var users = mongoose.model('users', userSchema);
var lists = mongoose.model('lists', listSchema);

var dataLayer = {

  insertList: function (list, cb) {

    var newlist = new lists({
      _id: uuidv4(),
      name: list.name,
      author: list.author,
      tlist: list.tlist
    })

    newlist.save(function (err) {
      if (err) {
      } else {
        console.log('liste ajoutee')
        cb()
      }
    })
  },

  insertTask: function (task, listid, cb) {

    console.log('INSERT TASK : DATALAYER : ' + task.content)
    console.log('INSERT TASK : DATALAYER : ' + listid)

    var taskId = uuidv4();

    var newtask = new tasks({
      _id: taskId,
      author: task.author,
      content: task.content,
      done: task.done
    })

    newtask.save(function (err) {
      if (err) {
        cb(err)
      }
      else {
        console.log('Tache sauvegardée !')
        lists.findOne({'_id': listid}, function (err, list) {
          console.log(list)
          if (err) {
            cb(err)
          }
          else {
            console.log('Liste trouvée !')
            list.tlist.push(taskId)
            lists.findOneAndUpdate({'_id': list._id}, list, function (err) {
              if(!err)
                console.log('Liste mise à jour !')
              cb(err)
            })
          }
        })
      }
    })
  },

  deleteList: function (list, cb) {

    lists.findByIdAndRemove(list._id, function (err) {
      if (err) {
      } else {
        console.log('liste supprimee')
        cb()
      }
    })
  },

  deleteTask: function (task, cb) {
    tasks.findByIdAndRemove(task._id, function (err) {
      if (err) {
      } else {
        cb();
      }
    });
  },

  updateList: function (list, cb) {
    lists.findByIdAndUpdate(list._id, list, function (err) {
      if (err) {
      } else {
        cb()
      }
    })
  },

  updateTask: function (task, cb) {
    tasks.findByIdAndUpdate(task._id, task, function (err) {
      if (err) {
      } else {
        cb()
      }
    })
  },

  getListSet: function (author, cb) {
    lists.find({ 'author': author }, function (err, lists) {
      if (err) {
        cb([])
      } else {
        cb(lists)
      }
    })
  },

  getTaskSet: function (author, cb) {
    tasks.find({ 'author': author }, function (err, tasks) {
      if (err) {
      }
      else {
        cb(tasks)
      }
    });
  },

  getListTaskSet: function (list, cb) {
    var tab = []
    tasks.find({ 'author': list.author }, function (err, taskSet) {
      console.log(taskSet);
      if(err || taskSet == [])
        cb([])
      else {
        for (var i = 0; i < taskSet.length; i++) {
          if (list.tlist.includes(taskSet[i]._id)) {
            tab.push(taskSet[i])
          }
        }
        cb(tab)
      }
    })
  },

  addAccount: function (user, cb) {

    var newUser = new users({
      username: user.username,
      password: user.password
    })
    newUser.save(function (err) {
      cb(err)
    })
  },

  findAccount: function (user, cb) {

    var finduser = {
      username: user.username,
      password: user.password
    }

    users.findOne(finduser, function (err, userSet) {
      if (err) {
        cb(err, false)
      } else {
        if (userSet == null) {
          cb(err, false)
        } else {
          cb(err, true)
        }
      }
    })
  }
};

module.exports = dataLayer;

var app = angular.module('mainController', [])

//------------------------------- taskController -------------------------------//
app.controller("taskController", function($scope, tasksFactory, $http) {

  $scope.listSet = []
  $scope.tasklists = []

  $scope.getListSet = function() {

    tasksFactory.getListSet(window.sessionStorage.getItem('username'), function(res) {
      $scope.listSet = []
      $scope.listSet = res.lists

      for(var i = 0; i < $scope.listSet.length; i++) {
        $scope.getListTaskSet($scope.listSet[i], i);
      }
    })
  }

  $scope.getListTaskSet = function(list, index) {

    tasksFactory.getListTaskSet(list, function(res) {
      $scope.tasklists[index] = res.taskSet
    })
  }

  $scope.insertList = function() {

    var list = {
      author : window.sessionStorage.getItem('username'),
      name : $scope.listname,
      tlist : []
    }

    tasksFactory.insertList(list, function(res) {
      console.log(res)
      $scope.getListSet()
    })

    $scope.listname = ''
  }

  $scope.insertTask = function(listid, index) {
    console.log('CONTROLLER : ' + listid);
    var content = document.getElementById('task-content' + index).value;
      var task = { 
        author : window.sessionStorage.getItem('username'), 
        content : content,
        done : false
      }

      tasksFactory.insertTask(task, listid, function(res) {
        console.log(res)
        $scope.getListSet()
      })

      content.value = ''
    }

    $scope.deleteList = function(list) {

      var taskIds = list.tlist
        for(var i=0; i < taskIds.length; i++) {
          $scope.deleteTask(taskIds[i])
        }

      tasksFactory.deleteList(list, function(res) {
        console.log(res)
        $scope.getListSet()
      })
    }

    $scope.deleteTask = function(taskid) {

      tasksFactory.deleteTask(taskid, function(res) {
        console.log(res)
        $scope.getListSet()
      })
    }

    $scope.updateList = function(index) {

      var listtoUpdate = $scope.listSet[index]
      var contents = document.getElementsByClassName("listcontentModified")
      listtoUpdate.name = contents[index].value
      console.log(listtoUpdate.name)
      tasksFactory.updateList(listtoUpdate, function(res) {
        console.log(res)
        $scope.getListSet()

      })

      contents[index].value = ''
    }

    $scope.updateTask = function(listIndex, taskIndex) {

      var tasktoUpdate = $scope.tasklists[listIndex][taskIndex]
     
      tasksFactory.updateTask(tasktoUpdate, function(res) {
        console.log(res)
        $scope.getListSet()
      })
    }

    $scope.checkTask = function(listIndex, taskIndex) {

      var tasktoCheck = $scope.tasklists[listIndex][taskIndex]
      tasktoCheck.done = !tasktoCheck.done
      tasksFactory.updateTask(tasktoCheck, function(res) {
        if (tasktoCheck.done) {
          console.log(tasktoCheck.content + ' checked')
        }else {
          console.log(tasktoCheck.content + ' unchecked')
        }
        $scope.getListSet()

      }) 
    }

    $scope.getListSet()

});


//------------------------------- userController -------------------------------//
app.controller("userController", function($scope, tasksFactory, $http) {

  $scope.account = window.sessionStorage.getItem('username')
  
  $scope.addAccount = function() {
    
    var username = $scope.username
    var password = $scope.password

    tasksFactory.addAccount(username, password, function(res) {
      if(res.data.success) {
        console.log("account created")
        location.href = '/'
      }else {
        console.log("creation failed")
      }
    })
  }

  $scope.connection = function() {

    var username = $scope.username
    var password = $scope.password

    tasksFactory.findAccount(username, password, function(success) {
      if(success) {
        window.sessionStorage.setItem('username', $scope.username)
        console.log(window.sessionStorage.getItem('username') + ' is connected!')
        location.href = '/tasklist'
      } else {
        console.log('connection failed')
      }
    })
  }

  $scope.disconnection = function() {
    console.log(window.sessionStorage.getItem('username') + 'disconnected')
    window.sessionStorage.setItem('username', null)
    $scope.account = null
    window.location.href = '/tasklist'
  }
});
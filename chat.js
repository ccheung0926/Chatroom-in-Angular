'use strict';

angular.module('chat', [])
  .controller('chatApp', ['socket', function(socket){
    var vm = this;
    vm.gotName = false;
    vm.chatStart = false;
    vm.users = [];

    vm.getUser = function(){
      console.log(vm.username);
      // vm.users.push(vm.username);
      socket.emit('clientToSeverGetName', vm.username);
      vm.gotName = true; 
      vm.chatStart = true;
    }


    //listener from the server, user receives message from other people
    socket.on('severToClientMsg', function(data){
      console.log('data', data);
      console.log('severToClient data', data);
      console.log('vm.users', vm.users);
      console.log('vm.users length', vm.users.length);
      vm.messages.push({user: data.user, text: data.text});
    });
    socket.on('severToClientGiveName', function(data){
      vm.users = data;
      console.log('severToClientGiveName',vm.users);
    });


    vm.messages = [];
    vm.sendMessage = function(){
      //sender sends message to client
      socket.emit('clientToSeverMsg', {user: vm.username, text: vm.message});

      vm.messages.push({
        user: vm.username,
        text: vm.message
      });

      console.log('msg array', vm.messages);
      console.log('msg array length', vm.messages.length);
      //clear message box
      vm.message = "";
    }

  }])

.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);
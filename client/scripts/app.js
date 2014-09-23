// YOUR CODE HERE:

var app = {

  friends : [],
  rooms : [],
  messagesPerPage: 20,
  server: 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt',
  currentRoom: "lobby",

  init : function(){
    this.fetch();
    setInterval(this.fetch, 2500);

    //Message Sending
    $('form').off().on('submit', function(event){
      event.preventDefault();
      var text = $('#messageInput').val();
      var username = window.location.search.slice(10);
      var msg = app.newMessage(username, text, app.currentRoom);
      app.send(msg);
      $('#messageInput').val('');
    });



  },

  newMessage : function(username, text, roomname){

    return {
      username: username,
      text: text,
      roomname: roomname,

    };
  },

  fetch : function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data){
        app.getRooms(data);
        app.processMessages(data);
      },
      error: function(data, error, errorMsg){
        console.log('Failed to get messages:', data, error, errorMsg);
      }
    });
  },

  send: function(message){
    $.ajax({
      // always use this url
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.fetch();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  },

  sanitizer : function(string){
    if(typeof string !=='string'){ return 'Not A Real String!!!!! UNPwned...';}
    var regEx = /<script>|<style>|<video>/ig;
    var sanitizedString = string.replace(regEx, 'unPwned' );
    //sanitizedString = _.escape(sanitizedString);
    return sanitizedString;
  },

  processMessages : function(response){
    var messages = response.results;
    this.clearMessages();
    for (var i=this.messagesPerPage; i>=0; i--){
      if(app.currentRoom === messages[i].roomname){
      var formattedTime = new Date(messages[i].createdAt).toLocaleTimeString();
      var unPreppedMessage = '<li>['+_.escape(formattedTime) +'] <a class="username" href="#">'+ _.escape(messages[i].username)+'</a>: '+messages[i].text+'</li>';
      var sanitizedMessage = this.sanitizer(unPreppedMessage);
      this.addMessage(sanitizedMessage);
      }
    }
  },

  getRooms : function(response){
    var messages = response.results;
    app.rooms = _.pluck(messages, 'roomname');
    app.rooms = _.each(app.rooms, app.sanitizer);
    app.rooms = _.uniq(app.rooms);
    app.rooms = _.filter(app.rooms, function (val) {
      return val ? true : false;
        });

    $('#room').empty();

    _.each(app.rooms, function(room){
      $('#room').append('<div><a class="roomLink" href="#">'+room+'</a></div>');
    });
  },

  addFriend: function(userName){
    this.friends.push(userName);
  },

  addMessage: function(message){
    $('#chats').append(message);
    this.updateEventHandlers();
  },

  clearMessages : function(){
    $('#chats').empty();
  },

  addRoom : function (roomToAdd){
    $('#roomSelect').append('<a href=#>'+roomToAdd+'</a>');
  },

  updateEventHandlers : function(){
    //hook up username links to add friends
    $('.username').off()
      .on('click', function(){
      var linkText = $(this).text();
      app.addFriend(linkText);
    });

    //Hook up Chat room switching links
    $('.roomLink').off().on('click', function(event){
      event.preventDefault();
      var linkText = $(this).text();
      app.currentRoom = linkText;
      app.clearMessages();
      app.fetch();

    });

  }


};
$(document).ready(function (){
  app.init();
});



// YOUR CODE HERE:

var app = {

  messagesPerPage: 20,
  server: 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt',


  init : function(){
      setInterval(this.fetch, 2500);
  },

  Message : function(username, text, roomname){
    this.username = username;
    this.text = text;
    this.roomname = roomname;
  },

  fetch : function(){
    $.ajax({
      url: app.server,
      type: 'GET',
      success: function(data){
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
        this.fetch();
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });

  },

  sanitizer : function(string){
    if(typeof string !=='string'){ return 'Not A Real String!!!!! UNPwned...';}
    var regEx = /<script>/ig;
    var sanitizedString = string.replace(regEx, 'unPwned' );
    return sanitizedString;
  },

  processMessages : function(response){
    console.log(response);

    var messages = response.results;
    for (var i=0; i<this.messagesPerPage; i++){

      var formattedTime = new Date(messages[i].createdAt).toLocaleTimeString();
      var unPreppedMessage = '<li>['+formattedTime +'] <a class="userNameLink" href="#">'+ messages[i].username+'</a>: '+messages[i].text+'</li>';
      var sanitizedMessage = this.sanitizer(unPreppedMessage);
      this.addMessage(sanitizedMessage);
    }
  },

  addFriend: function(userName){

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
    $('.userNameLink').on('click', function(){
        var linkText = $(this).text();
        this.addFriend(linkText);
    });
  }
};

app.init();



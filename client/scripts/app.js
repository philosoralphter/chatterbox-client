// YOUR CODE HERE:

var app = {

  messagesPerPage: 20,
  server: 'https://api.parse.com/1/classes/chatterbox',


  init : function(){
      setInterval(this.fetch, 1500);
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
        app.displayMessages(data);
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

  verifyMessages : function(string){
    if(typeof string !=='string'){ return 'Not A Real String!!!!! UNPwned...';}
    var regEx = /<script>/ig;
    var sanitizedString = string.replace(regEx, 'unPwned' );
    return sanitizedString;
  },

  displayMessages : function(response){
    console.log('response' + response);
    var messages = response.results;
    for (var i=0; i<this.messagesPerPage; i++){
      var checkedString = this.verifyMessages(messages[i].text);
      this.addMessage(checkedString);

    }
  },

  addMessage: function(message){
    $('#chats').append('<li>'+message+'</li>');
  },

  clearMessages : function(){
    $('#chats').empty();
  }

};

app.init();



CLI = function() {
  
  var self = this;
  
  var prompt_str = "> ";
  var cmdString = "";
  var cursorPos = 0;

  var cmdHistory = [];
  var histPos = -1;
  var histTmpCommand = "";

  this.doEnter = function() {
    self.addHistoryLine();
    self.doCommand(cmdString);
    if ($.trim(cmdString) != "" && cmdString != cmdHistory[0]) {
      cmdHistory.unshift(cmdString);
    }
    histPos = -1;
    cmdString = "";
    cursorPos = 0;
    self.refreshCommand();
  }

  this.refreshCommand = function() {
    if (cmdString.length == cursorPos) {
      $("#command").empty().append(cmdString).append("<span id='cursor'> </span>");
    } else {
      $("#command").empty()
        .append(cmdString.substr(0, cursorPos))
        .append("<span id='cursor'>" + cmdString.charAt(cursorPos) +  "</span>")
        .append(cmdString.substr(cursorPos + 1));
    }
  }

  this.addCharacter = function(char) {
    cmdString = cmdString.substr(0, cursorPos) + char + cmdString.substr(cursorPos);
    self.refreshCommand();
  }

  this.deleteCharacter = function() {
    cmdString = cmdString.substr(0, cursorPos) + cmdString.substr(cursorPos + 1);
    self.refreshCommand();
  }

  this.addHistoryLine = function() {
    $("#text").append("<div>" + prompt_str + cmdString + "</div>");
  }

  this.doCommand = function(command) {
    command = $.trim(command);
    if (command != "") {
      self.print("Executing " + command);
    }

    if (command == "pulse") {
      $("#cli").fadeOut("slow").fadeIn("slow");
    }
    self.resize();
  }

  this.print = function(line) {
    $("#text").append("<div>" + line + "</div>");
  }

  this.resize = function() {
    if ($("#cli").height() > window.innerHeight) {
      $("#cli").css("top", window.innerHeight - $("#cli").height());
    }
  }
  
  $("#text, #command, #prompt").addClass("text");
  $("#prompt").append(prompt_str);

  self.refreshCommand();

  $(document).keypress(function(event) {
    if (event.which > 31 && event.which < 127) { //ascii printable for now
      self.addCharacter(String.fromCharCode(event.which));
      cursorPos ++;
      self.refreshCommand();
    }
    else if (event.which == 13) { //13 is enter/return
      self.doEnter();
    }
    else {
      console.log("Non printable: " + event.which);
    }
  });

  $(document).keydown(function(event) {
    if (event.which == 8) { //backspace
      event.preventDefault();
      if (cursorPos > 0) {
        cursorPos--;
        self.deleteCharacter();
      }
    }
    else if (event.which == 37) { //left
      if (cursorPos > 0) {
        cursorPos--;
        self.refreshCommand();
      }
    }
    else if (event.which == 39) { //right
      if (cursorPos < cmdString.length) {
        cursorPos++;
        self.refreshCommand();
      }
    }
    else if (event.which == 38) { //up
      if (histPos < cmdHistory.length - 1) {
        histPos++;
        if (histPos == 0) {
          histTmpCommand = cmdString;
        }
        cmdString = cmdHistory[histPos];
        cursorPos = cmdString.length;
        self.refreshCommand();
      }
    }
    else if (event.which == 40) { //down
      if (histPos > -1) {
        histPos--;
        if (histPos == -1) {
          cmdString = histTmpCommand;
        } else {
          cmdString = cmdHistory[histPos];
        }
        cursorPos = cmdString.length;
        self.refreshCommand();
      }
    } else {
      console.log("Keydown: " + event.which);
    }
  });

  $(window).resize(function() {
    self.resize();
  });

}
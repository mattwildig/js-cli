CLI = function(commands, options) {

  if (options == undefined) {
    options = {};
  }

  var self = this;

  var prompt_str = options.prompt || "> ";

  var cmdString = "";
  var cursorPos = 0;

  var cmdHistory = [];
  var histPos = -1;
  var histTmpCommand = "";

  function doCommand(command, cli) {
    command = $.trim(command).split(/\s+/);
    
    exec = command[0];
    args = command.slice(1);
    
    if (commands[exec]) {
      commands[exec](args, cli);
    } else {
      print("Unknown command: " + exec);
    }

  }

  function doEnter() {
    addHistoryLine();
    if ($.trim(cmdString) != "") {
      doCommand(cmdString, self);
      if (cmdString != cmdHistory[0]) {
        cmdHistory.unshift(cmdString);
      }
    }
    histPos = -1;
    cmdString = "";
    cursorPos = 0;
    refreshCommand();
    resize();
  }

  function refreshCommand() {
    if (cmdString.length == cursorPos) {
      $("#command").empty().append(cmdString).append("<span style='text-decoration: underline'>&nbsp;</span>");
    } else {
      $("#command").empty()
        .append(cmdString.substr(0, cursorPos))
        .append("<span style='text-decoration: underline'>" + cmdString.charAt(cursorPos) +  "</span>")
        .append(cmdString.substr(cursorPos + 1));
    }
  }

  function addCharacter (char) {
    cmdString = cmdString.substr(0, cursorPos) + char + cmdString.substr(cursorPos);
    refreshCommand();
  }

  function deleteCharacter() {
    cmdString = cmdString.substr(0, cursorPos) + cmdString.substr(cursorPos + 1);
    refreshCommand();
  }

  function addHistoryLine() {
    $("#text").append("<div>" + prompt_str + cmdString + "</div>");
  }

  function print(line) {
    $("#text").append("<div>" + line + "</div>");
  }
  this.print = print;

  function resize() {
    if ($("#cli").height() > window.innerHeight) {
      $("#cli").css("top", window.innerHeight - $("#cli").height());
    }
    else {
      $("#cli").css("top", 0);
    }
  }
  this.resize = resize;
  
  function print_motd() {
    if (options.motd) {
      print(options.motd);
    }
  }
  this.motd = print_motd;
  
  $('#cli').css({'font-family': 'monospace', 'position': 'absolute', 'top': 0});
  $("#text, #command, #prompt").css('whitespace', 'pre');
  $("#prompt").append(prompt_str);

  refreshCommand();
  print_motd();

  $(document).keypress(function(event) {
    if (event.which > 31 && event.which < 127) { //ascii printable for now
      addCharacter(String.fromCharCode(event.which));
      cursorPos ++;
      refreshCommand();
    }
    else if (event.which == 13) { //13 is enter/return
      doEnter();
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
        deleteCharacter();
      }
    }
    else if (event.which == 37) { //left
      if (cursorPos > 0) {
        cursorPos--;
        refreshCommand();
      }
    }
    else if (event.which == 39) { //right
      if (cursorPos < cmdString.length) {
        cursorPos++;
        refreshCommand();
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
        refreshCommand();
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
        refreshCommand();
      }
    } else if (! event.which > 31 && event.which < 127){
      console.log("Keydown: " + event.which);
    }
  });

  $(window).resize(function() {
    resize();
  });

}
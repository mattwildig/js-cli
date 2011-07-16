CLI = function(options) {

  if (options == undefined) {
    options = {};
  }

  var prompt_str = options.prompt || "> ";

  var cmdString = "";
  var cursorPos = 0;

  var cmdHistory = [];
  var histPos = -1;
  var histTmpCommand = "";

  function doEnter() {
    addHistoryLine();
    doCommand(cmdString);
    if ($.trim(cmdString) != "" && cmdString != cmdHistory[0]) {
      cmdHistory.unshift(cmdString);
    }
    histPos = -1;
    cmdString = "";
    cursorPos = 0;
    refreshCommand();
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

  function doCommand(command) {
    command = $.trim(command);
    if (command != "") {
      print("Executing " + command);
    }

    if (command == "pulse") {
      $("#cli").fadeOut("slow").fadeIn("slow");
    }
    resize();
  }

  function print(line) {
    $("#text").append("<div>" + line + "</div>");
  }

  function resize() {
    if ($("#cli").height() > window.innerHeight) {
      $("#cli").css("top", window.innerHeight - $("#cli").height());
    }
  }
  
  $('#cli').css({'font-family': 'monospace', 'position': 'absolute'});
  $("#text, #command, #prompt").css('whitespace', 'pre');
  $("#prompt").append(prompt_str);

  refreshCommand();
  if (options.motd) {
    print(options.motd);
  }

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
var prompt = "> ";
var cmdString = "";
var cursorPos = 0;

function doEnter() {
  addHistoryLine();
  doCommand(cmdString);
  cmdString = "";
  cursorPos = 0;
  refreshCommand();
}

function refreshCommand() {
  if (cmdString.length == cursorPos) {
    $("#command").empty().append(cmdString).append("<span id='cursor'> </span>");
  } else {
    $("#command").empty()
      .append(cmdString.substr(0, cursorPos))
      .append("<span id='cursor'>" + cmdString.charAt(cursorPos) +  "</span>")
      .append(cmdString.substr(cursorPos + 1));
  }
}

function addCharacter(char) {
  cmdString = cmdString.substr(0, cursorPos) + char + cmdString.substr(cursorPos);
  refreshCommand();
}

function addHistoryLine() {
  $("#text").append("<div>" + prompt + cmdString + "</div>");
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

$(function () {

  $("#text, #command, #prompt").addClass("text");
  $("#prompt").append(prompt);
  
  refreshCommand();
  
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
      cmdString = cmdString.substr(0, cmdString.length - 1);
      refreshCommand();
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
    console.log("Keydown: " + event.which);
  });
  
  $(window).resize(function() {
    resize();
  });
});


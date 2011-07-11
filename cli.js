var prompt = "> ";
var cmdString = "";

function doEnter() {
  addHistoryLine();
  doCommand(cmdString);
  cmdString = "";
  $("#command").empty().append(cmdString);
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
  
  $(document).keypress(function(event) {
    if (event.which > 31 && event.which < 127) { //ascii printable for now
      cmdString += String.fromCharCode(event.which);
      $("#command").empty().append(cmdString);
    }
    else if (event.which == 13) { //13 is enter/return
      doEnter();
    }
    else {
      console.log("Non printable: " + event.which);
    }
  });
  
  $(window).resize(function() {
    resize();
  });
});


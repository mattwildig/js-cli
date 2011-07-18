Commands = {

  doCommand: function(command, cli) {
    command = $.trim(command);
    if (command != "") {
      cli.print("Executing " + command);
    }

    if (command == "pulse") {
      $("#cli").fadeOut("slow").fadeIn("slow");
    }
    cli.resize();
  }

}
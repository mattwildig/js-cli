Commands = {

  doCommand: function(command, cli) {
    command = $.trim(command).split(/\s+/);
    
    exec = command[0];
    args = command.slice(1);
    
    if (this[exec]) {
      this[exec](args, cli);
    } else {
      cli.print("Unknown command: " + exec);
    }

  },

  pulse: function() {
    $("#cli").fadeOut("slow").fadeIn("slow");
  },
  
  echo: function(args, cli) {
    cli.print(args.join(" "));
  }

}
Commands = {

  pulse: function() {
    $("#cli").fadeOut("slow").fadeIn("slow");
  },
  
  echo: function(args, cli) {
    cli.print(args.join(" "));
  }

}
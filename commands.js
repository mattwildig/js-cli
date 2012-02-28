Commands = {

  pulse: function() {
    $("#cli").fadeOut("slow").fadeIn("slow");
  },
  
  echo: function(args, cli) {
    cli.print(args.join(" "));
  },
  
  clr: function(args, cli) {
    $("#text").empty();
  }

}
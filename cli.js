$(function () {
  $("#prompt")
    .addClass("text")
    .append("> ");
  $("#command").addClass("text");
  $(document).keypress(function(event) {
    if (event.which > 31 && event.which < 127) { //ascii printable for now
      $("#command").append(String.fromCharCode(event.which));
    }
    else if (event.which == 13) {
      doEnter();
    }
    else {
      console.log("Non printable: " + event.which);
    }
  });
});

function doEnter() {
  console.log("Enter pressed");
}
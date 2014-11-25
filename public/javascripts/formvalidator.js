function validateForm() {
  var x = document.forms["yolo"]["yourHashtag"].value;
  if (x == null || x == "") {
    alert("where's the #?");
    return false;
  }
}

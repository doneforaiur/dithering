
function setup() {

  var chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  createCanvas(10 * chars.length, 200);
  background(255);

  textFont("Courier New");

  for (var i = 0; i < chars.length; i++) {
    text(chars[i], i * 10, 10);
  }
  loadPixels();
  updatePixels();


  var brightness = [];

  var tmp_arr = [];

  for (var j = 0; j < width; j++) {
    for (var k = 0; k < 12; k++) {
      var char_area = get(j, k);
      var bright = brightness(char_area);
      tmp_arr.push(bright);
    }
    if (j % 10 == 0) {
      let avg = tmp_arr.reduce((a, b) => a + b, 0) / tmp_arr.length;
      brightness.push(avg);
      tmp_arr = [];
    }
  }

  for (var i = 0; i < brightness.length; i++) {
    var bright = brightness[i];
    strokeWeight(0);
    fill(bright);
    rect(i * 10, 12, 10, 10);
  }

  var toSave = {
    "brightness": brightness,
  }

  // save brightness values to text file
  save(toSave, "brightness.json");
}

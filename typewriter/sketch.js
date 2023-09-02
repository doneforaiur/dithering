
let img;
var ascii_brightness;
var chars = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var pixels;

function get_average_brightness_area(x, y, w, h) {
  var tmp_arr = [];

  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      pixel_index = (x + i + (y + j) * img.width) * 4;
      var r = pixels[pixel_index];
      var g = pixels[pixel_index + 1];
      var b = pixels[pixel_index + 2];
      var bright = (r + g + b) / 3;
      tmp_arr.push(bright);
    }
  }

  let avg = tmp_arr.reduce((a, b) => a + b, 0) / tmp_arr.length;
  return avg;
}

function subtract_error_from_area(x, y, w, h, err) {

  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {

      pixel_index = (x + i + (y + j) * img.width) * 4;
      var r = pixels[pixel_index];
      var g = pixels[pixel_index + 1];
      var b = pixels[pixel_index + 2];
      var bright = (r + g + b) / 3;
      bright -= err;
      pixels[pixel_index] = bright;
      pixels[pixel_index + 1] = bright;
      pixels[pixel_index + 2] = bright;
    }
  }
}

function map_brightness_to_char(brightness, min_bright, max_bright) {
  // find the closest values
  var index = 0;
  for (var i = 0; i < ascii_brightness.brightness.length; i++) {
    let a = map(brightness, 0, 255, min_bright, max_bright);
    if (ascii_brightness.brightness[i] > a) {
      index = i;
    }
  }

  var bri = map(ascii_brightness.brightness[index], min_bright, max_bright, 0, 100);

  return [chars[index], bri];
}


function preload() {
  img = loadImage('eiffel.jpg');
  original = loadImage('eiffel.jpg');
  ascii_brightness = loadJSON("brightness.json");

}

function setup() {
  noSmooth();
  createCanvas(img.width * 2, img.height);

  background(255);

  var max_bright = 0;
  var min_bright = 100;
  for (var i = 0; i < ascii_brightness.brightness.length; i++) {
    if (ascii_brightness.brightness[i] > max_bright) {
      max_bright = ascii_brightness.brightness[i];
    }
    if (ascii_brightness.brightness[i] < min_bright) {
      min_bright = ascii_brightness.brightness[i];
    }
  }
  print(max_bright);
  print(min_bright);

  textFont("Courier New");
  textAlign(CENTER, CENTER);
  img.loadPixels();
  updatePixels();
  pixels = img.pixels;
  // split the image into 10x10 pixel areas
  var char_size = [5, 10];
  var repeat_layer = 50;

  for (var l = 0; l < repeat_layer; l++) {

    for (var x = 0; x < char_size.length; x++) {
      for (var i = char_size[x]; i < img.width + char_size[x]; i += char_size[x]) {
        for (var j = char_size[x]; j < img.height + char_size[x]; j += char_size[x]) {

          // let random_i = round(random(-char_size[x], char_size[x]));
          // let random_j = round(random(-char_size[x], char_size[x]));

          let random_i = 0;
          let random_j = 0;

          var custom_i = i + random_i;
          var custom_j = j + random_j;

          var avg = get_average_brightness_area(custom_i, custom_j, char_size[x], char_size[x]);
          if (avg > 254) {
            continue;
          }
          let chara, err;
          chara = map_brightness_to_char(avg, min_bright, max_bright);
          err = (chara[1] - avg) / 4;
          // err = -30;

          character_to_print = chara[0];

          subtract_error_from_area(custom_i, custom_j, char_size[x], char_size[x], err);

          textSize(char_size[x]);
          text(character_to_print, custom_i, custom_j);
          // strokeWeight(0);
          // fill(err);
          // rect(i, j, char_size[x], char_size[x]);
        }
      }
      img.updatePixels();

    }

  }
  image(original, img.width, 0);
}

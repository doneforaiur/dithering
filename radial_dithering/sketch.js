
let img;
let start_x = 268;
let start_y = 15;

function preload() {
  img = loadImage('eiffel.jpg');
}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function getColorAtIndex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx + 1];
  let blue = pix[idx + 2];
  let alpha = pix[idx + 3];
  return color(red, green, blue, alpha);
}

function setColorAtIndex(img, x, y, clr) {
  let idx = imageIndex(img, x, y);

  let pix = img.pixels;
  pix[idx] = red(clr);
  pix[idx + 1] = green(clr);
  pix[idx + 2] = blue(clr);
  pix[idx + 3] = alpha(clr);
}

function makeRadialDithered(img, thickness) {
  img.loadPixels();

  // fiddle with the brightness of the image
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.width; y++) {
      let clr = getColorAtIndex(img, x, y);
      let b = -10;
      let new_clr = color(red(clr) + b, green(clr) + b, blue(clr) + b, alpha(clr));
      setColorAtIndex(img, x, y, new_clr);
    }
  }

  img.updatePixels();

  for (let r = thickness; r < img.width * 1.2; r += thickness) {
    resolution = Math.PI / (5 * r);

    for (let alpha = 0; alpha <= 2 * Math.PI; alpha += resolution) {
      push();
      translate(start_x, start_y);
      rotate(alpha);

      var custom_line = [];
      for (let i = 0; i < (thickness - 1); i++) {
        // convert polar coordinates to cartesian  coordinates
        let x_i = r - i;
        let y_i = 0;
        x_i = round(start_x + (r - i) * - sin(alpha));
        y_i = round(start_y + (r - i) * cos(alpha));

        custom_line.push(brightness(getColorAtIndex(img, x_i, y_i)));
      }

      let avg = custom_line.reduce((a, b) => a + b, 0) / custom_line.length;

      var stroke_weight = map(avg, 0, 100, thickness, 0);

      if (stroke_weight > 0.01) {
        line(0, r, 0, r + stroke_weight);
      }
      pop();
    }
  }

  img.updatePixels();
}

function setup() {
  createCanvas(img.width * 2, img.width);
  angleMode(RADIANS);

  makeRadialDithered(img, 8);
  image(img, img.width, 0);
}


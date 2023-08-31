
let img;

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

function makeDithered(img, thickness) {
  img.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    let bright = brightness(color(r, g, b));

    bright += -20;

    img.pixels[i] = bright;
    img.pixels[i + 1] = bright;
    img.pixels[i + 2] = bright;
  }

  // find dimmest and brightest pixel values in image
  let darkest = 100;
  let lightest = 0;
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    let bright = brightness(color(r, g, b));
    if (bright < darkest) {
      darkest = bright;
    }
    if (bright > lightest) {
      lightest = bright;
    }
  }

  for (let y = 0; y < img.height; y += thickness) {
    for (let x = 0; x < img.width; x++) {
      let colors = [];
      for (let i = 0; i < thickness; i++) {
        colors.push(getColorAtIndex(img, x + i, y));
      }

      let avg = colors.reduce((a, b) => a + brightness(b), 0) / thickness;

      bands = (lightest - darkest) / thickness;
      print(bands);

      let line = [];

      for (let i = 0; i < thickness; i++) {
        line.push(color(125, 0, 0));
      }

      for (let i = 1; i < thickness + 1; i++) {
        if (avg > bands * i) {
          line[i - 1] = color(255);
        } else {
          line[i - 1] = color(0);
        }
      }

      for (let i = 0; i < thickness; i++) {
        setColorAtIndex(img, x, y + i, line[i]);
      }
    }
  }


  img.updatePixels();
}

function setup() {
  createCanvas(img.width * 2, img.width);
  image(img, img.width, 0);
  makeDithered(img, 8);
  image(img, 0, 0);
}


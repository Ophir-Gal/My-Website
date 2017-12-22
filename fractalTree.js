var slider;

function setup() {
  //create canvas
  createCanvas(500, 500);
  textSize(15);
  noStroke();

  // create sliders
  slider = createSlider(0,height*0.7);
  slider.position(20, height*0.7);
}

function draw() {
  push();
  drawTree();
  pop();
  textSize(40);
  fill(0);
}

function drawTree() {
  background(255);
  stroke(50, 35, 6);
  translate(width / 2.0, height);
  //if (slider.value() <= width / 2) {
    branch(slider.value() / 3.0);
  //} else {
    //branch((width - slider.value()) / 3.0);
  //}
}

function branch(len) {
  if (len < 70 && len >= 50) {
    stroke(60, 50, 15);
  } else if (len < 50 && len >= 30) {
    stroke(90, 60, 5);
  } else if (len < 30 && len >= 20) {
    stroke(30, 160, 30);
  } else if (len < 20) {
    stroke(23, 104, 23);
  }
  strokeWeight((len / 8.0));
  line(0, 0, 0, -len);
  stroke(50, 35, 6);
  translate(0, -len);
  if (len > 15) {
    push();
    rotate(PI / 6.0);
    branch(len * 0.67);
    pop();
    push();
    rotate(PI / 3.0);
    branch(len * 0.67);
    pop();
    push();
    rotate(-PI / 3.0);
    branch(len * 0.67);
    pop();
    rotate(-PI / 6.0);
    branch(len * 0.67);
  }
}
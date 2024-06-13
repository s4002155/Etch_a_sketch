var socket;

let num = 10000;
let range = 20;

let ax = [];
let ay = [];
let pointSizes = []; 

let isInitialized = false;
let direction = '';
let font;

function preload() {
  font = loadFont('PixelifySans-VariableFont_wght.ttf');
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background('#970007');
  frameRate(30);

  socket = io.connect('http://localhost:3000')
  socket.on('line', newDrawing);
  
  noStroke();
  fill('#D90009');
  rect(5, 5, innerWidth - 10, innerHeight - 10, 10)


  stroke('#970007'); 
  fill(187); 
  let rectX = 30;
  let rectY = 108;
  let rectWidth = width - 60;
  let rectHeight = height - 200;
  let rectRadius = 20;
  strokeWeight(10); 
  rect(rectX, rectY, rectWidth, rectHeight, rectRadius);


  stroke('#970007');
  strokeWeight(5)
  
  fill('#FFEA75');
  textFont(font);
  textSize(90);
  text('Click', width / 2 - 113, 72);
  text('Click', width / 2 - 115, 70);
  textSize(20);
  text('to create a drawing!', width / 2 - 118, 91);
  text('to create a drawing!', width / 2 - 120, 90);
  
  // Dial
  stroke(187);
  fill('white');
  circle(45, height - 38, 50)
  circle(width - 40, height - 40, 50)
  
  //arrow
  noStroke();
  fill(255, 100);
  beginShape();
  vertex(20, height - 75);
  vertex(30, height - 82);
  vertex(30, height - 77);
  vertex(60, height - 77);
  vertex(60, height - 82);
  vertex(70, height - 75);
  vertex(60, height - 68);
  vertex(60, height - 72);
  vertex(30, height - 72);
  vertex(30, height - 68);
  endShape();
  
  beginShape();
  vertex(width - 79, height - 69);
  vertex(width - 72, height - 59);
  vertex(width - 76, height - 59);
  vertex(width - 76, height - 29);
  vertex(width - 72, height - 29);
  vertex(width - 79, height - 19);
  vertex(width - 86, height - 29);
  vertex(width - 82, height - 29);
  vertex(width - 82, height - 59);
  vertex(width - 86, height - 59);
  endShape();
  
  textSize(14);
  text('j', 10, height - 71);
  text('l', 73, height - 70);
  text('i', width - 81, height - 72);
  text('k', width - 83, height - 8);
  
  noStroke();
  fill(0, 50);
  textFont(font);
  textSize(19);
  text('If you write down the thoughts that come to your mind through the keyboard,', width / 2 - 348, height / 1.09);
  text('a picture will be drawn according to your thoughts.', width / 2 - 248, height / 1.05);
  
  fill(255, 130);
  text('If you write down the thoughts that come to your mind through the keyboard,', width / 2 - 350, height / 1.09);
  text('a picture will be drawn according to your thoughts.', width / 2 - 250, height / 1.05);


  // Drawing part
  for (let i = 0; i < num; i++) {
    pointSizes[i] = random(1, 10); 
    ax[i] = width / 2; 
    ay[i] = height / 2;
  }
}

function newDrawing(data) {
  let x1 = constrain(data.prevX, 40, width - 40);
  let y1 = constrain(data.prevY, 118, height - 102);
  let x2 = constrain(data.x, 40, width - 40);
  let y2 = constrain(data.y, 118, height - 102);

  strokeWeight(2);
  stroke('red');
  line(x1, y1, x2, y2);
}



function draw() {
  if (isInitialized) {
    for (let i = 1; i < num; i++) {
      ax[i - 1] = ax[i];
      ay[i - 1] = ay[i];
    }

    if (direction === 'left') {
      ax[num - 1] -= range;
    } else if (direction === 'right') {
      ax[num - 1] += range;
    } else if (direction === 'up') {
      ay[num - 1] -= range;
    } else if (direction === 'down') {
      ay[num - 1] += range;
    } else {
      ax[num - 1] += random(-range, range);
      ay[num - 1] += random(-range, range);
    }

    
    ax[num - 1] = constrain(ax[num - 1], 30 + 10, width - 30 - 10);
    ay[num - 1] = constrain(ay[num - 1], 108 + 10, height - 92 - 10);

    console.log(`Point ${num - 1}: (${ax[num - 1]}, ${ay[num - 1]})`);

    var data = {
      prevX: ax[num - 2], 
      prevY: ay[num - 2], 
      x: ax[num - 1],     
      y: ay[num - 1]      
    }
    socket.emit('line', data);

    strokeWeight(2); 
    for (let j = 1; j < num; j++) {
      let val = j / num * 204.0 + 51;
      stroke(85);
      if (ax[j - 1] >= 40 && ax[j - 1] <= width - 40 &&
          ay[j - 1] >= 118 && ay[j - 1] <= height - 102 &&
          ax[j] >= 40 && ax[j] <= width - 40 &&
          ay[j] >= 118 && ay[j] <= height - 102) {
        line(ax[j - 1], ay[j - 1], ax[j], ay[j]);
      }
    }
  }
}

function mousePressed() {
  for (let i = 0; i < num; i++) {
    ax[i] = mouseX;
    ay[i] = mouseY;
  }
  isInitialized = true;
}

function keyPressed() {
  switch (keyCode) {
    case 65: // 'A' key
    case 74: // 'J' key
    case 81: // 'Q' key
    case 90: // 'Z' key
    case 97: // 'a' key
    case 106: // 'j' key
    case 113: // 'q' key
    case 122: // 'z' key
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 68: // 'D' key
    case 76: // 'L' key
    case 69: // 'E' key
    case 88: // 'X' key
    case 100: // 'd' key
    case 108: // 'l' key
    case 101: // 'e' key
    case 120: // 'x' key
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case 87: // 'W' key
    case 73: // 'I' key
    case 82: // 'R' key
    case 89: // 'Y' key
    case 119: // 'w' key
    case 105: // 'i' key
    case 114: // 'r' key
    case 121: // 'y' key
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 83: // 'S' key
    case 75: // 'K' key
    case 70: // 'F' key
    case 86: // 'V' key
    case 115: // 's' key
    case 107: // 'k' key
    case 102: // 'f' key
    case 118: // 'v' key
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
  }
}

function keyReleased() {
  direction = '';
}
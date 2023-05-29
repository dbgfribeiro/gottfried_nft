let houseX, houseY, houseWidth, houseHeight, houseStrokeWidth;
let ballX, ballY, ballRadius, ballSpeed, ballAccel, ballInHouse;

function setup() {
  createCanvas(400, 400);
  houseWidth = 100;
  houseHeight = 100;
  houseX = width / 2 - houseWidth / 2;
  houseY = height / 2 - houseHeight / 2;
  houseStrokeWidth = 5;
  ballRadius = 20;
  ballX = width / 2;
  ballY = houseY - ballRadius;
  ballSpeed = 0;
  ballAccel = 0.1;
  ballInHouse = true;
}

function draw() {
  background(220);

  // Draw the house
  strokeWeight(houseStrokeWidth);
  noFill(); // Make the rectangle unfilled
  rect(houseX, houseY, houseWidth, houseHeight);

  // Update the position and speed of the ball
  if (ballInHouse) {
    // If the ball is in the house, update its position and speed as usual
    ballY += ballSpeed;
    ballSpeed += ballAccel;
    // Check if the ball hits the bottom of the house
    if (ballY + ballRadius >= houseY + houseHeight) {
      ballY = houseY + houseHeight - ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    }
  } else {
    // If the ball is not in the house, update its position and speed but don't let it leave
    if (ballY + ballRadius >= height) {
      ballY = height - ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    } else if (ballY - ballRadius <= 0) {
      ballY = ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    } else {
      ballY += ballSpeed;
      ballSpeed += ballAccel;
    }
  }

  // Check if the ball hits the house
  if (ballY + ballRadius >= houseY && ballY - ballRadius < houseY + houseHeight &&
    ballX + ballRadius > houseX && ballX - ballRadius < houseX + houseWidth) {
    if (ballY + ballRadius > houseY + houseHeight) {
      // Bounce back if the ball hits the bottom of the house
      ballY = houseY + houseHeight - ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    }
    if (ballX + ballRadius > houseX + houseWidth) {
      // Bounce back if the ball hits the right side of the house
      ballX = houseX + houseWidth - ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    }
    if (ballX - ballRadius < houseX) {
      // Bounce back if the ball hits the left side of the house
      ballX = houseX + ballRadius;
      ballSpeed = -ballSpeed * 0.8;
    }
    // The ball is now inside the house
    ballInHouse = true;
  } else {
    // The ball is not inside the house
    ballInHouse = false;
  }

  // Draw the ball
  circle(ballX, ballY, ballRadius);
}

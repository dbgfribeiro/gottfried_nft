const buildings = [
  {
    id: 0,
    name: 'Neviges Wallfahrtsdom',
    buildingMaxWidth: 6118, // cm
    buildingMaxHeight: 3400, // cm
    constructionStart: 1966,
    constructionEnd: 1968,
    numFloors: null,
    maxShapeSize: 300,
    buildingSilhouette: wallPaths[0]
  },
  {
    id: 1,
    name: 'Bensberg Town Hall',
    buildingMaxWidth: 1209, // cm
    buildingMaxHeight: 4335, // cm
    constructionStart: 1962,
    constructionEnd: 1969,
    numFloors: 10,
    maxShapeSize: 100,
    buildingSilhouette: wallPaths[1]
  },
  {
    id: 2,
    name: 'Christi Auferstehung',
    buildingMaxWidth: 3361, // cm
    buildingMaxHeight: 1700, // cm
    constructionStart: 1967,
    constructionEnd: 1971,
    numFloors: null,
    maxShapeSize: 50,
    buildingSilhouette: wallPaths[2]
  },
]
const selectedBuilding = buildings[0];

let silhouetteWidth, silhouetteHeight, cols, rows;
let cellWidth, cellHeight, gridWidth, gridHeight, xOffset, yOffset;

let canvasWidth = 1280;
let canvasHeight = 720;

// Define an array to store the falling shapes
let shapes = [];
let stackedShapes = [];

// Load building outline image and shape images
let shapeImages = [];
function preload() {
  // Load shape images into the array
  for (let i = 0;i < 10;i++) {
    shapeImages[i] = loadImage(`assets/shape${i}.svg`);
  }
}

let startTime;

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  silhouetteWidth = Math.round((selectedBuilding.buildingMaxWidth / 10) * 1.5);
  console.log(selectedBuilding)
  silhouetteHeight = Math.round((selectedBuilding.buildingMaxHeight / 10) * 1.5);
  cols = selectedBuilding.constructionEnd - selectedBuilding.constructionStart;
  rows = selectedBuilding.numFloors ? selectedBuilding.numFloors : Math.round(selectedBuilding.buildingMaxHeight / 300);

  cellWidth = Math.round(silhouetteWidth / cols);
  cellHeight = Math.round(silhouetteHeight / rows);
  gridWidth = Math.round(cellWidth * cols);
  gridHeight = Math.round(cellHeight * rows);
  xOffset = Math.round((width - gridWidth) / 2);
  yOffset = Math.round(height - gridHeight);

  // Create the initial set of shapes at random positions in the grid
  for (let i = 0;i < shapeImages.length;i++) {
    let shape = new Shape(
      shapeImages[i],
      i % selectedBuilding.buildingSilhouette.length,
      null,
      null
    );
    shapes.push(shape);
  }

  startTime = millis();
}

function draw() {
  background(255);
  translate(xOffset, yOffset);

  // Draw the grid
  noFill();
  stroke(0, 0, 0, 25);
  strokeWeight(1);
  for (let row = 0;row < rows;row++) {
    for (let col = 0;col < cols;col++) {
      let x = col * cellWidth;
      let y = row * cellHeight;
      rect(x, y, cellWidth, cellHeight);
    }
  }

  // Draw image of the building outline
  stroke("#000000")
  strokeWeight(4)
  beginShape();
  for (let i = 0;i < selectedBuilding.buildingSilhouette.length;i++) {
    // Extract x and y coordinates from the vertex string
    let coordinates = extractCoordinates(selectedBuilding.buildingSilhouette[i]);
    let x = coordinates[0];
    let y = coordinates[1];

    // Add vertex to the shape
    vertex(x, y);
  }
  endShape(CLOSE);

  // Move and show each shape
  for (let i = 0;i < shapes.length;i++) {
    let shape = shapes[i];
    shape.move();
    shape.show();
  }

  // Check if 15 seconds have passed
  if (millis() - startTime >= 15000) {
    noLoop(); // Stop the animation
  }
}

function extractCoordinates(vertexString) {
  // Remove "vertex(" and ")" from the string
  let trimmedString = vertexString.replace('vertex(', '').replace(')', '');
  // Split the string by the comma and convert to numbers
  let coordinates = trimmedString.split(',').map(Number);
  return coordinates;
}

// Define the Shape class
class Shape {
  constructor(img, vertexIndex, w, h) {
    this.img = img;
    this.vertexIndex = vertexIndex;
    this.w = w || random(50, selectedBuilding.maxShapeSize);
    this.h = h || random(50, selectedBuilding.maxShapeSize);
    this.rotation = random(0, TWO_PI); // Random initial rotation between 0 and 2π (360 degrees)
    this.speed = random(100, 1000); // Random speed between 10 milliseconds and 1 second
    this.stopped = false;

    // Calculate initial position based on the vertex index
    let vertex = selectedBuilding.buildingSilhouette[this.vertexIndex];
    let coordinates = extractCoordinates(vertex);
    let x = coordinates[0];
    let y = coordinates[1];

    // Keep adjusting the position until it falls within the building silhouette
    while (!this.collidesWithBuildingSilhouette(x, y)) {
      let randomOffsetX = random(-cellWidth, cellWidth);
      let randomOffsetY = random(-cellHeight, cellHeight);
      x = coordinates[0] + randomOffsetX;
      y = coordinates[1] + randomOffsetY;
    }

    this.x = x;
    this.y = y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.targetW = this.w;
    this.targetH = this.h;

    this.lastMoveTime = millis(); // Track the last move time
  }

  move() {
    if (!this.stopped && millis() - this.lastMoveTime >= this.speed) {
      let newX = this.x;
      let newY = this.y;

      // Keep adjusting the position until it falls within the building silhouette
      while ((newX === this.x && newY === this.y) || !this.collidesWithBuildingSilhouette(newX, newY)) {
        newX = random(0, gridWidth - this.w);
        newY = random(0, gridHeight - this.h);
      }

      this.x = newX;
      this.y = newY;
      this.w = random(50, selectedBuilding.maxShapeSize);
      this.h = random(50, selectedBuilding.maxShapeSize);
      this.lastMoveTime = millis();
    }
  }

  collidesWithBuildingSilhouette(x, y) {
    let vertices = [];
    for (let i = 0;i < selectedBuilding.buildingSilhouette.length;i++) {
      let coordinates = extractCoordinates(selectedBuilding.buildingSilhouette[i]);
      let silhouetteX = coordinates[0];
      let silhouetteY = coordinates[1];
      vertices.push({ x: silhouetteX, y: silhouetteY });
    }
    return this.pointInPolygon(x, y, vertices);
  }

  pointInPolygon(x, y, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1;i < vertices.length;j = i++) {
      let xi = vertices[i].x,
        yi = vertices[i].y;
      let xj = vertices[j].x,
        yj = vertices[j].y;
      let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  collidesWithPosition(x, y, w, h) {
    return (
      x < this.x + this.w &&
      x + w > this.x &&
      y < this.y + this.h &&
      y + h > this.y
    );
  }

  stop() {
    this.stopped = true;
  }

  show() {
    push(); // Save the current transformation state
    translate(this.x + this.w / 2, this.y + this.h / 2); // Translate to the center of the shape
    rotate(this.rotation); // Apply the rotation
    image(this.img, -this.w / 2, -this.h / 2, this.w, this.h); // Draw the shape
    pop(); // Restore the previous transformation state
  }
}
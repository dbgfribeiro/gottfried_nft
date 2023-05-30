/*------------------------------------DECLARATIONS------------------------------------*/
const selectedBuilding = buildingsData[4];

let silhouetteWidth, silhouetteHeight, cols, rows;
let cellWidth, cellHeight, gridWidth, gridHeight, xOffset, yOffset;

let canvasWidth = 1280;
let canvasHeight = 720;

// Define an array to store all the shapes
let shapes = [];

// Load correspondent shape images
let shapeImages = [];
function preload() {
  // Load shape images into the array
  for (let i = 0;i < 10;i++) {
    shapeImages[i] = loadImage(`assets/shape${i}.svg`);
    // shapeImages[i] = loadImage(`assets/shapes/building${selectedBuilding.id}/shape${i}.svg`);
  }
}

// Number to be incremented in order to create a 15-second animation
let startTime;

/*------------------------------------SETUP------------------------------------*/
function setup() {
  createCanvas(canvasWidth, canvasHeight);

  silhouetteWidth = Math.round((selectedBuilding.buildingMaxWidth / 10) * 1.5);
  silhouetteHeight = Math.round((selectedBuilding.buildingMaxHeight / 10) * 1.5);
  // Scale adjustment in case of a silhuette larger than canvas
  if (silhouetteHeight > canvasHeight || silhouetteWidth > canvasWidth) {
    silhouetteHeight = silhouetteHeight / 1.5;
    silhouetteWidth = silhouetteWidth / 1.5;
  }
  // Scale adjustment if the silhuette is too small
  else if (silhouetteHeight < 280 && silhouetteHeight >= 150) {
    silhouetteHeight = Math.round(silhouetteHeight * 1.5);
    silhouetteWidth = Math.round(silhouetteWidth * 1.5);
  }
  else if (silhouetteHeight < 150) {
    silhouetteHeight = Math.round(silhouetteHeight * 3);
    silhouetteWidth = Math.round(silhouetteWidth * 3);
  }

  cols = selectedBuilding.constructionEnd - selectedBuilding.constructionStart;
  // If the number of floors is unknown the number of rows is calculated by buildingMaxHeight / 300
  rows = selectedBuilding.numFloors || Math.round(selectedBuilding.buildingMaxHeight / 300);

  // Grid properties
  cellWidth = Math.round(silhouetteWidth / cols);
  cellHeight = Math.round(silhouetteHeight / rows);
  gridWidth = Math.round(cellWidth * cols);
  gridHeight = Math.round(cellHeight * rows);
  xOffset = Math.round((width - gridWidth) / 2);
  yOffset = Math.round((height - gridHeight) / 2);

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

/*------------------------------------DRAW------------------------------------*/
function draw() {
  background("#101010");

  // Write the names of the buildings.
  noStroke();
  fill(100);
  textSize(16);
  text(selectedBuilding.name, 25, canvasHeight - 25);
  text("by Gottfried Böhm", canvasWidth - 155, canvasHeight - 25);

  // Draw the grid
  translate(xOffset, yOffset);
  noFill();
  stroke(255, 255, 255, 10)
  strokeWeight(1);
  for (let row = 0;row < rows;row++) {
    for (let col = 0;col < cols;col++) {
      let x = col * cellWidth;
      let y = row * cellHeight;
      rect(x, y, cellWidth, cellHeight);
    }
  }

  // Move and show each shape
  for (let i = 0;i < shapes.length;i++) {
    let shape = shapes[i];
    shape.move();
    shape.show();
  }

  // Draw the silhouette of the building from provided paths
  stroke(255, 255, 255, 150)
  strokeWeight(2)
  beginShape();
  for (let i = 0;i < selectedBuilding.buildingSilhouette.length;i++) {
    let vertexType = selectedBuilding.buildingSilhouette[i];
    if (vertexType.startsWith("vertex")) {
      let coordinates = extractCoordinates(vertexType);
      let x = coordinates[0];
      let y = coordinates[1];
      vertex(x, y);
    } else if (vertexType.startsWith("bezierVertex")) {
      let coordinates = extractCoordinates(vertexType);
      let x1 = coordinates[0];
      let y1 = coordinates[1];
      let x2 = coordinates[2];
      let y2 = coordinates[3];
      let x3 = coordinates[4];
      let y3 = coordinates[5];
      bezierVertex(x1, y1, x2, y2, x3, y3);
    }
  }
  endShape(CLOSE);

  // Stop the animation after 15 seconds
  if (millis() - startTime >= 15000) {
    noLoop();
  }
}

/*------------------------------------EXTRA FUNCTIONS------------------------------------*/
function extractCoordinates(vertexString) {
  // Remove "vertex/bezierVertex(" and ")" from the string
  let trimmedString = vertexString.replace('vertex(', '').replace('bezierVertex(', '').replace(')', '');
  // Split the string by the comma and convert to numbers
  let coordinates = trimmedString.split(',').map(Number);
  return coordinates;
}
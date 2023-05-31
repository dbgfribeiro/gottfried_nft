// Define the Shape class
class Shape {
  constructor(img, vertexIndex, w, h) {
    this.img = img;
    this.vertexIndex = vertexIndex;
    this.w = w || random(50, selectedBuilding.maxShapeSize);
    this.h = h || random(50, selectedBuilding.maxShapeSize);
    this.rotation = random(0, TWO_PI); // Random initial rotation between 0 and 2π (360 degrees)
    this.speed = random(50, 750); // Random speed between 50 and 750 milliseconds

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
    if (millis() - this.lastMoveTime >= this.speed) {
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
    // Iterate over each vertex in the building silhouette
    for (let i = 0;i < selectedBuilding.buildingSilhouette.length;i++) {
      // Extract x and y coordinates from each vertex in the building silhouette
      let coordinates = extractCoordinates(selectedBuilding.buildingSilhouette[i]);
      let silhouetteX = coordinates[0];
      let silhouetteY = coordinates[1];
      // Add the vertex to the vertices array
      vertices.push({ x: silhouetteX, y: silhouetteY });
    }
    return this.pointInPolygon(x, y, vertices);
  }

  pointInPolygon(x, y, vertices) {
    let inside = false;
    // Iterate over each edge of the polygon formed by the building silhouette vertices
    for (let i = 0, j = vertices.length - 1;i < vertices.length;j = i++) {
      let xi = vertices[i].x,
        yi = vertices[i].y;
      let xj = vertices[j].x,
        yj = vertices[j].y;
      // Check if the horizontal ray originating from the given point intersects with the current edge
      let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      // Toggle the inside flag if an intersection occurs
      if (intersect) inside = !inside;
    }
    // Return true if the given point is inside the polygon formed by the building silhouette vertices, false otherwise
    return inside;
  }

  show() {
    push(); // Save the current transformation state
    translate(this.x + this.w / 2, this.y + this.h / 2); // Translate to the center of the shape
    rotate(this.rotation); // Apply the rotation
    image(this.img, -this.w / 2, -this.h / 2, this.w, this.h); // Draw the shape
    pop(); // Restore the previous transformation state
  }
}
let rectWidth = 400;
let rectHeight = 400;
let polygons = [];

function setup() {
  createCanvas(rectWidth, rectHeight);

  // Create polygons
  polygons.push(new Polygon(random(60, 340), -50, random(3, 8), random(20, 60)));
  polygons.push(new Polygon(random(60, 340), -50, random(3, 8), random(40, 80)));
  polygons.push(new Polygon(random(60, 340), -50, random(3, 8), random(40, 80)));
  polygons.push(new Polygon(random(60, 340), -50, random(3, 8), random(40, 80)));
}

function draw() {
  background(220);

  // Update and display polygons
  for (let i = 0;i < polygons.length;i++) {
    polygons[i].update();
    polygons[i].display();
    polygons[i].checkCollisionWithWalls();
  }
}

class Polygon {
  constructor(x, y, sides, radius) {
    this.x = x;
    this.y = y;
    this.sides = sides;
    this.radius = radius;
    this.vy = random(1, 3); // Random falling speed
    this.isFalling = true;
  }

  update() {
    if (this.isFalling) {
      this.y += this.vy;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    beginShape();
    for (let i = 0;i < this.sides;i++) {
      let angle = map(i, 0, this.sides, 0, TWO_PI);
      let x = this.radius * cos(angle);
      let y = this.radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  checkCollisionWithWalls() {
    if (this.y + this.radius >= rectHeight) {
      this.y = rectHeight - this.radius;
      this.isFalling = false;
    }
  }
}

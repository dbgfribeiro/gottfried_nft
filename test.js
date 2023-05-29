const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 922;
const height = 516;
const cellSize = width / 10;
const numCells = 8;
const gridLineWidth = 2;

const engine = Engine.create();

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    showInternalEdges: false,
    background: '#f0f0f0',
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  document.querySelector(".walls path"), // Select the SVG element containing all the paths
].map(svg => {
  const wall = Matter.Bodies.fromVertices(
    width / 2,
    height / 2,
    Matter.Svg.pathToVertices(svg), // Convert the entire SVG to vertices
    {
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "#000",
        lineWidth: 2,
      },
    },
    true
  );
  return wall;
});
World.add(engine.world, walls);

const shapes = [
  ...[...document.querySelectorAll(".shape path")].map(path => {
    const body = Matter.Bodies.fromVertices(100, 80, Matter.Svg.pathToVertices(path), {}, true
    );
    Matter.Body.scale(body, 0.5, 0.5);
    return body;
  })
];
World.add(engine.world, shapes);
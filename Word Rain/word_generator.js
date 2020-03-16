var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

// create engine
var engine = Engine.create(),
    world = engine.world;

// change the gravity
world.gravity.scale = 0.002;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 960,//current_width,
        height: 540,//current_height
        wireframes: false // <-- important
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// Add body from SVG
var addBodyFromSVG = function(svg=stringToSVG('*'), indent=0){
    // assuming 'svg' is an SVG object with paths

    var vertexSets = [];
    
    // in case you wany to color differnet letters differently -
    //var color = Common.choose(['white', 'white', 'white', ...]);

    $(svg).find('path').each(function(i, path) {
        let points = Svg.pathToVertices(path, 50, i*2500);
        vertexSets.push(points);
    });

    // create body
    var body = Bodies.fromVertices(50 + indent, 80, vertexSets, {
        render: {
            fillStyle: 'white',
            strokeStyle: 'white',
            lineWidth: 1
        },
        restitution: 0.98
    }, true);

    // shrink its size
    Body.scale(body, .01, .01);
    
    // add it to the world
    World.add(world, body);
}

addBodyFromSVG(); // add a '*' into the world

World.add(world, [
    //top
    Bodies.rectangle(render.options.width/2, render.options.height*0.02,
                     render.options.width*2, 75, { isStatic: true }), 
    //bottom
    Bodies.rectangle(render.options.width/2, render.options.height*1.1, 
                     render.options.width*2, 75,
                     { isStatic: true }),
    // right
    Bodies.rectangle(render.options.width-25, 300, 50, 600, { isStatic: true }),
    // left
    Bodies.rectangle(-110-25, 300, 50, 600, { isStatic: true })
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});
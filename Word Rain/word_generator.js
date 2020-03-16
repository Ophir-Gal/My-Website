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

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 960,//current_width,
        height: 540,//current_height
        wireframes: false, // <-- important
        //background: 'white'
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// Add body from SVG
addBodyFromSVG = function(data=stringToSVG('*'), indent=0){
    // assuming 'data' is an SVG object with paths

    var vertexSets = [];
    
    // in case you wany to color differnet letters differently -
    //var color = Common.choose(['white', 'white', 'white', ...]);

    $(data).find('path').each(function(i, path) {
        let points = Svg.pathToVertices(path, 50, i*2500)
        vertexSets.push(points);
    });

    // create body
    var body = Bodies.fromVertices(50 + indent, 80, vertexSets, {
        render: {
            fillStyle: 'white',
            strokeStyle: 'white',
            lineWidth: 1
        },
        restitution: 0.95
    }, true);

    // shrink its size
    Body.scale(body, .01, .01);
    
    // add it to the world
    World.add(world, body);
}

addBodyFromSVG();

World.add(world, [
    //Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(render.options.width/2, render.options.height*1.12,
                     render.options.width*2, 100,
                     { isStatic: true }),
    //Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    //Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
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
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Common = Matter.Common,
    Composite = Matter.Composite;
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Svg = Matter.Svg,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

const MAX_BODIES = 10;
const FLOOR_ID = 42;

const colors = ['#003f5c','#2f4b7c','#665191','#a05195',
                '#d45087','#f95d6a','#ff7c43','#ffa600'];

// create engine
var engine = Engine.create(),
    world = engine.world;

// change the gravity
//world.gravity.scale = 0.001; // default is 0.001

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

// Add body from String
var addBodyFromString = function(word='HELLO', indent=0){

    // remove some older bodies if reached max
    let all_bodies = Composite.allBodies(world);
    if (all_bodies.length > MAX_BODIES){
        for (let i=0; i<=10; i++){
            let some_idx = 0;
            if (all_bodies[0].id === FLOOR_ID){
                some_idx += 1;
            }
            World.remove(world, all_bodies[some_idx]);
        }
    }

    //let svg = stringToSVG(word); // convert string to SVG object 
    var vertexSets = [];           // initialize empty list of vertex sets
    
    // in case you wany to color differnet letters differently -
    //var color = Common.choose(['white', 'white', 'white', ...]);

    // ---- Original approach to creating 2D objects --------------
    /*
    $(svg).find('path').each(function(i, path) {
        let points = Svg.pathToVertices(path, 50, i*2500);
        vertexSets.push(points);
    });
    */
   // -------------------------------------------------------------
    
    // -------------- alternative approach ------------------------
    // -------------- get vertices directly from strings ----------
    /**
     * For each letter in word:
     *      - Get its points from pre-made dictionary.
     *      - For each point:
     *          Copy it and indent its x value according to the index
     *                          (x += index * some_magic_number).
     *      - Append the points to list of vertex sets.
     */
    
    for (let i=0; i<word.length; i++){
        let letter = word[i];
        let points = [];
        
        if (letter < 'A' || letter > 'Z'){
            letter = '*';
        }

        for (let point of letterToVertixSet[letter]){
            let indented_point = {x: point.x + i*2300, y: point.y};
            points.push(indented_point);
        }
        vertexSets.push(points);
    }

    // ------------------------------------------------------------
    // ------------------------------------------------------------

    let word_color = colors[Math.floor(Math.random() * 8)]; // random color

    // create body
    var body = Bodies.fromVertices(50 + indent, 80, vertexSets, {
        render: {
            fillStyle: word_color,
            strokeStyle: word_color,
            lineWidth: 1
        },
        restitution: 0.999
    }, true);

    // shrink its size
    Body.scale(body, .01, .01);
    
    // add it to the world
    World.add(world, body);
}

addBodyFromString('HELLO');

// add walls, floor, and ceiling
World.add(world, [
    //top
    //Bodies.rectangle(render.options.width/2, render.options.height*0.02,
    //                 render.options.width*2, 75, { isStatic: true }), 
    //bottom
    Bodies.rectangle(render.options.width/2, render.options.height*1.1, 
                     render.options.width*2, 75,
                     { isStatic: true, id: FLOOR_ID, restitution: 0.98})
    // right
    //Bodies.rectangle(render.options.width-25, 300, 50, 600, { isStatic: true }),
    // left
    //Bodies.rectangle(-110-25, 300, 50, 600, { isStatic: true })
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
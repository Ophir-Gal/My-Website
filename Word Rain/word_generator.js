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

const MAX_WORDS = 15;
const FLOOR_ID = 42;
const LETTER_INDENT = 2900;
const NUM_WORDS_TO_REMOVE = 20;

const colors = ['#004cff','#517dc9','#665191','#a05195',
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
var addBodyFromString = function(word='HELLO', indent=0, word_size=0.01){

    // remove some older bodies if reached max
    let all_bodies = Composite.allBodies(world);
    if (all_bodies.length > MAX_WORDS){
        for (let i=0; i<MAX_WORDS; i++){
            let some_idx = 0;
            if (all_bodies[0].id === FLOOR_ID){
                some_idx += 1;
            }
            World.remove(world, all_bodies[some_idx]);
        }
    }
    
    // --------- alternative approach to generating the word ----------
    // -------------- get vertices directly from strings --------------
    /**
     * For each letter in word:
     *      - Get its points from pre-made dictionary.
     *      - For each point:
     *          Copy it and indent its x value according to the index
     *                          (x += index * some_magic_number).
     *      - Append the points to list of vertex sets.
     */
    
    let word_points = [];
    let letter_lengths = [];

    for (let i=0; i<word.length; i++){
        let letter = word[i];
        
        if (letter < 'A' || letter > 'Z'){
            letter = '*';
        }

        for (let point of letterToVertixSet[letter]){
            let indented_point = {x: point.x + i*LETTER_INDENT,
                                  y: point.y};
            word_points.push(indented_point);
        }
        let previous_length = i===0 ? 0 : letter_lengths[letter_lengths.length-1];
        letter_lengths[i] = letterToVertixSet[letter].length + previous_length;
    }

    // shrink word
    word_points = Vertices.scale(word_points, word_size, word_size);

    // PUT EACH LETTER'S POINTS IN SEPARATE ARRAY
    let vertexSets = [];
    for (let len_idx=0; len_idx<letter_lengths.length; len_idx++){
        let letter_array = [];
        let i = len_idx===0 ? 0 : letter_lengths[len_idx-1];
        while (i < letter_lengths[len_idx]){
            letter_array.push(word_points[i]);
            i++;
        }
        vertexSets.push(letter_array);
    }
    
    // ------------------------------------------------------------
    // ------------------------------------------------------------
    
    // choose random color for this word
    let word_color = Common.choose(colors);
    
    // create word body
    let word_body = Bodies.fromVertices(50 + indent, 80, vertexSets, {
        render: {
            fillStyle: word_color,
            strokeStyle: word_color,
            lineWidth: 1
        },
        restitution: 0.4
    }, true);

    // add it to the world
    World.add(world, word_body);
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
            stiffness: 0.1,
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
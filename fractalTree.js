
  function setup(){
    createCanvas(1200,700);
  }
  
  function draw(){
         push();
         drawTree();
         pop();
         textSize(40);
         fill(0);
         text(" Fractal Tree",50,height*8/9);
         text("Press & Move :)",30,height*17/18);
  }
  
  function drawTree(){
    background(255);
    stroke(50,35,6);
    translate(width/2.0,height);
    if(mouseX <= width/2){
      branch(mouseX/3.0);
    } else {
      branch((width-mouseX)/3.0);
    }
}

function branch(len){
       if (len<70 && len>=50){
           stroke(60,50,15);
       } else if (len<50 && len>=30){
           stroke(90,60,5);
       } else if (len<30 && len>=20){
           stroke(30,160,30);
       }
       else if (len<20){
           stroke(23,104,23);
       }
       strokeWeight((len/8.0));
       line(0,0,0,-len);
       stroke(50,35,6);
       translate(0,-len);
       if (len>15){
         push();
         rotate(PI/6.0);
         branch(len*.67);
         pop();
         push();
         rotate(PI/3.0);
         branch(len*.67);
         pop();
         push();
         rotate(-PI/3.0);
         branch(len*.67);
         pop();
         rotate(-PI/6.0);
         branch(len*.67);
       }
  }
  

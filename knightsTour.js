/* MoMath Math Square Behavior
 *
 *        Title: The Knight's Tour
 *  Description: Display user blobs and sensors (same as debug)
 * Scheduler ID:
 *    Framework: P5
 *       Author: Dylan Simon <dylan@dylex.net>
 *      Created: 2017-04
 *       Status: works
 */

import P5Behavior from 'p5beh'
import * as Display from 'display'
//import * as Sensor from 'sensors'

const pb = new P5Behavior();
// for WEBGL: pb.renderer = 'webgl';

var goldenknight;

let squareSize = 53;
let boardStart = 100;
let boardEnd = boardStart + squareSize * 8;

var loseTexts = ["RIP", "Try Again", "It's Not Coming Home", "Back to Square 1"];
var winTexts = ["Path Completed!", "Winner Winner Chicken Dinner", "Congrats on learning!"];

let solutions = [
  [1,18,3,9,26,20,5,15,32,22,7,24,30,47,64,54,39,56,62,45,60],
  []
];

var instructions = ["INSTRUCTIONS:",
"The knight is one of the most unconventional",
"pieces in the game of chess. It moves in an",
"L shape, two squares horizontally and one",
"vertically or one horizontally and two vertically.",
"A knight’s tour is a mathematical problem in",
"which you have to move the knight until it has",
"traveled to every square on the board without",
"repeating any.",
"Can you find a solution? When you jump to",
"a square, it will show your options. Head over",
"to the starting square on the bottom left",
"corner to begin."
];


var intro = true;
var inGame = false;
var lost = false;
var won = false;
var endMessage = "";
var restartTime = false;


var board = [];
var path = [];
var extendos = [];

var current;
var score = 0;
var time = 0;

const Square = function(id,i,j,x,y){
  this.id = id;
  this.i = i;
  this.j = j;
  this.x = x;
  this.y = y;
  this.state = 0;
};

const createBoard = function(){
  for(var i = 0; i < 8; i++){
    board.push([]);
    for(var j = 0; j < 8; j++){
      board[i].push(new Square(8*i + j + 1,i, j,boardStart + squareSize * j, boardStart + squareSize * (7-i)));
    }
  }
}

const restartGame = function(){
  inGame = false;
  lost = false;
  restartTime = false;
  score = 0;
  time = 0;
  board = [];
  path = [];
  extendos = [];
  createBoard();
}


const getCoords = function(id){
  var jCoord = id % 8;
    if (jCoord == 0){
      jCoord = 8;
    }
    var iCoord = (id - jCoord)/8;
    jCoord -= 1;
    return [iCoord,jCoord];
}

const getSquare = function(x,y){
  for(var j = 0; j < 8;j++){
    if(board[0][j].x + squareSize > x){
      for(var i = 0; i < 8;i++){
        if(board[i][j].y < y){
          return board[i][j].id;
        }
      }
    }
  }
}


const getPosition = function(x,y){
  //off to right
  if(x > boardEnd || y < boardStart){
    return -1;
  }
  //in start area
  else if(y > boardEnd){
    return 0;
  }
  //options
  else if(x < boardStart){
    if(y > boardStart && y < 230){
      return 65;
    }
    else if(y > boardStart && y < 375){
      return 66;
    }
    else if(y > boardStart && y < 530){
      return 67;
    }
  }
  //on board
  else{
    return getSquare(x,y);
  }
}

const inBounds = function(i,j){
  return i >=0 && i < 8 && j >=0 && j < 8;
}

const validMoves = function(iCoord, jCoord){
  var possibilities = [];
  var xMoves = [2, 1, -1, -2,-2, -1, 1, 2];
  var yMoves = [1, 2, 2, 1,-1, -2, -2, -1];
  var newX,newY;

  for(var k = 0; k < 8; k++){
    newX = iCoord + xMoves[k];
    newY = jCoord + yMoves[k];
    if(inBounds(newX, newY) && !path.includes(8 * newX + newY + 1)){
      possibilities.push(board[newX][newY].id);
    }
  }
  return possibilities;
}


pb.preload = function (p) {
  /* this == pb.p5 == p */
  // ...
}

pb.setup = function (p) {
  /* this == pb.p5 == p */
  /* P5Behavior already calls createCanvas for us */
  // setup here...
  createBoard();
  goldenknight = this.loadImage('images/goldentrash2.png');
};

pb.draw = function (floor, p) {
  //score = 63;
  /* this == pb.p5 == p */
  // draw here...
  this.clear();
  this.fill(0);
  this.rect(0, 0, Display.width, Display.height);

  //var input = floor.sensors;

  floor.maxUsers = 1;

  if(inGame){
    intro = false;
  }

  if(lost){
    //lines
    time++;
    //console.log(time);
    for(var i = 0; i < path.length-1;i++){
      var beginCoords = getCoords(path[i]);
      var start = board[beginCoords[0]][beginCoords[1]];

      var endCoords = getCoords(path[i+1]);
      var stop = board[endCoords[0]][endCoords[1]];

      this.stroke(125,254,255);
      this.strokeWeight(5);
      this.line(start.x + squareSize/2, start.y + squareSize/2, stop.x + squareSize/2, stop.y + squareSize/2)
    }

    this.textSize(20);
    this.textFont('Courier New');
    this.fill(255);
    this.stroke(255,0,0);
    this.strokeWeight(2);
    this.text(endMessage, 25, this.height/2);
  
    if(time >= 100){
      endMessage = "";
    }
    if(time >= 150){
      restartTime = true;
    }
    if(!restartTime){
      return;
    }
    this.clear()
    restartGame();
    time = 0;
  }

  if(won){
    //lines
    time++;
    for(var i = 0; i < path.length-1;i++){
      var beginCoords = getCoords(path[i]);
      var start = board[beginCoords[0]][beginCoords[1]];

      var endCoords = getCoords(path[i+1]);
      var stop = board[endCoords[0]][endCoords[1]];

      this.stroke(125,254,255);
      this.strokeWeight(5);
      this.line(start.x + squareSize/2, start.y + squareSize/2, stop.x + squareSize/2, stop.y + squareSize/2)
    }

    this.textSize(20);
    this.textFont('Courier New');
    this.fill(255);
    this.stroke(255,0,0);
    this.strokeWeight(2);
    this.text(endMessage, 25, this.height/2);
  
    if(time >= 100){
      endMessage = "";
    }
    if(time >= 150){
      restartTime = true;
    }
    if(time > 150 && time < 200){
      //win show here
    }
    if(!restartTime){
      return;
    }
    this.clear()
    restartGame();
    time = 0;
  }


// shadow
this.noStroke()
this.fill(182, 255, 224);
this.rect(boardStart + 5, boardStart + 8, squareSize * 8, squareSize * 8);

 // Title
 this.stroke(232, 170, 21);
 this.fill(232, 170, 21);
 this.strokeWeight(1);
 this.textSize(36);
 this.textFont('Courier New');
 this.text("The Golden Knight", 140, 60);

 // Underline
 this.stroke(232, 253, 88);
 this.strokeWeight(2);
 this.line(130, 65, 520, 65);

 // full board
 this.fill(232, 235, 225);
 this.stroke (0, 0, 0);
 this.rect(100, 100, squareSize * 8, squareSize * 8);

  // full board
  this.fill(232, 235, 225);
  this.stroke (0, 0, 0);
  this.rect(100, 100, squareSize * 8, squareSize * 8);

  //evaluate current position
  current = getPosition(floor.users[0].x, floor.users[0].y);
  if(!inGame){
    if(floor.users[0].id != -1 && current == 1 ){
      inGame = true;
      path.push(1);
    }
  }
  else{
    if(current > 64){
      switch (current) {
        case 65:
            restartGame();
            break;
        case 66:
            time++;
            if(time % 20 == 0){
              path.pop();
            }
            current = path[path.length-1];
            var coords = getCoords(current);
            extendos = validMoves(coords[0],coords[1]);
            break;
        case 67:
            setTimeout(function(){ lost = true; }, 1000);
            endMessage = loseTexts[Math.round(this.random(loseTexts.length-1))];
            break;
        case 69:
           console.log("nice");
            break;
        default:
      }
    }
    else if(extendos.includes(current)){
      time = 0;
      score++;
      path.push(current);
      if(score == 64){
        setTimeout(function(){ won = true; }, 1000);
        endMessage = winTexts[Math.round(this.random(winTexts.length-1))];
      }
      var coords = getCoords(current);
      extendos = validMoves(coords[0],coords[1]);
      if(extendos.length == 0){
        setTimeout(function(){ lost = true; }, 2000);
        endMessage = loseTexts[Math.round(this.random(loseTexts.length-1))];
      }
    }
    else{
      current = path[path.length-1];
      var coords = getCoords(current);
      extendos = validMoves(coords[0],coords[1]);
    }

  }

  //BOARD DISPLAY CHANGES
  for(var i = 0; i < 8; i ++){
    for(var j = 0; j < 8; j ++){
      //current spot
      if(board[i][j].id == current){
        this.fill(178, 235, 206);
        this.rect(board[i][j].x,board[i][j].y,squareSize, squareSize);
        this.image(goldenknight, board[i][j].x, board[i][j].y, squareSize + 5, squareSize)
      }
      //possible move spot
      else if(extendos.includes(board[i][j].id)){
        this.fill("#8cff66");
        this.rect(board[i][j].x,board[i][j].y,squareSize, squareSize);
      }
      //path taken
      else if(path.includes(board[i][j].id)){
        this.fill(61, 104, 100);
        this.rect(board[i][j].x,board[i][j].y,squareSize, squareSize);
      }
      //rest of squares
      else if(i % 2 != j % 2){
        //dark tiles
        this.fill(100);
        this.rect(board[i][j].x,board[i][j].y,squareSize, squareSize);
      }
      else{
        //light tiles
        this.fill(255, 255, 255);
        this.rect(board[i][j].x,board[i][j].y,squareSize, squareSize);
      }

    }
  }

  //lines
  for(var i = 0; i < path.length-1;i++){
    var beginCoords = getCoords(path[i]);
    var start = board[beginCoords[0]][beginCoords[1]];

    var endCoords = getCoords(path[i+1]);
    var stop = board[endCoords[0]][endCoords[1]];

    this.stroke(125,254,255);
    this.strokeWeight(5);

    this.line(start.x + squareSize/2, start.y + squareSize/2, stop.x + squareSize/2, stop.y + squareSize/2)
  }
  //score display
  if(path.length > 1){
    var counterSpot = getCoords(path[path.length-2]);
    var counter = board[counterSpot[0]][counterSpot[1]];
    this.textSize(20);
    this.textFont('Helvetica');
    this.stroke(255);
    this.strokeWeight(2);
    this.fill(0);
    this.text(score,counter.x + squareSize/3, counter.y + squareSize/2);
  }


//LEFT BUTTONS
this.stroke(0);
this.strokeWeight(2);

// restart button
this.textSize(14);
this.textFont('Helvetica');
this.fill(255, 255, 255);
this.text("RESTART", 20, 205);
this.fill(141, 235, 206);
this.ellipse(50, 165, 50, 50);

// arrow
this.stroke(0, 0, 0);
this.strokeWeight(3);

// arrow
this.stroke(0, 0, 0);
this.strokeWeight(3);
this.line(42, 161, 42, 171)
this.line(42, 171, 61, 171)
this.line(63, 171, 42, 171)

this.line(63, 171, 60, 166)
this.line(63, 171, 60, 175)


// undo button
this.textSize(14);
this.textFont('Helvetica');
this.fill(255, 255, 255);
this.text("UNDO", 28, 366);
this.fill(111, 184, 162);
this.ellipse(50, 325, 50, 50);

// arrow
this.stroke(0, 0, 0);
this.strokeWeight(3);
this.line(42, 321, 42, 331)
this.line(42, 331, 61, 331)
this.line(63, 331, 42, 331)

this.line(63, 331, 60, 326)
this.line(63, 331, 60, 333)

//give up button
this.textSize(14);
this.textFont('Helvetica');
this.fill(255, 255, 255);
this.text("GIVE UP", 22, 516);
this.fill(0);
this.text("(on life)", 26, 529)
this.fill(48, 79, 70);
this.ellipse(50, 475, 50, 50);

this.stroke(0, 0, 0);
this.strokeWeight(3);
this.line(50, 460, 50, 485);

this.line(42, 480, 50, 485);
this.line(58, 480, 50, 485);

// Start text
this.textSize(30);
this.textFont('Helvetica');
this.fill(255, 255, 255);
this.text("START", 280, boardEnd + 40);

// start arrow
// point
this.stroke(255, 255, 255);
this.strokeWeight(6)
this.line(140, 530, 130, 535)
this.line(140, 530, 150, 535)

// extension
this.stroke(255, 255, 255);
this.strokeWeight(6)
this.line(140, 530, 140, 540);

// right straight
this.stroke(255, 255, 255);
this.strokeWeight(6);
this.line(150, 550, 245, 550);

// curve
this.stroke(255, 255, 255);
this.strokeWeight(6);
this.noFill();
this.arc(150, 540, 20, 20, Math.PI/2, Math.PI);

  for (let user of floor.users) {
    pb.drawUser(user);
    // console.log(user);
    // console.log(floor.users[0]);
  }

  setTimeout(function(){ console.log("Use the force young knight-awan") }, 10000);
  if(intro){
    this.textSize(40);
    this.textFont('Courier New');
    this.fill(71, 161, 44, 98);
    this.rect(100, 100, 424, 424);

    // Instructions text 1
    this.fill(0);
    this.text(instructions[0], 172, 152);

    // Instructions text 2
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[1], 120, 187);

    // Instructions text 3
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[2], 120, 212);


    // Instructions text 4
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[3], 120, 237);

    // Instructions text 5
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[4], 113, 262);

    // Instructions text 6
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[5], 120, 297);

    // Instructions text 7
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[6], 116, 322);

    // Instructions text 8
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[7], 116, 347);

    // Instructions text 9
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[8], 116, 367);

    // Instructions text 10
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[9], 116, 402);

    // Instructions text 11
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[10], 116, 427);

    // Instructions text 12
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[11], 116, 452);

    // Instructions text 13
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[12], 116, 477);

    //text shadow
    this.textSize(40);
    this.textFont('Courier New');

    // Instructions text 1
    this.fill(255);
    this.text(instructions[0], 170, 150);

    // Instructions text 2
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[1], 118, 185);

    // Instructions text 3
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[2], 118, 210);


    // Instructions text 4
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[3], 118, 235);

    // Instructions text 5
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[4], 111, 260);

    // Instructions text 6
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[5], 118, 295);

    // Instructions text 7
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[6], 114, 320);

    // Instructions text 8
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[7], 114, 345);

    // Instructions text 9
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[8], 114, 365);

    // Instructions text 10
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[9], 114, 400);

    // Instructions text 11
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[10], 114, 425);

    // Instructions text 12
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[11], 114, 450);

    // Instructions text 13
    this.textSize(20);
    this.textFont('Helvetica');
    this.text(instructions[12], 114, 475);
  }

};

export const behavior = {
  title: "Sensor Debug (P5)",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 1
};
export default behavior

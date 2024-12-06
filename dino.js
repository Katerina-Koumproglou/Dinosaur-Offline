//Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//Ducking dino
let dinoDuckWidth = 118;
let dinoDuckHeight = 60;
let dinoDuckY = boardHeight - dinoDuckHeight;
let dinoDuckImg;

let dinoDuck = {
  x: dinoX,
  y: dinoDuckY,
  width: dinoDuckWidth,
  height: dinoDuckHeight,
};

//Cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//Physics
let velocityX = -8; //Cactus moving left speed
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let gameOverImg;
let scoreSpeed = 0.2;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  //draw initial dinosaur
  //   context.fillStyle = "green";
  //   context.fillRect(dino.x, dino.y, dino.width, dino.height);

  dinoImg = new Image();
  dinoImg.src = "./images/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  dinoDuckImg = new Image();
  dinoDuckImg.src = "./images/dino-duck1.png";

  cactus1Img = new Image();
  cactus1Img.src = "./images/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./images/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./images/cactus3.png";

  gameOverImg = new Image();
  gameOverImg.src = "./images/game-over.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveDino);
  document.addEventListener("keyup", stopDucking);
};

function update() {
  if (gameOver) {
    context.drawImage(
      gameOverImg,
      boardWidth / 2 - gameOverImg.width / 2,
      boardHeight / 2 - gameOverImg.height / 2
    );
    return;
  }

  requestAnimationFrame(update);

  context.clearRect(0, 0, board.width, board.height);

  //Dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //Cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./images/dino-dead.png";
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      };
    }
  }

  //Score
  context.fillStyle = "black";
  context.font = "20px courier";
  score += scoreSpeed;
  context.fillText(Math.round(score), 5, 20);
}

let isDucking = false;
function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    velocityY = -10;
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    if (!isDucking) {
      isDucking = true;
      dinoDuckImg.src = "./images/dino-duck1.png";
      dinoDuckImg.onload = function () {
        context.drawImage(
          dinoDuckImg,
          dinoDuck.x,
          dinoDuck.y,
          dinoDuck.width,
          dinoDuck.height
        );
      };
    }
  }
}

function stopDucking(e) {
  if (e.code == "ArrowDown" && isDucking) {
    isDucking = false;
    dinoImg.src = "./images/dino.png";
    dinoImg.onload = function () {
      context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    };
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();

  if (placeCactusChance > 0.9) {
    //10% chance you get cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% chance you get cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% chance you get cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

//Board
let board;
let boardWidth = 750;
let boardHeight = 300;
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
  img: null,
};

//Ducking dino
let dinoDuckWidth = 118;
let dinoDuckHeight = 60;
let dinoDuckY = boardHeight - dinoDuckHeight;
let dinoDuckImg;

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

//Run physics
let runFrame = 0;
let runFrameCounter = 0;
let frameDelay = 15;

let gameOver = false;
let gameOverImg;
let scoreSpeed = 0.2;
let score = 0;

//Replay
let replayImg;
let replayButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

//Sounds
let jumpSound;
let deathSound;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d"); //used for drawing on the board

  //draw initial dinosaur
  //   context.fillStyle = "green";
  //   context.fillRect(dino.x, dino.y, dino.width, dino.height);

  //Loading images
  dinoImg = new Image();
  dinoImg.src = "./images/dino.png";
  dino.img = dinoImg;

  dinoRun1Img = new Image();
  dinoRun1Img.src = "./images/dino-run1.png";

  dinoRun2Img = new Image();
  dinoRun2Img.src = "./images/dino-run2.png";

  dinoDuckImg = new Image();
  dinoDuckImg.src = "./images/dino-duck1.png";

  cactus1Img = new Image();
  cactus1Img.src = "./images/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./images/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./images/cactus3.png";

  dinoDeadImg = new Image();
  dinoDeadImg.src = "./images/dino-dead.png";

  gameOverImg = new Image();
  gameOverImg.src = "./images/game-over.png";

  replayImg = new Image();
  replayImg.src = "./images/replay.png";

  //Loading sounds
  jumpSound = new Audio("./sounds/jump.mp3");
  deathSound = new Audio("./sounds/death.mp3");

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
  document.addEventListener("keydown", moveDino);
  document.addEventListener("keyup", stopDucking);
  board.addEventListener("click", replayClick);
  board.addEventListener("mousemove", replayClick);
};

function update() {
  if (gameOver) {
    //Game Over image placement
    context.drawImage(
      gameOverImg,
      boardWidth / 2 - gameOverImg.width / 2,
      boardHeight / 2 - gameOverImg.height / 2 - 75
    );

    //Replay image placement
    replayButton.x = boardWidth / 2 - replayImg.width / 2;
    replayButton.y = boardHeight / 2 - replayImg.height / 2;
    replayButton.width = replayImg.width;
    replayButton.height = replayImg.height;
    context.drawImage(
      replayImg,
      replayButton.x,
      replayButton.y,
      replayButton.width,
      replayButton.height
    );
    return;
  }

  requestAnimationFrame(update);

  context.clearRect(0, 0, board.width, board.height);

  //Dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, boardHeight - dino.height);
  context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);

  //Dino animation for running
  if (dino.y == dinoY && !isDucking) {
    runFrameCounter++;
  }

  if (runFrameCounter >= frameDelay) {
    runFrame = (runFrame + 1) % 2;
    if (runFrame == 0) {
      dino.img = dinoRun1Img;
    } else {
      dino.img = dinoRun2Img;
    }
    runFrameCounter = 0;
  }

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
      isDucking = false;
      dino.width = dinoWidth;
      dino.height = dinoHeight;
      dino.y = dinoY;
      dino.img = dinoDeadImg;
      deathSound.play();
      dino.img.src = "./images/dino-dead.png";
      context.clearRect(0, 0, board.width, board.height);
      dino.img.onload = function () {
        context.drawImage(dino.img, dino.x, dino.y, dino.width, dino.height);
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
    jumpSound.currentTime = 0;
    jumpSound.play();
  } else if (e.code == "ArrowDown" && dino.y == dinoY) {
    if (!isDucking) {
      isDucking = true;
      dino.img = dinoDuckImg;
      dino.width = dinoDuckWidth;
      dino.height = dinoDuckHeight;
      dino.y = dinoDuckY;
    }
  }
}

function stopDucking(e) {
  if (e.code == "ArrowDown" && isDucking) {
    isDucking = false;
    dino.img = dinoImg;
    dino.width = dinoWidth;
    dino.height = dinoHeight;
    dino.y = dinoY;
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

function replayClick(e) {
  if (!gameOver) return;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (
    mouseX >= replayButton.x &&
    mouseX <= replayButton.x + replayButton.width &&
    mouseY >= replayButton.y &&
    mouseY <= replayButton.y + replayButton.height
  ) {
    board.style.cursor = "pointer";

    if (e.type === "click") {
      restartGame();
    }
  } else {
    board.style.cursor = "default";
  }
}

function restartGame() {
  gameOver = false;
  dino.img = dinoImg;
  dino.x = dinoX;
  dino.y = dinoY;
  dino.width = dinoWidth;
  dino.height = dinoHeight;

  velocityX = -8;
  velocityY = 0;
  cactusArray = [];
  score = 0;
  requestAnimationFrame(update);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

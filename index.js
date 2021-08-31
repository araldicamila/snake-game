"use strict";

const boardBorder = "black";
const boardBackground = "white";
const snakeColumn = "blue";
const snakeBorder = "darkblue";

const board = document.getElementById("snakeboard");
const boardcontext = board.getContext("2d");

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let changingDirection = false;
let horizontalVelocity = 10;
let verticalVelocity = 0;

let foodX;
let foodY;

let score = 0;

main();
generateFood();

document.addEventListener("keydown", changeDirection);

function main() {
  if (gameOver()) return writeGameOver();

  changingDirection = false;
  setTimeout(function () {
    clearCanvas();
    drawSnake();
    drawFood();
    moveSnake();
    drawSnake();

    main();
  }, 100);
}

function drawSnakePieces(piece) {
  boardcontext.fillStyle = "#B0FFC1";
  boardcontext.strokeStyle = "#40854E";

  boardcontext.fillRect(piece.x, piece.y, 10, 10);
  boardcontext.strokeRect(piece.x, piece.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePieces);
}

function drawFood() {
  boardcontext.fillStyle = "red";
  boardcontext.strokeStyle = "red";

  boardcontext.fillRect(foodX, foodY, 10, 10);
  boardcontext.strokeRect(foodX, foodY, 10, 10);
}

function clearCanvas() {
  boardcontext.fillStyle = boardBackground;
  boardcontext.strokeStyle = boardBorder;
  boardcontext.fillRect(0, 0, board.width, board.height);
  boardcontext.strokeRect(0, 0, board.width, board.height);
}

// Game over

function gameOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > board.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > board.height - 10;

  return hitLeftWall || hitRightWall || hitBottomWall || hitTopWall;
}

function writeGameOver() {
  clearCanvas();

  boardcontext.textAlign = "center";
  boardcontext.font = "32px Arial";
  boardcontext.fillStyle = "#000";
  boardcontext.fillText("Game over 😢", board.width / 2, board.height / 2);
}

// Direction

function changeDirection(event) {
  const LEFT_KEY = 65;
  const RIGHT_KEY = 68;
  const UP_KEY = 87;
  const DOWN_KEY = 83;

  if (changingDirection) return;

  changingDirection = true;

  const keyPressed = event.keyCode;

  const goingUp = verticalVelocity === -10;
  const goingDown = verticalVelocity === 10;
  const goingRight = horizontalVelocity === 10;
  const goingLeft = horizontalVelocity === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    horizontalVelocity = -10;
    verticalVelocity = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    horizontalVelocity = 0;
    verticalVelocity = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    horizontalVelocity = 10;
    verticalVelocity = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    horizontalVelocity = 0;
    verticalVelocity = 10;
  }
}

/* Rendering food */

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
  foodX = randomFood(0, board.width - 10);
  foodY = randomFood(0, board.height - 10);

  snake.map((i) => {
    const hasEaten = i.x === foodX && i.y === foodY;

    if (hasEaten) generateFood();
  });
}

function moveSnake() {
  const head = {
    x: snake[0].x + horizontalVelocity,
    y: snake[0].y + verticalVelocity,
  };

  snake.unshift(head);

  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;

  if (hasEatenFood) {
    score += 10;

    document.getElementById("score").innerHTML = score;

    generateFood();
  } else {
    snake.pop();
  }
}

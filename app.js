// For targeting html canvas
const cvs = document.getElementById("breakOut");
const ctx = cvs.getContext("2d");

// Breakout Ball game variables
let PADDLE_WIDTH = 100;
let PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
const BACKGROUND = new Image;
BACKGROUND.src = "./bg4.jpg";

let leftArrow = false
let rightArrow = false
let LIFE = 3;
let SCORE = 0;
let SCORE_UNIT = 10;
let LEVEL = 1;
let MAX_LEVEL = 3;
let SCORE_IMG = new Image();
let LEVEL_IMG = new Image();
let LIFE_IMG = new Image();
let GAME_OVER = false;
let BRICK_HIT = new Audio();
let PADDLE_HIT = new Audio();
let LIFE_LOST = new Audio();
let WALL_COLLISION = new Audio();
let WIN_SOUND = new Audio();
let Game_Over = new Audio();

// Game Sounds
BRICK_HIT.src = "./sounds/brick_hit.mp3";
PADDLE_HIT.src = "./sounds/Paddle_Bounce.mp3";
LIFE_LOST.src = "./sounds/life_lost.mp3";
WALL_COLLISION.src = "./sounds/Wall_Collision.mp3";
WIN_SOUND.src = "./sounds/Win_Sound.mp3";
Game_Over.src = "./sounds/Game_Over.wav";

// Assigning border size to paddle
ctx.lineWidth = 3;

// Creating Paddle
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

// Designing Paddle through draw function
function drawPaddle() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "red";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Adding event listener to key
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = true;
    } else if (event.key === "ArrowRight") {
        rightArrow = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        leftArrow = false;
    } else if (event.key === "ArrowRight") {
        rightArrow = false;
    }
});

// Creating function for moving the paddle
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}


// Creating Ball
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 6,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

// Designing Ball through Draw function
function drawBall() {
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.strokeStyle = "orange";
    ctx.stroke();

    ctx.closePath();

}

// Function for movement of the ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Function for ball collision with wall
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
        WALL_COLLISION.play();
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        WALL_COLLISION.play();
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        resetBall();
    }
}

// Reseting the ball direction
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Function for ball collision with paddle
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y) {

        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        collidePoint = collidePoint / (paddle.width / 2);

        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
        PADDLE_HIT.play();
    }
}

// Creating Bricks
const brick = {
    row: 1,
    column: 8,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "green",
    strokeColor: "yellow"
}

let bricks = []; // using array for storing bricks

// function to create bricks in rows and columns
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}

createBricks();

// Function for drawing bricks
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// Function for ball collision with bricks
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                    BRICK_HIT.play();
                }
            }
        }
    }
}

// Designing Game points
function showGamePoints(text, textX, textY) {
    ctx.fillStyle = "gold";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

}

// GameOver Function
function gameOver() {
    if (LIFE < 0) {
        GAME_OVER = true;
        Game_Over.play();
        showGamePoints("Game Over 😣", cvs.width / 2 - 60, cvs.height / 2);
        showGamePoints("Refresh to Play Again!", cvs.width / 2 - 100, cvs.height / 2 + 30);
    }
}

// Function for leveling up
function levelUp() {
    let isLevelDone = true;

    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;

        }
    }

    if (isLevelDone) {
        if (LEVEL >= MAX_LEVEL) {
            GAME_OVER = true;
            WIN_SOUND.play();
            showGamePoints("YOU WIN 😎 !", cvs.width / 2 - 45, cvs.height / 2);
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        paddle.width -= 15;
        resetBall();
        LEVEL++;
    }
}

// Drawing function for all game entities
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    showGamePoints("🏆Score:" + SCORE, 5, 25);
    showGamePoints("❤️Life:" + LIFE, cvs.width - 115, 25);
    showGamePoints("📶Level:" + LEVEL, cvs.width / 2 - 70, 25);
}

// Using update function to update logic of game entities
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
}

// Using loop function
function loop() {
    ctx.drawImage(BACKGROUND, 0, 0);

    draw();

    update();

    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }
}
// Calling loop function
loop()
const CANVAS_NODE = document.getElementById('arkanoid');
const CTX = CANVAS_NODE.getContext('2d');

const BALL_RADIUS = 5;

CTX.fillStyle = '#6c7fed';
CTX.font = '16px Arial';

const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 7;

const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 3;
const BRICK_WIDTH = 40;
const BRICK_HEIGHT = 10;
const BRICK_PADDING = 10;
const BRICK_OFSET = 30;

let ballX = CANVAS_NODE.width / 2;
let ballY = CANVAS_NODE.height - 30;
let dx = 0.5;
let dy = -0.5;

let paddlex = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;

let score = 0;
let lives = 3;
const bricks = [];

for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
    bricks[i] = [];
    for (let j = 0; j < BRICK_ROW_COUNT; j++) {
        bricks[i][j] = {
            x: 0,
            y: 0,
            status: 1
        }
    }
}

function drawBall() {
    CTX.beginPath();
    CTX.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath;
}

function drawPaddle() {
    CTX.beginPath();
    CTX.rect(paddlex, CANVAS_NODE.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    CTX.fill();
    CTX.closePath();
}

function drawBricks() {
    for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
        for (let j = 0; j < BRICK_ROW_COUNT; j++) {
            if (bricks[i][j].status === 1) {
                const BRICK_X = j * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFSET;
                const BRICK_Y = i * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFSET;

                bricks[i][j].x = BRICK_X;
                bricks[i][j].y = BRICK_Y;

                CTX.beginPath();
                CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
                CTX.fill();
                CTX.closePath();
            }
        }
    }
}

function drawScore() {
    CTX.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    CTX.fillText("Lives: " + lives, CANVAS_NODE.width - 75, 20);
}

function detectCollisison() {
    for (let i = 0; i < BRICK_COLUMN_COUNT; i++) {
        for (let j = 0; j < BRICK_ROW_COUNT; j++) {
            let brick = bricks[i][j];

            if (brick.status === 1) {
                const isCollisionTrue =
                    ballX > brick.x && ballX < brick.x + BRICK_WIDTH &&
                    ballY > brick.y && ballY < brick.y + BRICK_HEIGHT;

                if (isCollisionTrue) {
                    dy = -dy;
                    brick.status = 0;

                    score++;

                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        alert('Winner winner checken dinner!! \n Congratulations!!! \n but check your wifi');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

document.addEventListener('mousemove', handleMouseMove);

function handleMouseMove(e) {

    const RELATIVE_X = e.clientX - CANVAS_NODE.offsetLeft - 160;

    if (RELATIVE_X > 0 && RELATIVE_X < CANVAS_NODE.width) {
        paddlex = RELATIVE_X - PADDLE_WIDTH / 2;
    }
}

function draw() {
    CTX.clearRect(0, 0, CANVAS_NODE.width, CANVAS_NODE.height)
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollisison();


    if (ballX + dx < BALL_RADIUS || ballX + dx > CANVAS_NODE.width - BALL_RADIUS) {
        dx = -dx;
    }

    if (ballY + dy < BALL_RADIUS) {
        dy = -dy
    }

    if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS) {
        if (ballX > paddlex && ballX < paddlex + PADDLE_WIDTH) {
            dy = -dy;
        } else {
            lives--;

            if (lives === 0) {
                alert('Game over!!');
                document.location.reload();
            } else {
                ballX = CANVAS_NODE.width / 2;
                ballY = CANVAS_NODE.height - 30;
                dx = 0.5;
                dy = -0.5
                paddlex = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    ballX += dx;
    ballY += dy;

    requestAnimationFrame(draw);
}

draw();
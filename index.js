console.log("Breakout Game");
//some variabels
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");
const bg = new Image();
bg.src = "bg.jpg";
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const radius = 8;
let life = 3;
let rightKey = false;
let leftKey = false;
ctx.lineWidth = 3
let score = 0
let youlose = document.getElementById("youlose");
let gameover = document.getElementById("gameover");
let youwon = document.getElementById("youwon")
let mxlevel = 1
let over;
let sc = new Image()
sc.src = "score.png";
let level = new Image()
level.src = "level.png"
let lifeImg = new Image()
lifeImg.src = "life.png"

const brickHit = new Audio("2D Breakout Game JavaScript - FULL GAME_sounds_brick_hit.mp3");
const lifeLost = new Audio("2D Breakout Game JavaScript - FULL GAME_sounds_life_lost.mp3")
const paddleHit = new Audio("2D Breakout Game JavaScript - FULL GAME_sounds_paddle_hit.mp3")
const wall = new Audio("2D Breakout Game JavaScript - FULL GAME_sounds_wall.mp3");
const winG = new Audio("2D Breakout Game JavaScript - FULL GAME_sounds_win.mp3")
//padddle

let paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - (PADDLE_HEIGHT + PADDLE_MARGIN_BOTTOM),
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    pX: 5,

}

//drawPaddle()

function drawPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

    ctx.strokeStyle = "yellow"
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
}
//to draw the paddle..
document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        leftKey = true;
    } else if (e.keyCode == 39) {
        rightKey = true;
    }
})

document.addEventListener("keyup", (e) => {
    if (e.keyCode == 37) {
        leftKey = false;
    } else if (e.keyCode == 39) {
        rightKey = false;
    }
})
//movePaddle()
function movePaddle() {
    if (leftKey && paddle.x > 0) {
        paddle.x -= paddle.pX
    } else if (rightKey && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.pX
    }
}

//ball
let ball = {
    x: cvs.width / 2,
    y: paddle.y - radius,
    radius: radius,
    speed: 4,
    bX: 3 * (Math.random() * 2 - 1), //defines which direction the ball will go.
    bY: 3
}

//drawBall()
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = "rgb(170, 175, 99)";
    ctx.fill()
    ctx.strokeStyle = "rgb(4, 107, 97)"

    ctx.stroke()
    ctx.closePath()
}

//moveball
function moveBall() {
    ball.x += ball.bX;
    ball.y -= ball.bY
}
// ballWallColide()
function ballWallColide() {
    //hits  right.
    if (ball.x + ball.radius > cvs.width) {
        ball.bX = -ball.bX; //-ball.bX mean multiply previous ball.bx value with minus..
        wall.play()
    }
    //hits left
    if (ball.x - ball.radius < 0) {
        ball.bX = -ball.bX;
        wall.play()
    }
    //if hits top
    if (ball.y - ball.radius < 0)
    //the top of canvas starts with 0
    {
        ball.bY = -ball.bY;
        wall.play()
    }
    if (ball.y + ball.radius > cvs.height) //if the ball goes down 
    {
        life--
        resetBall()
        lifeLost.play()
    }
}
// ballPaddleColide()
function ballPaddleColide() {
    if (ball.y + ball.radius > paddle.y && ball.y + ball.radius < paddle.y + paddle.height && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        //ball.x > paddle.x && ball.x < paddle.x + paddle.width means inside the paddle.
        paddleHit.play()
        let colidePoint = ball.x - (paddle.x + paddle.width / 2);
        colidePoint = colidePoint / (paddle.width / 2)
        let angel = colidePoint * Math.PI / 3;
        ball.bX = ball.speed * Math.sin(angel);
        ball.bY = ball.speed * Math.cos(angel);
    }
}

//brick
let brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    marginTop: 40,
    left: 20,
    top: 20,
    fillColor: "black",
    strokeColor: "white"
}
//createBrick()
let bricks = [];

function createBrick() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = []
        //the position will change depending on r and c

        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.left + brick.width) + brick.left,
                y: r * (brick.top + brick.height) + brick.marginTop + brick.top,
                status: true
            }
        }
    }
}
createBrick()
//drawBrick()
function drawBrick() {
    for (let r = 0; r < brick.row; r++) {

        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c]

            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);

            }

        }
    }
}

//ballBrickColide()


function ballBrickColide() {
    for (let r = 0; r < brick.row; r++) {

        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c]

            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y - ball.radius < b.y + brick.height && ball.y + ball.radius > b.y) {
                    ball.bY = -ball.bY; //if the ball is going top it means ball.bY is in negative so we have to turn it into positive so that the ball comes down..
                    b.status = false;
                    score++
                    brickHit.play()
                }

            }

        }
    }
}

function levelUp() {
    let levelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {

            levelDone = levelDone && !bricks[r][c].status

        }

    }

    if (levelDone) {
        brick.row++
        mxlevel++
        createBrick()
        resetBall()
    }
    if (mxlevel > 3) {
        over = true;
        win()
    }

}
//draw() will call everything that is running in this game.

function draw() {
    //setting the background image
    ctx.drawImage(bg, 0, 0)
    drawPaddle();
    drawBall();
    ballWallColide();
    ballPaddleColide();
    drawBrick()
    move();
    ballBrickColide()
    levelUp();
    gameOver()
    if (!over) {
        requestAnimationFrame(draw)
    }
    //score board
    ctx.fillStyle = "black"
    ctx.drawImage(sc, 12, 5, 30, 30)
    ctx.fillText(score, 49, 27);
    ctx.font = "25px sans-serif";
    //level
    ctx.fillStyle = "green"
    ctx.drawImage(level, cvs.width / 2 - paddle.width / 2, 5, 30, 30)
    ctx.fillText(mxlevel, 190, 32)
    ctx.font = "25px sans-serif"
    //life
    ctx.fillStyle = "red"
    ctx.drawImage(lifeImg, cvs.width - 70, 5, 30, 30)
    ctx.fillText(life, 370, 30)
    ctx.font = "25px sans-serif"

}

draw()

//move() will handle everything related to the moving of the game..

function move() {
    movePaddle()
    moveBall()
}

//for resetting the ball
function resetBall() {
    ball.x = cvs.width / 2,
        ball.y = paddle.y - radius,
        ball.bX = 3 * (Math.random() * 2 - 1), //defines which direction the ball will go.
        ball.bY = 3
}

//gameOver()
function gameOver() {

    if (life < 0) {
        over = true
        lose()
    }
}

function lose() {
    gameover.style.display = "block"
    youlose.style.display = "block"
}

function win() {
    gameover.style.display = "block"
    youwon.style.display = "block"
    winG.play()
}

document.getElementById("restart").addEventListener("click", () => {
    location.reload()
})
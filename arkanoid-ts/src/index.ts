import { CanvasView } from "./view/CanvasView"
import { Ball } from "./sprites/Ball"
import { Paddle } from "./sprites/Paddle"
import { Brick } from "./sprites/Brick"
import PADDLE_IMAGE from "./images/paddle.png"
import BALL_IMAGE from "./images/ball.png"
import { Collision } from "./Collison"

import {
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    BALL_SPEED,
    BALL_SIZE,
    BALL_STARTX,
    BALL_STARTY
} from "./setup"
//helpers

import { createBricks } from "./helpers"

let gameOver = false;
let score = 0;

function setGameOver(view: CanvasView) {
    view.drawInfo("Uhoh, Game Over!")
    gameOver = false
}
function setGameWin(view: CanvasView) {
    view.drawInfo("You won the game!")
    gameOver = false
}
function gameLoop(
    view: CanvasView,
    bricks: Brick[],
    paddle: Paddle,
    ball: Ball,
    collision: Collision
) {
    console.log("draw!")
    view.clear()
    view.drawBricks(bricks)
    view.drawSprite(paddle)
    view.drawSprite(ball)

    //move ball
    ball.moveBall()
    // move paddle, & check so wont exit play field

    if (paddle.isMovingLeft && paddle.pos.x > 0 ||
        paddle.isMovingRight && paddle.pos.x < (view.canvas.width - paddle.width)) {
        paddle.movePaddle()
    }
    collision.checkBallCollision(ball, paddle, view)
    const collidingBrick = collision.isCollidingBricks(ball, bricks)

    if (collidingBrick) {
        score += 1
        view.drawScore(score)
    }

    if (ball.pos.y > view.canvas.height) gameOver = true
    if (bricks.length === 0) setGameWin(view)
    if (gameOver) return setGameOver(view)

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision))
}



function startGame(view: CanvasView) {
    //reset display
    score = 0;
    view.drawInfo('')
    view.drawScore(0)
    // create instance of collection
    const collision = new Collision();

    // create all bricks
    const bricks = createBricks();

    const ball = new Ball(
        BALL_SPEED,
        BALL_SIZE,
        {
            x: BALL_STARTX,
            y: BALL_STARTY
        },
        BALL_IMAGE
    )

    // create a paddle
    const paddle = new Paddle(
        PADDLE_SPEED,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        {
            x: PADDLE_STARTX,
            y: view.canvas.height - PADDLE_HEIGHT - 5
        },
        PADDLE_IMAGE
    )

    gameLoop(view, bricks, paddle, ball, collision)
}


const view = new CanvasView("#playField")
view.initStartButton(startGame);



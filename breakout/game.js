const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Load ball image
const ballImage = new Image();
let imageLoaded = false;

ballImage.onload = function() {
    imageLoaded = true;
    // Habilitar el botón de inicio solo cuando la imagen esté cargada
    startButton.disabled = false;
    startButton.textContent = 'Comenzar Juego';
};

ballImage.onerror = function() {
    console.error('Error al cargar la imagen');
    startButton.textContent = 'Error al cargar la imagen';
};

ballImage.src = 'jp.png';

// Deshabilitar el botón de inicio hasta que la imagen esté cargada
startButton.disabled = true;
startButton.textContent = 'Cargando...';

// Set canvas size
canvas.width = 800;
canvas.height = 500;

// Game variables
let score = 0;
let lives = 3;
let gameRunning = false;

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 15;
const paddleSpeed = 8;
let paddleX = (canvas.width - paddleWidth) / 2;

// Ball properties
const ballRadius = 20; // Aumentado para la imagen
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = -2; // Reducido de 5 a 2
let ballSpeedY = -6; // Reducido de -5 a -2

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Create bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Colors for bricks
const brickColors = ['#ff4757', '#ff6b81', '#ffa502', '#ffd700', '#7bed9f'];

// Mouse movement
let rightPressed = false;
let leftPressed = false;

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);
restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth &&
                    ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score += 10;
                    scoreElement.textContent = score;
                    
                    // Check if all bricks are destroyed
                    if (score === brickRowCount * brickColumnCount * 10) {
                        gameOver(true);
                    }
                }
            }
        }
    }
}

function drawBall() {
    if (imageLoaded) {
        ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    } else {
        // Dibujar un círculo temporal mientras se carga la imagen
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[r];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function gameOver(win = false) {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
    if (win) {
        gameOverScreen.querySelector('h2').textContent = '¡Ganaste!';
    }
}

function startGame() {
    if (!imageLoaded) return; // No iniciar el juego si la imagen no está cargada
    startScreen.style.display = 'none';
    gameRunning = true;
    draw();
}

function restartGame() {
    score = 0;
    lives = 3;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 2; // Actualizado aquí también
    ballSpeedY = -2; // Actualizado aquí también
    paddleX = (canvas.width - paddleWidth) / 2;
    
    // Reset bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    gameOverScreen.style.display = 'none';
    gameRunning = true;
    draw();
}

function draw() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    
    // Ball collision with walls
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            lives--;
            livesElement.textContent = lives;
            
            if (lives === 0) {
                gameOver();
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - 30;
                ballSpeedX = 2;
                ballSpeedY = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    
    // Paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
    
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    requestAnimationFrame(draw);
}

// Initialize the game
draw(); 
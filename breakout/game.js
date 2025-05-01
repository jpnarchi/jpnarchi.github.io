/// Juan Pablo Narchi A01781518
// JUEGO BREAKOUT LOGICA DE JAVASCRIPT

// Obtener elementos del DOM
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Configurar tamaño del canvas
canvas.width = 800;
canvas.height = 500;

// Clase Vector para manejar posiciones y velocidades
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }
}

// Clase GameObject base
class GameObject {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// Clase Ball
class Ball extends GameObject {
    constructor(position, radius, color) {
        super(position, radius * 2, radius * 2, color);
        this.radius = radius;
        this.x = position.x;
        this.y = position.y;
        this.speedX = -2;
        this.speedY = -6;
        this.image = new Image();
        this.imageLoaded = false;
        this.image.src = 'jp.png';
        this.image.onload = () => {
            this.imageLoaded = true;
            startButton.disabled = false;
            startButton.textContent = 'Comenzar Juego';
        };
        this.image.onerror = () => {
            console.error('Error al cargar la imagen');
            startButton.textContent = 'Error al cargar la imagen';
        };
    }

    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, 
                this.x - this.radius, 
                this.y - this.radius, 
                this.radius * 2, 
                this.radius * 2
            );
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.speedX = 2;
        this.speedY = -2;
    }
}

// Clase Paddle
class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color);
        this.speed = 8;
        this.velocity = new Vec(0, 0);
    }

    update() {
        this.position = this.position.plus(this.velocity);
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
        }
    }
}

// Clase Brick
class Brick extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color);
        this.status = 1;
    }
}

// Variables del juego
let score = 0;
let lives = 3;
let gameRunning = false;
let bricks = [];
let ball;
let paddle;
let rightPressed = false;
let leftPressed = false;

// Configuración de ladrillos
const brickColors = ['#ff4757', '#ff6b81', '#ffa502', '#ffd700', '#7bed9f'];
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Función para configurar los ladrillos
function setupBricks() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const brickWidth = (canvas.width - brickOffsetLeft * 2 - brickPadding * (cols - 1)) / cols;
    const brickHeight = 20;

    bricks = [];
    for (let c = 0; c < cols; c++) {
        bricks[c] = [];
        for (let r = 0; r < rows; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r] = new Brick(
                new Vec(brickX, brickY),
                brickWidth,
                brickHeight,
                brickColors[r % brickColors.length]
            );
        }
    }
}

// Función para detectar colisiones
function collisionDetection() {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                if (ball.x > brick.position.x &&
                    ball.x < brick.position.x + brick.width &&
                    ball.y > brick.position.y &&
                    ball.y < brick.position.y + brick.height) {
                    ball.speedY = -ball.speedY;
                    brick.status = 0;
                    score += 10;
                    scoreElement.textContent = score;

                    // Verificar si se destruyeron todos los ladrillos
                    let allDestroyed = true;
                    for (let i = 0; i < bricks.length; i++) {
                        for (let j = 0; j < bricks[i].length; j++) {
                            if (bricks[i][j].status === 1) {
                                allDestroyed = false;
                                break;
                            }
                        }
                        if (!allDestroyed) break;
                    }
                    if (allDestroyed) {
                        gameOver(true);
                    }
                }
            }
        }
    }
}

// Función para manejar el fin del juego
function gameOver(win = false) {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.style.display = 'block';
    if (win) {
        gameOverScreen.querySelector('h2').textContent = '¡Ganaste!';
    }
}

// Función para iniciar el juego
function startGame() {
    if (!ball.imageLoaded) return;
    startScreen.style.display = 'none';
    setupBricks();
    gameRunning = true;
    draw();
}

// Función para reiniciar el juego
function restartGame() {
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    gameOverScreen.style.display = 'none';
    ball.reset();
    paddle.position = new Vec((canvas.width - paddle.width) / 2, canvas.height - 15);
    setupBricks();
    gameRunning = true;
    draw();
}

// Eventos del teclado y mouse
document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
        paddle.velocity.x = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
        paddle.velocity.x = -paddle.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
        if (!leftPressed) paddle.velocity.x = 0;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
        if (!rightPressed) paddle.velocity.x = 0;
    }
});

document.addEventListener('mousemove', (e) => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.position.x = relativeX - paddle.width / 2;
    }
});

restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);

// Inicializar objetos del juego
ball = new Ball(new Vec(canvas.width / 2, canvas.height - 30), 20, '#fff');
paddle = new Paddle(new Vec((canvas.width - 100) / 2, canvas.height - 15), 100, 15, '#fff');

// Función principal de dibujo y actualización del juego
function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar ladrillos
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status === 1) {
                bricks[c][r].draw(ctx);
            }
        }
    }

    // Dibujar y actualizar pelota y paleta
    ball.draw(ctx);
    paddle.draw(ctx);
    ball.update();
    paddle.update();

    // Detectar colisiones
    collisionDetection();

    // Colisiones con las paredes
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.speedX = -ball.speedX;
    }

    if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    } else if (ball.y + ball.radius > canvas.height) {
        if (ball.x > paddle.position.x && 
            ball.x < paddle.position.x + paddle.width) {
            ball.speedY = -ball.speedY;
        } else {
            lives--;
            livesElement.textContent = lives;
            if (lives === 0) {
                gameOver();
            } else {
                ball.reset();
                paddle.position = new Vec((canvas.width - paddle.width) / 2, canvas.height - 15);
            }
        }
    }

    requestAnimationFrame(draw);
}

// Inicializar el juego
draw(); 
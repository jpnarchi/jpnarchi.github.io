/*
 * Collection of classes that will be used in the games
 *
 * Gilberto Echeverria
 * 2025-02-25
 */

class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vec(this.x - other.x, this.y - other.y);
    }

    times(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;

        // Sprite properties
        this.spriteImage = undefined;
        this.spriteRect = undefined;
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    draw(ctx) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                              this.spriteRect.x * this.spriteRect.width,
                              this.spriteRect.y * this.spriteRect.height,
                              this.spriteRect.width, this.spriteRect.height,
                              this.position.x, this.position.y,
                              this.width, this.height);
            } else {
                ctx.drawImage(this.spriteImage,
                              this.position.x, this.position.y,
                              this.width, this.height);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y,
                         this.width, this.height);
        }
    }

    // Empty template for all GameObjects to be able to update
    update() {

    }
}

// Class to control the animation of characters and objects
class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols) {
        super(position, width, height, color, type);
        // Animation properties
        this.frame = 0;
        this.minFrame = 0;
        this.maxFrame = 0;
        this.sheetCols = sheetCols;

        this.repeat = true;
        this.isMoving = false;
        this.isAnimating = false;

        // Delay between frames (in milliseconds)
        this.frameDuration = 100;
        this.totalTime = 0;
        this.currentAnimationTime = 0;
    }

    setAnimation(minFrame, maxFrame, repeat, duration) {
        // Solo reiniciar la animación si es una nueva secuencia
        if (this.minFrame !== minFrame || this.maxFrame !== maxFrame) {
            this.minFrame = minFrame;
            this.maxFrame = maxFrame;
            this.frame = minFrame;
            this.currentAnimationTime = 0;
        }
        
        this.repeat = repeat;
        this.frameDuration = duration;
        this.isMoving = repeat;
        this.isAnimating = true;
        
        // Actualizar las coordenadas del sprite
        this.updateSpriteCoordinates();
    }

    updateSpriteCoordinates() {
        if (this.spriteRect) {
            this.spriteRect.x = this.frame % this.sheetCols;
            this.spriteRect.y = Math.floor(this.frame / this.sheetCols);
        }
    }

    updateFrame(deltaTime) {
        if (!this.isAnimating) return;

        this.currentAnimationTime += deltaTime;
        
        if (this.currentAnimationTime >= this.frameDuration) {
            // Si está en movimiento o es una animación que se repite
            if (this.isMoving || this.repeat) {
                // Avanzar al siguiente frame
                this.frame++;
                
                // Si llegamos al final de la secuencia, volver al inicio
                if (this.frame > this.maxFrame) {
                    this.frame = this.minFrame;
                }
            }
            
            // Actualizar las coordenadas del sprite
            this.updateSpriteCoordinates();
            
            // Reiniciar el temporizador de animación
            this.currentAnimationTime = 0;
        }
    }
}

class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;
        this.y = y;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}

// Detect a collision of two box objects
function boxOverlap(obj1, obj2) {
    return obj1.position.x + obj1.width > obj2.position.x &&
           obj1.position.x < obj2.position.x + obj2.width &&
           obj1.position.y + obj1.height > obj2.position.y &&
           obj1.position.y < obj2.position.y + obj2.height;
}

function randomRange(size, start) {
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

/*
 * Simple animation on the HTML canvas
 *
 * Gilberto Echeverria
 * 2025-02-19
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.5;
let animationDelay = 200;

// Class for the main character in the game
class Player extends AnimatedObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vec(0, 0);
    }

    update(deltaTime) {
        this.position = this.position.plus(this.velocity.times(deltaTime));

        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
        this.updateFrame(deltaTime);
    }
}

// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        this.player = new Player(new Vec(canvasWidth / 2, canvasHeight / 2), 60, 60, "red", 3);
        //this.player.setSprite('../assets/sprites/link_front.png')
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        this.player.setAnimation(1, 1, false, animationDelay);
        this.actors = [];
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        for (let actor of this.actors) {
            actor.update(deltaTime);
        }
        this.player.update(deltaTime);
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'w') {
                this.player.velocity.y = -playerSpeed;
                this.player.setAnimation(0, 2, true, animationDelay);
                this.player.isMoving = true; // Establecer que el jugador está en movimiento
            } else if (event.key == 'a') {
                this.player.velocity.x = -playerSpeed;
                this.player.setAnimation(9, 11, true, animationDelay);
                this.player.isMoving = true; // Establecer que el jugador está en movimiento
            } else if (event.key == 's') {
                this.player.velocity.y = playerSpeed;
                this.player.setAnimation(6, 8, true, animationDelay);
                this.player.isMoving = true; // Establecer que el jugador está en movimiento
            } else if (event.key == 'd') {
                this.player.velocity.x = playerSpeed;
                this.player.setAnimation(3, 5, true, animationDelay);
                this.player.isMoving = true; // Establecer que el jugador está en movimiento
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.player.velocity.y = 0;
                this.player.setAnimation(1, 1, false, animationDelay);
                this.player.isMoving = false; // El jugador ya no está en movimiento
            } else if (event.key == 'a') {
                this.player.velocity.x = 0;
                this.player.setAnimation(10, 10, false, animationDelay);
                this.player.isMoving = false; // El jugador ya no está en movimiento
            } else if (event.key == 's') {
                this.player.velocity.y = 0;
                this.player.setAnimation(7, 7, false, animationDelay);
                this.player.isMoving = false; // El jugador ya no está en movimiento
            } else if (event.key == 'd') {
                this.player.velocity.x = 0;
                this.player.setAnimation(4, 4, false, animationDelay);
                this.player.isMoving = false; // El jugador ya no está en movimiento
            }
        });
    }
}

// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
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
let animationDelay = 100;

// Class for the main character in the game
class Player extends AnimatedObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vec(0, 0);
        this.currentDirection = null;
        this.keysPressed = new Set();
        this.isMoving = false;
    }

    update(deltaTime) {
        // Update position
        this.position = this.position.plus(this.velocity.times(deltaTime));

        // Keep player within canvas bounds
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }

        // Always update animation frame
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
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png',
                              new Rect(48, 128, 48, 64));
        // Start with idle animation
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
            // Evitar que se procese la tecla si ya está presionada
            if (this.player.keysPressed.has(event.key)) return;

            if (event.key == 'w') {
                this.player.velocity.y = -playerSpeed;
                this.player.setAnimation(0, 2, true, animationDelay);
                this.player.currentDirection = 'up';
                this.player.keysPressed.add('w');
                this.player.isMoving = true;
            } else if (event.key == 'a') {
                this.player.velocity.x = -playerSpeed;
                this.player.setAnimation(9, 11, true, animationDelay);
                this.player.currentDirection = 'left';
                this.player.keysPressed.add('a');
                this.player.isMoving = true;
            } else if (event.key == 's') {
                this.player.velocity.y = playerSpeed;
                this.player.setAnimation(6, 8, true, animationDelay);
                this.player.currentDirection = 'down';
                this.player.keysPressed.add('s');
                this.player.isMoving = true;
            } else if (event.key == 'd') {
                this.player.velocity.x = playerSpeed;
                this.player.setAnimation(3, 5, true, animationDelay);
                this.player.currentDirection = 'right';
                this.player.keysPressed.add('d');
                this.player.isMoving = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'w') {
                this.player.keysPressed.delete('w');
                if (this.player.currentDirection === 'up' && this.player.keysPressed.size === 0) {
                    this.player.velocity.y = 0;
                    this.player.setAnimation(1, 1, false, animationDelay);
                    this.player.currentDirection = null;
                    this.player.isMoving = false;
                }
            } else if (event.key == 'a') {
                this.player.keysPressed.delete('a');
                if (this.player.currentDirection === 'left' && this.player.keysPressed.size === 0) {
                    this.player.velocity.x = 0;
                    this.player.setAnimation(10, 10, false, animationDelay);
                    this.player.currentDirection = null;
                    this.player.isMoving = false;
                }
            } else if (event.key == 's') {
                this.player.keysPressed.delete('s');
                if (this.player.currentDirection === 'down' && this.player.keysPressed.size === 0) {
                    this.player.velocity.y = 0;
                    this.player.setAnimation(7, 7, false, animationDelay);
                    this.player.currentDirection = null;
                    this.player.isMoving = false;
                }
            } else if (event.key == 'd') {
                this.player.keysPressed.delete('d');
                if (this.player.currentDirection === 'right' && this.player.keysPressed.size === 0) {
                    this.player.velocity.x = 0;
                    this.player.setAnimation(4, 4, false, animationDelay);
                    this.player.currentDirection = null;
                    this.player.isMoving = false;
                }
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
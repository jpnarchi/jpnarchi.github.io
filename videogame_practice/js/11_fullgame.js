/*
 * Coin Collection Game using Sprites and Animation
 *
 * Gilberto Echeverria
 * 2025-02-25
 */

"use strict";

// Game parameters
const canvasWidth = 800;
const canvasHeight = 600;
const coinSize = 32;
const numCoins = 10;
const playerSpeed = 0.3;
const animationDelay = 150;

// Context of the Canvas
let ctx;
// Variable to store the game object
let game;
// Variable to store the time at the previous frame
let oldTime;

// Class for collectible coins
class Coin extends AnimatedObject {
    constructor(position, size, sheetCols) {
        super(position, size, size, "gold", "coin", sheetCols);
        this.collected = false;
        this.rotationSpeed = 100 + Math.random() * 100;
    }

    update(deltaTime) {
        if (!this.collected) {
            this.updateFrame(deltaTime);
        }
    }
}

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
        }
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }

        // Update animation frame
        this.updateFrame(deltaTime);
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

// Game class that includes coin collection functionality
class CoinGame {
    constructor() {
        this.score = 0;
        this.scoreLabel = new TextLabel(20, 40, "24px Arial", "black");
        this.gameOver = false;
        this.allCoinsCollected = false;
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        // Initialize player
        this.player = new Player(new Vec(canvasWidth / 2, canvasHeight / 2), 60, 60, "red", 3);
        this.player.setSprite('../assets/sprites/blordrough_quartermaster-NESW.png', 
         new Rect(0, 0, 48, 64));
        this.player.setAnimation(7, 7, false, animationDelay);
        
        // Initialize coins
        this.actors = [];
        for (let i = 0; i < numCoins; i++) {
            let pos = new Vec(
                randomRange(canvasWidth - coinSize),
                randomRange(canvasHeight - coinSize)
            );
            let coin = new Coin(pos, coinSize, 8);
            coin.setSprite('../assets/sprites/coin_gold.png', new Rect(0, 0, 32, 32));
            coin.setAnimation(0, 7, true, 80);
            this.actors.push(coin);
        }
    }

    draw(ctx) {
        // Draw background
        ctx.fillStyle = "#87ceeb";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw all actors (coins)
        for (let actor of this.actors) {
            if (!actor.collected) {
                actor.draw(ctx);
            }
        }
        
        // Draw player
        this.player.draw(ctx);
        
        // Draw score
        this.scoreLabel.draw(ctx, `Coins: ${this.score}/${numCoins}`);
        
        // Draw game over message if all coins are collected
        if (this.allCoinsCollected) {
            ctx.font = "36px Arial";
            ctx.fillStyle = "green";
            ctx.textAlign = "center";
            ctx.fillText("All Coins Collected!", canvasWidth / 2, canvasHeight / 2);
            ctx.font = "24px Arial";
            ctx.fillText("Press 'R' to play again", canvasWidth / 2, canvasHeight / 2 + 40);
        }
    }

    update(deltaTime) {
        if (this.gameOver) return;
        
        // Update player
        this.player.update(deltaTime);
        
        // Update all actors and check for collisions
        for (let actor of this.actors) {
            actor.update(deltaTime);
            
            // Check collision with player
            if (!actor.collected && boxOverlap(this.player, actor)) {
                actor.collected = true;
                this.score++;
                
                // Check if all coins are collected
                if (this.score >= numCoins) {
                    this.allCoinsCollected = true;
                }
            }
        }
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (this.player.keysPressed.has(event.key)) return;
            
            switch(event.key) {
                case 'w':
                case 'ArrowUp':
                    this.player.velocity.y = -playerSpeed;
                    this.player.setAnimation(0, 2, true, animationDelay);
                    this.player.currentDirection = 'up';
                    this.player.keysPressed.add(event.key);
                    this.player.isMoving = true;
                    break;
                case 'a':
                case 'ArrowLeft':
                    this.player.velocity.x = -playerSpeed;
                    this.player.setAnimation(9, 11, true, animationDelay);
                    this.player.currentDirection = 'left';
                    this.player.keysPressed.add(event.key);
                    this.player.isMoving = true;
                    break;
                case 's':
                case 'ArrowDown':
                    this.player.velocity.y = playerSpeed;
                    this.player.setAnimation(6, 8, true, animationDelay);
                    this.player.currentDirection = 'down';
                    this.player.keysPressed.add(event.key);
                    this.player.isMoving = true;
                    break;
                case 'd':
                case 'ArrowRight':
                    this.player.velocity.x = playerSpeed;
                    this.player.setAnimation(3, 5, true, animationDelay);
                    this.player.currentDirection = 'right';
                    this.player.keysPressed.add(event.key);
                    this.player.isMoving = true;
                    break;
                case 'r':
                    if (this.allCoinsCollected) {
                        this.reset();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key;
            this.player.keysPressed.delete(key);
            
            switch(key) {
                case 'w':
                case 'ArrowUp':
                    if (this.player.currentDirection === 'up') {
                        this.player.velocity.y = 0;
                        this.player.setAnimation(1, 1, false, animationDelay);
                        this.player.currentDirection = null;
                        this.player.isMoving = false;
                    }
                    break;
                case 'a':
                case 'ArrowLeft':
                    if (this.player.currentDirection === 'left') {
                        this.player.velocity.x = 0;
                        this.player.setAnimation(10, 10, false, animationDelay);
                        this.player.currentDirection = null;
                        this.player.isMoving = false;
                    }
                    break;
                case 's':
                case 'ArrowDown':
                    if (this.player.currentDirection === 'down') {
                        this.player.velocity.y = 0;
                        this.player.setAnimation(7, 7, false, animationDelay);
                        this.player.currentDirection = null;
                        this.player.isMoving = false;
                    }
                    break;
                case 'd':
                case 'ArrowRight':
                    if (this.player.currentDirection === 'right') {
                        this.player.velocity.x = 0;
                        this.player.setAnimation(4, 4, false, animationDelay);
                        this.player.currentDirection = null;
                        this.player.isMoving = false;
                    }
                    break;
            }
        });
    }
    
    reset() {
        this.score = 0;
        this.allCoinsCollected = false;
        this.gameOver = false;
        this.initObjects();
    }
}

// Starting function that will be called from the HTML page
function main() {
    const canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    game = new CoinGame();
    drawScene(0);
}

// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}

// Start the game when the page loads
window.onload = main; 
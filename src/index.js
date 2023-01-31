import './styles.css'

// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app'
import { Sprite } from '@pixi/sprite'
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics'


let primaryColor = hslToHex(160, 80, 90);
let secondaryColor = hslToHex(250, 80, 40);
let accentColor = hslToHex(160, 0, 45);

let maxLives = 3;
let currentLives = maxLives - 1;

// App with width and height of the page
const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio, // For good rendering on mobiles
    background: primaryColor
})
document.body.appendChild(app.view) // Create Canvas tag in the body

// Create the sprite and add it to the stage
let sprite = Sprite.from('assets/logo.svg');
sprite.resolution = 600;
sprite.scale.set(0.6, 0.6);
sprite.x = 10;
sprite.y = 10;
app.stage.addChild(sprite);

// Add a ticker callback to move the sprite back and forth
/*
let elapsed = 0.0;
app.ticker.add((delta) => {
elapsed += delta;
sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
});
*/

// Create the sprite and add it to the stage
let ball = Sprite.from('assets/White_pog.svg');
ball.radius = 12;
ball.width = 2 * ball.radius;
ball.height = 2 * ball.radius;
ball.x = window.innerWidth / window.devicePixelRatio / 2 - ball.radius;
ball.y = window.innerHeight / window.devicePixelRatio - 5 * ball.radius;
ball.speed = 2.5;
ball.direction = 25;
app.stage.addChild(ball);
app.ticker.add((delta) => {
    ball.x += ball.speed * Math.sin(Math.PI * (180 - ball.direction) / 180);
    ball.y += ball.speed * Math.cos(Math.PI * (180 - ball.direction) / 180);
    if (ball.x <= 0) { ball.direction = 360 - ball.direction; }
    if (ball.x + ball.width >= window.innerWidth / window.devicePixelRatio) { ball.direction = 360 - ball.direction; }
    if (ball.y <= 0) { ball.direction = 180 - ball.direction; }
    if (ball.y + ball.height >= window.innerHeight / window.devicePixelRatio) { ball.direction = 180 - ball.direction; }

    let hit = false
    bricks.map((rows) => {
        rows.map((brick) => {
            if (!hit){
                hit = testCollision(ball, brick, bricks.length)
            }
        })
    })
});

let bricks = addBricks(4, 7);
let lives = addLives(maxLives);
updateTintLives();

function addBricks(rowCount, columnCount) {
    let graphics = new Graphics();
    graphics.lineStyle(2, parseInt(accentColor.substring(1), 16), 1);
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(200, 50, window.innerWidth / window.devicePixelRatio / columnCount - 4, 20);
    graphics.endFill();

    let texture = app.renderer.generateTexture(graphics);


    let bricks = new Array(rowCount);
    for (let rowIdx = 0; rowIdx < bricks.length; rowIdx++) {
        bricks[rowIdx] = new Array(columnCount);
        for (let colIdx = 0; colIdx < bricks[rowIdx].length; colIdx++) {
            let sp = new Sprite(texture);
             
            sp.x = columnCount / 2 + colIdx * (graphics.width + 1);
            sp.y = 60 + rowIdx * (graphics.height + 2);
            sp.density = rowCount - rowIdx;
            updateTintByDensity(sp, rowCount);
            
            bricks[rowIdx][colIdx] = sp;
            app.stage.addChild(sp);
        }
    }
    return bricks;
}


function addLives(count){
    let texture = Texture.from('assets/favorite_FILL1_wght400_GRAD0_opsz48.svg');
    

    let lives = new Array(count);
    for (let livesIdx = 0; livesIdx < lives.length; livesIdx++) {
        let sp = new Sprite(texture);
        sp.width = 15;
        sp.height = 15;
        sp.x = window.innerWidth / window.devicePixelRatio - 30 - livesIdx * 20
        sp.y = 10;
        sp.tint = hslToHexNumeric(0, 90, 50);

        lives[livesIdx] = sp;
        app.stage.addChild(sp);
    }

    return lives;
}

function hslToHexNumeric(h, s, l){
    return parseInt(hslToHex(h, s, l).substring(1), 16)
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }




function testCollision(ball, brick, rowCount){
    if (brick.density <= 0) return;

    const centerDistanceX = Math.abs(ball.x + ball.width / 2 - (brick.x + brick.width / 2));
    const centerDistanceY = Math.abs(ball.y + ball.height / 2 - (brick.y + brick.height / 2));
  
    if (centerDistanceX > ((brick.width + ball.width) / 2)) { return false; }
    if (centerDistanceY > ((brick.height + ball.height) / 2)) { return false; }

    if (centerDistanceX <= brick.width) { // hit from top/bottom
        ball.direction = 180 - ball.direction;
        reduceBrickDensity(brick, rowCount);
        return true;
    }
    if (centerDistanceY <= brick.height) { // hit from side
        ball.direction = 360 - ball.direction;
        reduceBrickDensity(brick, rowCount);
        return true;
    }

    const cornerDistance_sq = Math.pow(centerDistanceX - brick.width/2, 2) + Math.pow(centerDistanceY - brick.height/2, 2) 
    if (cornerDistance_sq <= Math.pow(ball.width / 2, 2)){ // hit the corner
        ball.direction = 360 - ball.direction;
        reduceBrickDensity(brick, rowCount);
        return true;
    }

    return false;
}


function updateTintLives(){
    for (let livesIdx = 0; livesIdx < lives.length; livesIdx++) {
        let heart = lives[livesIdx];


        console.log('updateTintLives', livesIdx, currentLives)
        if (livesIdx < currentLives) {
            heart.tint = hslToHexNumeric(0, 90, 50);
        } else {
            heart.tint = parseInt(primaryColor.substring(1), 16);
        }
    }
}

function updateTintByDensity(brick, rowCount){
    brick.tint = hslToHexNumeric(250, 50, 90 - brick.density * (60 / rowCount));
}

function reduceBrickDensity(brick, rowCount){
    --brick.density;
    if (brick.density > 0){
        updateTintByDensity(brick, rowCount);
    } else {
        brick.alpha = 0;
    }
}

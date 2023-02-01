import './styles.css'

// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app'
import { Sprite } from '@pixi/sprite'
import { Texture } from '@pixi/core';
import { Graphics } from '@pixi/graphics'


let primaryColor = hslToHex(160, 80, 90);
let secondaryColor = hslToHex(250, 80, 40);
let accentColor = hslToHex(160, 0, 45);
let accentColor2 = hslToHex(160, 0, 60);

let maxLives = 3;
let currentLives = maxLives - 1;

let zoomFactor =  window.innerHeight / window.devicePixelRatio / 600;
console.log('zoom: ', zoomFactor)

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
sprite.scale.set(0.6 * zoomFactor, 0.6 * zoomFactor);
sprite.x = 10 * zoomFactor;
sprite.y = 10 * zoomFactor;
app.stage.addChild(sprite);

// Create the sprite and add it to the stage
let ball = Sprite.from('assets/White_pog.svg');
ball.radius = 12 * zoomFactor;
ball.width = 2 * ball.radius;
ball.height = 2 * ball.radius;
ball.x = window.innerWidth / window.devicePixelRatio / 2 - ball.radius;
ball.y = window.innerHeight / window.devicePixelRatio - 5 * ball.radius;
ball.speed = 6 * zoomFactor;
ball.direction = 25;
app.stage.addChild(ball);
app.ticker.add((delta) => {
    ball.x += delta * ball.speed * Math.sin(Math.PI * (180 - ball.direction) / 180);
    ball.y += delta * ball.speed * Math.cos(Math.PI * (180 - ball.direction) / 180);
    if (ball.x <= 0) { ball.direction = 360 - ball.direction; }
    if (ball.x + ball.width >= window.innerWidth / window.devicePixelRatio) { ball.direction = 360 - ball.direction; }
    if (ball.y <= 0) { ball.direction = 180 - ball.direction; }
    if (ball.y + ball.height >= window.innerHeight / window.devicePixelRatio) { ball.direction = 180 - ball.direction; }

    let hit = testPadCollision(ball, playerPad)
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
let playerPad = addPlayerPad();
window.addEventListener('keydown', handleKeyboardEvent);
window.addEventListener('keyup', handleKeyboardEvent);

function addBricks(rowCount, columnCount) {
    let graphics = new Graphics();
    graphics.lineStyle(2, parseInt(accentColor.substring(1), 16), 1);
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(200, 50, window.innerWidth / window.devicePixelRatio / columnCount - 4, 20 * zoomFactor);
    graphics.endFill();

    let texture = app.renderer.generateTexture(graphics);


    let bricks = new Array(rowCount);
    for (let rowIdx = 0; rowIdx < bricks.length; rowIdx++) {
        bricks[rowIdx] = new Array(columnCount);
        for (let colIdx = 0; colIdx < bricks[rowIdx].length; colIdx++) {
            let sp = new Sprite(texture);
             
            sp.x = columnCount / 2 + colIdx * (graphics.width + 1);
            sp.y = 60 * zoomFactor + rowIdx * (graphics.height + 2);
            sp.density = 1; // rowCount - rowIdx;
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
        sp.width = 15 * zoomFactor;
        sp.height = 15 * zoomFactor;
        sp.x = window.innerWidth / window.devicePixelRatio - 30 * zoomFactor - livesIdx * 20 * zoomFactor;
        sp.y = 10 * zoomFactor;
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

function testPadCollision(ball, pad){
    const centerDistanceX = Math.abs(ball.x + ball.width / 2 - (pad.x + pad.width / 2));
    const centerDistanceY = Math.abs(ball.y + ball.height / 2 - (pad.y + pad.height / 2));
  
    if (centerDistanceX > ((pad.width + ball.width) / 2)) { return false; }
    if (centerDistanceY > ((pad.height + ball.height) / 2)) { return false; }

    if (centerDistanceX <= pad.width) { // hit from top/bottom
        ball.direction = 180 - ball.direction;
        return true;
    }
    if (centerDistanceY <= pad.height) { // hit from side
        ball.direction = 360 - ball.direction;
        return true;
    }

    const cornerDistance_sq = Math.pow(centerDistanceX - pad.width/2, 2) + Math.pow(centerDistanceY - pad.height/2, 2) 
    if (cornerDistance_sq <= Math.pow(ball.width / 2, 2)){ // hit the corner
        ball.direction = 180 - ball.direction;
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


function addPlayerPad(){
    let graphics = new Graphics();
    graphics.lineStyle(2, parseInt(accentColor.substring(1), 16), 1);
    graphics.beginFill(parseInt(accentColor2.substring(1), 16));
    graphics.drawRect(0, 0, window.innerWidth / window.devicePixelRatio / 8, 20 * zoomFactor);
    graphics.endFill();

    let texture = app.renderer.generateTexture(graphics);
    let sp = new Sprite(texture);
             
    sp.x = (window.innerWidth / window.devicePixelRatio - graphics.width) / 2;
    sp.y = window.innerHeight / window.devicePixelRatio - 25 * zoomFactor;
    sp.speed = 0;

    app.stage.addChild(sp);
    app.ticker.add((delta) => {        
        sp.x = Math.min(
            window.innerWidth / window.devicePixelRatio - sp.width, 
            Math.max(
                0, 
                sp.x + delta * sp.speed)
        );   
    });

    return sp;
}

function handleKeyboardEvent(e){    
    if (e.type === 'keydown' && e.key === 'ArrowLeft'){        
        playerPad.speed = -10;
    } else if (e.type === 'keyup' && e.key === 'ArrowLeft'){
        playerPad.speed = 0;
    } else if (e.type === 'keydown' && e.key === 'ArrowRight'){
        playerPad.speed = 10;
    } else if (e.type === 'keyup' && e.key === 'ArrowRight'){
        playerPad.speed = 0;
    } else {
        // ignore
    }
}
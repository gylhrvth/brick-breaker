import './styles.css'

// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app'
import { Sprite } from '@pixi/sprite'
import { Texture } from '@pixi/core';

import { addBricks, testBrickCollision } from './brick';
import { addBall } from './ball';
import { addPlayerPad } from './playerpad';
import { hslToHex, hslToHexNumeric, hslTextToHexNumeric } from './tools';


let state = {};
state.primaryColor = hslToHex(203, 100, 20);
state.secondaryColor = hslToHex(9, 79, 54);
state.secondaryShadowColor = hslToHex(9, 79, 45);
state.accentColor = hslToHex(171, 64, 65);
state.accentColor2 = hslToHex(171, 64, 56);

state.maxLives = 3;
state.currentLives = state.maxLives - 1;


state.zoomFactor =  window.innerHeight / window.devicePixelRatio / 600;
console.log('zoom: ', state.zoomFactor)

// App with width and height of the page
state.app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio, // For good rendering on mobiles
    background: state.primaryColor
})
document.body.appendChild(state.app.view) // Create Canvas tag in the body

   

// Create the sprite and add it to the stage
let sprite = Sprite.from('assets/logo.svg');
sprite.resolution = 600;
sprite.scale.set(0.6 * state.zoomFactor, 0.6 * state.zoomFactor);
sprite.x = 10 * state.zoomFactor;
sprite.y = 10 * state.zoomFactor;
state.app.stage.addChild(sprite);


state.bricks = addBricks(state, 4, 7);
state.lives = addLives(state.maxLives);
updateTintLives();
state.playerPad = addPlayerPad(state);
state.ball = addBall(state);
window.addEventListener('keydown', handleKeyboardEvent);
window.addEventListener('keyup', handleKeyboardEvent);



function addLives(count){
    let texture = Texture.from('assets/favorite_FILL1_wght400_GRAD0_opsz48.svg');
    let lives = new Array(count);
    for (let livesIdx = 0; livesIdx < lives.length; livesIdx++) {
        let sp = new Sprite(texture);
        sp.width = 15 * state.zoomFactor;
        sp.height = 15 * state.zoomFactor;
        sp.x = window.innerWidth / window.devicePixelRatio - 30 * state.zoomFactor - livesIdx * 20 * state.zoomFactor;
        sp.y = 10 * state.zoomFactor;
        sp.tint = hslToHexNumeric(0, 90, 50);

        lives[livesIdx] = sp;
        state.app.stage.addChild(sp);
    }

    return lives;
}


function updateTintLives(){
    for (let livesIdx = 0; livesIdx < state.lives.length; livesIdx++) {
        let heart = state.lives[livesIdx];

        if (livesIdx < state.currentLives) {
            heart.tint = hslTextToHexNumeric(state.secondaryColor);
        } else {
            heart.tint = hslTextToHexNumeric(state.primaryColor);
        }
    }
}




function handleKeyboardEvent(e){    
    if (e.type === 'keydown' && e.key === 'ArrowLeft'){        
        state.playerPad.speed = -10 * state.zoomFactor;
    } else if (e.type === 'keyup' && e.key === 'ArrowLeft'){
        state.playerPad.speed = 0;
    } else if (e.type === 'keydown' && e.key === 'ArrowRight'){
        state.playerPad.speed = 10 * state.zoomFactor;
    } else if (e.type === 'keyup' && e.key === 'ArrowRight'){
        state.playerPad.speed = 0;
    } else {
        // ignore
    }
}
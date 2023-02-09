import './styles.css'

// Import Application class that is the main part of our PIXI project
import { Application } from '@pixi/app'
import { Sprite } from '@pixi/sprite'
import { Texture } from '@pixi/core';
import { Text, TextStyle } from '@pixi/text';

import { addBricks, testBrickCollision } from './brick';
import { addBall } from './ball';
import { addPlayerPad } from './playerpad';
import { hslToHex, hslToHexNumeric, hslTextToHexNumeric } from './tools';


let state = {};
state.keyboard = {};
state.time = {};
state.primaryColor = hslToHex(203, 100, 20);
state.secondaryColor = hslToHex(9, 79, 54);
state.secondaryShadowColor = hslToHex(9, 79, 45);
state.accentColor = hslToHex(171, 64, 65);
state.accentColor2 = hslToHex(171, 64, 56);

state.maxLives = 4;
state.currentLives = 1;
state.readyToWin = false;
state.progress = 'press any key to start';

state.zoomFactor =  window.innerHeight / window.devicePixelRatio / 600;

initApplication();


function initApplication() {
// App with width and height of the page
    state.app = new Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio, // For good rendering on mobiles
        background: state.primaryColor
    })
    document.body.appendChild(state.app.view) // Create Canvas tag in the body

    

    // Create the sprite and add it to the stage
    let sprite = Sprite.from('assets/DCV_Logo_tuerkis_neg_WEB.svg');
    sprite.resolution = 600;
    sprite.scale.set(0.4 * state.zoomFactor, 0.4 * state.zoomFactor);
    sprite.x = 10 * state.zoomFactor;
    sprite.y = 10 * state.zoomFactor;
    state.app.stage.addChild(sprite);


    state.bricks = addBricks(state, state.maxLives, 7);
    state.lives = addLives(state.maxLives);
    updateTintLives();
    state.playerPad = addPlayerPad(state);
    state.ball = addBall(state);


    let textField = new Text('', {
        fontFamily: 'Allegra',
        fontSize: 64 * state.zoomFactor,
        fill: hslTextToHexNumeric(state.accentColor),
        align: 'center',
        dropShadow: 1,
        dropShadowColor: 0xFFFFFF,
        dropShadowDistance: 2 * state.zoomFactor,
    });
    state.textField = textField;
    state.app.stage.addChild(textField);

    state.textFieldSecondary = new Text('', {
        fontFamily: 'Allegra',
        fontSize: 64 * state.zoomFactor,
        fill: hslTextToHexNumeric(state.accentColor),
        align: 'center',
    });
    state.app.stage.addChild(state.textFieldSecondary);
    addTextMessage('Press any key to start!');
 
    window.addEventListener('keydown', handleKeyboardEvent);
    window.addEventListener('keyup', handleKeyboardEvent);
}

    
export function addTextMessage(message, tf = state.textField, size = 64, posCenterY = window.innerHeight / window.devicePixelRatio / 2){
    tf.text = message;
    tf.style.fontSize = size * state.zoomFactor;

    tf.x = window.innerWidth / window.devicePixelRatio / 2 - tf.width / 2;
    tf.y = posCenterY - tf.height / 2;
    // Reduce font size if necessary
    if (tf.width > 0.9 * window.innerWidth / window.devicePixelRatio){
        tf.style.fontSize = tf.style.fontSize *
            (0.9 * window.innerWidth / window.devicePixelRatio / tf.width);
        tf.x = window.innerWidth / window.devicePixelRatio / 2 - tf.width / 2;
        tf.y = window.innerHeight / window.devicePixelRatio / 2 - tf.height / 2;
    }

}


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


export function updateTintLives(){
    for (let livesIdx = 0; livesIdx < state.lives.length; livesIdx++) {
        let heart = state.lives[livesIdx];

        if (livesIdx < state.currentLives) {
            heart.tint = hslTextToHexNumeric(state.secondaryColor);
        } else {
            heart.tint = hslTextToHexNumeric(state.primaryColor);
        }
    }
}



function startCountDown(){
    let counter = 3;
    state.progress = 'countdown'
    addTextMessage(counter);
    --counter; 
    let intervall = setInterval(
        () => {
            if (counter > 0){
                addTextMessage(counter)
            } else if (counter == 0){
                addTextMessage('GO !')
            } else {
                state.progress = 'in game'
                addTextMessage('');
                state.time.start = Date.now();
                clearInterval(intervall);
            }
            --counter;
        }, 650
    );
}




function handleKeyboardEvent(e){
    if (state.progress === 'in game'){
        if (e.type === 'keydown' && e.key === 'ArrowLeft'){
            state.keyboard.left = true;
            state.playerPad.speed = -10 * state.zoomFactor;
        } else if (e.type === 'keyup' && e.key === 'ArrowLeft'){
            state.keyboard.left = false;
            state.playerPad.speed = state.keyboard.right? 10 * state.zoomFactor : 0;
        } else if (e.type === 'keydown' && e.key === 'ArrowRight'){
            state.keyboard.right = true;
            state.playerPad.speed = 10 * state.zoomFactor;
        } else if (e.type === 'keyup' && e.key === 'ArrowRight'){
            state.keyboard.right = false;
            state.playerPad.speed = state.keyboard.left? -10 * state.zoomFactor : 0;
        } else {
            // ignore
        }    
    } else if (state.progress === 'press any key to start') {
        if (e.type === 'keyup'){
            startCountDown();    
        }
    } else if (state.progress === 'recover') {
        if (e.type === 'keyup'){
            state.progress = 'ball recovery'
            state.keyboard.left = false;
            state.keyboard.right = false;
            addTextMessage('');
        }
    } else if (state.progress === 'win') {
        if (e.type === 'keydown'){
            state.readyToWin = true;
        } else if (e.type === 'keyup' && state.readyToWin){
            window.location = 'https://site.digitalcampusvorarlberg.at/esports-cup'
        }
    }
}
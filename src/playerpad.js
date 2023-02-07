import { defaultFilterVertex } from "@pixi/core";
import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";

import { getRandomInt, normalizeDirection } from "./tools";

export function addPlayerPad(state){
    let graphics = new Graphics();
    graphics.lineStyle(2, parseInt(state.accentColor.substring(1), 16), 1);
    graphics.beginFill(parseInt(state.accentColor2.substring(1), 16));
    graphics.drawRect(0, 0, window.innerWidth / window.devicePixelRatio / 8, 20 * state.zoomFactor);
    graphics.endFill();

    let texture = state.app.renderer.generateTexture(graphics);
    let sp = new Sprite(texture);
             
    sp.x = (window.innerWidth / window.devicePixelRatio - graphics.width) / 2;
    sp.y = window.innerHeight / window.devicePixelRatio - 25 * state.zoomFactor;
    sp.speed = 0;

    state.app.stage.addChild(sp);
    state.app.ticker.add((delta) => {        
        sp.x = Math.min(
            window.innerWidth / window.devicePixelRatio - sp.width, 
            Math.max(
                0, 
                sp.x + delta * sp.speed)
        );   
    });

    return sp;
}

export function resetPadPosition(state) {
    state.playerPad.x = (window.innerWidth / window.devicePixelRatio - state.playerPad.width) / 2;
    state.playerPad.y = window.innerHeight / window.devicePixelRatio - 25 * state.zoomFactor;
    state.playerPad.speed = 0;
}


export function testPadCollision(ball, pad){
    let ballCenter = {
        x: ball.x + ball.width / 2,
        y: ball.y + ball.height / 2
    }

    let testX = ballCenter.x;
    let testY = ballCenter.y;

    if (ballCenter.x < pad.x) { testX = pad.x; }
    else if (ballCenter.x > pad.x + pad.width) { testX = pad.x + pad.width; }
    if (ballCenter.y < pad.y) { testY = pad.y; }
    else if (ballCenter.y > pad.y + pad.height) { testY = pad.y + pad.height; }

    let distX = ballCenter.x - testX;
    let distY = ballCenter.y - testY;

    if (distX * distX + distY * distY <= ball.radius * ball.radius){
        console.log('hit', ball.x, ball.y)
        if (testX == ballCenter.x) {
            ball.y = (ballCenter.y < pad.y) ? pad.y - ball.height : pad.y + pad.height; 
            ball.direction = normalizeDirection(180 - ball.direction);    
        } else if (testY == ballCenter.y) {
            ball.x = (ballCenter.x < pad.x ) ? pad.x - ball.width : pad.x + pad.width;
            ball.direction = normalizeDirection(360 - ball.direction);
        } else {
            ball.direction = normalizeDirection(180 + ball.direction);
            ball.x = testX + ball.radius * Math.sin(Math.PI * (180 - ball.direction) / 180);
            ball.y = testY + ball.radius * Math.cos(Math.PI * (180 - ball.direction) / 180)

        }
        return true;
    }
    return false;
}


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


export function testPadCollision(ball, pad){
    let testX = ball.x;
    let testY = ball.y;

    if (ball.x < pad.x) { testX = pad.x; }
    else if (ball.x > pad.x + pad.width) { testX = pad.x + pad.width; }
    if (ball.y < pad.y) { testY = pad.y; }
    else if (ball.y > pad.y + pad.height) { testY = pad.y + pad.height; }

    let distX = ball.x - testX;
    let distY = ball.y - testY;

    if (distX * distX + distY * distY <= ball.width * ball.width){
        if (testX == ball.x) {
            ball.y = (ball.y < pad.y) ? pad.y - ball.height : pad.y + pad.height; 
            ball.direction = normalizeDirection(180 - ball.direction);    
        } else if (testY == ball.y) {
            ball.x = (ball.x < pad.x ) ? pad.x - ball.width : pad.x + pad.width;
            ball.direction = normalizeDirection(360 - ball.direction);
        } else {
            ball.y = (ball.y < pad.y) ? pad.y - ball.height : pad.y + pad.height; 
            ball.x = (ball.x < pad.x ) ? pad.x - ball.width : pad.x + pad.width;
            ball.direction = normalizeDirection(180 + ball.direction);
        }
        return true;
    }
    return false;
}


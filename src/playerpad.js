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
    const centerDistanceX = Math.abs(ball.x + ball.width / 2 - (pad.x + pad.width / 2));
    const centerDistanceY = Math.abs(ball.y + ball.height / 2 - (pad.y + pad.height / 2));
  
    if (centerDistanceX > ((pad.width + ball.width) / 2)) { return false; }
    if (centerDistanceY > ((pad.height + ball.height) / 2)) { return false; }
    
    if (centerDistanceX <= pad.width) { // hit from top/bottom
        if ((ball.direction > 90) && (ball.direction < 270)){
            ball.direction = normalizeDirection(180 - ball.direction);
        }
        return true;
    }
    if (centerDistanceY <= pad.height) { // hit from side
        if ((ball.direction > 90) && (ball.direction < 270)){
            ball.direction = normalizeDirection(360 - ball.direction);
        }
        return true;
    }

    const cornerDistance_sq = Math.pow(centerDistanceX - pad.width/2, 2) + Math.pow(centerDistanceY - pad.height/2, 2) 
    if (cornerDistance_sq <= Math.pow(ball.width / 2, 2)){ // hit the corner
        if ((ball.direction > 90) && (ball.direction < 270)){
            ball.direction = normalizeDirection(180 - ball.direction);
        }
        return true;
    }

    return false;
}


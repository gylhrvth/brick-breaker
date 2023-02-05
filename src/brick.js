import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";

import { hslTextToHexNumeric, normalizeDirection } from "./tools";

export function addBricks(state, rowCount, columnCount) {
    let graphics = new Graphics();
    graphics.lineStyle(1 * state.zoomFactor, hslTextToHexNumeric(state.secondaryShadowColor));
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(200, 50, window.innerWidth / window.devicePixelRatio / columnCount - 7, 20 * state.zoomFactor);
    graphics.endFill();

    let texture = state.app.renderer.generateTexture(graphics);    

    let bricks = new Array(rowCount);
    for (let rowIdx = 0; rowIdx < bricks.length; rowIdx++) {
        bricks[rowIdx] = new Array(columnCount);
        for (let colIdx = 0; colIdx < bricks[rowIdx].length; colIdx++) {
            let sp = new Sprite(texture);
                         
            sp.x = columnCount / 2 + colIdx * (graphics.width + 4);
            sp.y = 80 * state.zoomFactor + rowIdx * (graphics.height + 2);
            sp.density = 1; // rowCount - rowIdx;
            sp.tint = hslTextToHexNumeric(state.secondaryColor);
           
            bricks[rowIdx][colIdx] = sp;
            state.app.stage.addChild(sp);
        }
    }
    return bricks;
}

function addLeadingZeros(n, digits) {
    return '0'.repeat(digits - n.toString().length).concat(n.toString());
}

function getFormatedTimeStamp(ball, brick){
    let time = new Date();
    return addLeadingZeros(time.getHours(), 2) + ':' +
        addLeadingZeros(time.getMinutes(), 2) + ':' +
        addLeadingZeros(time.getSeconds(), 2) + ' ' +
        addLeadingZeros(time.getMilliseconds() , 3) +
        ' ball: ' + (ball.x + ball.width / 2).toFixed(1) + ':' + (ball.y + ball.height / 2).toFixed(1) + " /" + (ball.width/2).toFixed(1) +
        ' brick: ' + brick.x.toFixed(1) + ':' + brick.y.toFixed(1) + ':' + brick.width.toFixed(1) + ':' + brick.height.toFixed(1); 
 }

export function testBrickCollision(state, ball, brick){
    if (brick.density <= 0) return;

    const centerDistanceX = Math.abs(ball.x + ball.width / 2 - (brick.x + brick.width / 2));
    const centerDistanceY = Math.abs(ball.y + ball.height / 2 - (brick.y + brick.height / 2));
  
    if (centerDistanceX > ((brick.width + ball.width) / 2)) { return false; }
    if (centerDistanceY > ((brick.height + ball.height) / 2)) { return false; }

    if (centerDistanceX <= brick.width) { // hit from top/bottom
        console.log('hit bottom', getFormatedTimeStamp(ball, brick)); 
        ball.direction = normalizeDirection(180 - ball.direction);
        reduceBrickDensity(state, brick);
        return true;
    }
    if (centerDistanceY <= brick.height) { // hit from side
        console.log('hit   side', getFormatedTimeStamp(ball, brick)); 
        ball.direction = normalizeDirection(360 - ball.direction);
        reduceBrickDensity(state, brick);
        return true;
    }

    const cornerDistance_sq = Math.pow(centerDistanceX - brick.width/2, 2) + Math.pow(centerDistanceY - brick.height/2, 2) 
    if (cornerDistance_sq <= Math.pow(ball.width / 2, 2)){ // hit the corner
        console.log('hit corner', getFormatedTimeStamp(ball, brick )); 
        ball.direction = normalizeDirection(360 - ball.direction);
        reduceBrickDensity(state, brick);
        return true;
    }

    return false;
}


function reduceBrickDensity(state, brick){
    --brick.density;
    if (brick.density > 0){
        // do nothing
    } else {
        brick.alpha = 0;
    }
}

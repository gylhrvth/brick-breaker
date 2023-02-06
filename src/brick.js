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
/*
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
*/
export function testBrickCollision(state, ball, brick){
    if (brick.density <= 0) return;

    let testX = ball.x;
    let testY = ball.y;

    if (ball.x < brick.x) { testX = brick.x; }
    else if (ball.x > brick.x + brick.width) { testX = brick.x + brick.width; }
    if (ball.y < brick.y) { testY = brick.y; }
    else if (ball.y > brick.y + brick.height) { testY = brick.y + brick.height; }

    let distX = ball.x - testX;
    let distY = ball.y - testY;

    if (distX * distX + distY * distY <= ball.width * ball.width){
        if (testX == ball.x) {
            ball.y = (ball.y < brick.y) ? brick.y - ball.height : brick.y + brick.height; 
            ball.direction = normalizeDirection(180 - ball.direction);
            reduceBrickDensity(state, brick);   
        } else if (testY == ball.y) {
            ball.x = (ball.x < brick.x ) ? brick.x - ball.width : brick.x + brick.width;
            ball.direction = normalizeDirection(360 - ball.direction);
            reduceBrickDensity(state, brick);
        } else {
            ball.y = (ball.y < brick.y) ? brick.y - ball.height : brick.y + brick.height; 
            ball.x = (ball.x < brick.x ) ? brick.x - ball.width : brick.x + brick.width;
            ball.direction = normalizeDirection(180 + ball.direction);
            reduceBrickDensity(state, brick);
        }
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

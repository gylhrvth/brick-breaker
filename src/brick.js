import { Graphics } from "@pixi/graphics";
import { Sprite } from "@pixi/sprite";

import { hslTextToHexNumeric, normalizeDirection } from "./tools";
import { updateTintLives, addTextMessage} from "./index";

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

    let ballCenter = {
        x: ball.x + ball.width / 2,
        y: ball.y + ball.height / 2
    }

    let testX = ballCenter.x;
    let testY = ballCenter.y;

    if (ballCenter.x < brick.x) { testX = brick.x; }
    else if (ballCenter.x > brick.x + brick.width) { testX = brick.x + brick.width; }
    if (ballCenter.y < brick.y) { testY = brick.y; }
    else if (ballCenter.y > brick.y + brick.height) { testY = brick.y + brick.height; }

    let distX = ballCenter.x - testX;
    let distY = ballCenter.y - testY;

    if (distX * distX + distY * distY <= ball.radius * ball.radius){
        if (testX == ballCenter.x) {
            ball.y = (ballCenter.y < brick.y) ? brick.y - ball.height : brick.y + brick.height; 
            ball.direction = normalizeDirection(180 - ball.direction);
            reduceBrickDensity(state, brick);   
        } else if (testY == ballCenter.y) {
            ball.x = (ballCenter.x < brick.x ) ? brick.x - ball.width : brick.x + brick.width;
            ball.direction = normalizeDirection(360 - ball.direction);
            reduceBrickDensity(state, brick);
        } else {
            ball.direction = normalizeDirection(180 + ball.direction);
            ball.x = testX + ball.radius * Math.sin(Math.PI * (180 - ball.direction) / 180);
            ball.y = testY + ball.radius * Math.cos(Math.PI * (180 - ball.direction) / 180)
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

    let countClearedLines = 0;
    for (const rows of state.bricks) {
        let remainingBricks = rows.reduce(
            (count, br) => {
                if (br.density > 0) { return count + 1;}
                else { return count;}
            }, 
            0
        );
        if (remainingBricks == 0) { 
            ++countClearedLines;
        }
    }
    if (countClearedLines < state.maxLives){
        state.currentLives = 1 + countClearedLines;
        updateTintLives()
    } else {
        // the table has been cleared...
        state.progress = "win";
        state.time.finish = Date.now();
        addTextMessage("Congratulation!\nPress any key to gather your gift");
        addTextMessage(
            "You've cleaned the field in " + (state.time.finish - state.time.start) / 1000 + " secnonds.",
            state.textFieldSecondary, 
            24, 
            window.innerHeight / window.devicePixelRatio - 48 * state.zoomFactor
        );
    }
}

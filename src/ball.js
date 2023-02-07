import { Sprite } from "@pixi/sprite";

import { getRandomPlusMinus, getRandomInt, normalizeDirection} from "./tools";
import { testBrickCollision } from "./brick";
import { resetPadPosition, testPadCollision } from "./playerpad";

export function addBall(state){
    // Create the sprite and add it to the stage
    let sp = Sprite.from('assets/White_pog.svg');
    sp.radius = 12 * state.zoomFactor;
    sp.width = 2 * sp.radius;
    sp.height = 2 * sp.radius;
    sp.x = window.innerWidth / window.devicePixelRatio / 2 - sp.radius;
    sp.y = window.innerHeight / window.devicePixelRatio - 5 * sp.radius;
    sp.defaultSpeed = 6 * state.zoomFactor;
    sp.speed = sp.defaultSpeed;
    sp.direction = getRandomPlusMinus() * (20 + getRandomInt(15));
    state.app.stage.addChild(sp);
    state.app.ticker.add((delta) => {
        if (state.progress === 'in game'){
            sp.x += delta * sp.speed * Math.sin(Math.PI * (180 - sp.direction) / 180);
            sp.y += delta * sp.speed * Math.cos(Math.PI * (180 - sp.direction) / 180);
            if (sp.speed > sp.defaultSpeed) {
                sp.speed = Math.max(sp.defaultSpeed, 0.95 * sp.speed);
            }
            if (sp.x <= 0) { 
                sp.x = 0;
                sp.direction = normalizeDirection(360 - sp.direction);
            }
            if (sp.x + sp.width >= window.innerWidth / window.devicePixelRatio) {
                sp.x = window.innerWidth / window.devicePixelRatio - sp.width;
                sp.direction = normalizeDirection(360 - sp.direction); 
            }
            if (sp.y <= 0) { 
                sp.y = 0;
                sp.direction = normalizeDirection(180 - sp.direction); 
            }
            if (sp.y + sp.height >= window.innerHeight / window.devicePixelRatio) {
                state.progress = 'recover';
                //sp.direction = normalizeDirection(180 - sp.direction); 
            }
    
            let hit = testPadCollision(sp, state.playerPad)
            state.bricks.map((rows) => {
                rows.map((brick) => {
                    if (!hit){
                        hit = testBrickCollision(state, sp, brick)
                    }
                })
            })    
        } else if (state.progress === 'ball recovery') {
            sp.x = window.innerWidth / window.devicePixelRatio / 2 - sp.radius;
            sp.y = window.innerHeight / window.devicePixelRatio - 25 * sp.radius;
            sp.direction = getRandomPlusMinus() * (20 + getRandomInt(15));
            resetPadPosition(state);
            state.progress = 'in game';
        } else if (state.progress == 'win') {
            sp.alpha = 0;
        }
    });
    return sp;
}
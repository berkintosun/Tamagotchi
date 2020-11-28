import gameState from "./gameState";
import {TICK_RATE} from "./constants";
import initButtons from "./buttons";
async function init(){
  console.log('game starting')

  initButtons(gameState.handleUserAction);
  let nextTimeToTick = Date.now();

  function nextAnimationFrame(){
    const now = Date.now();
    if(nextTimeToTick <= now){
      gameState.tick(); // personal clock ticker
      nextTimeToTick = now + TICK_RATE;
    }
    // Browser function that calls given function when browser idles
    requestAnimationFrame(nextAnimationFrame);
  }

  nextAnimationFrame();
}

init();

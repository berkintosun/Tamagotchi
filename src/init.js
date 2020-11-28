import gameState from "./gameState";

const TICK_RATE = 3000;

async function init(){
  console.log('game starting')

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

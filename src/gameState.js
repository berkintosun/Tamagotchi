import {
  DAY_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
  NIGHT_LENGTH,
  RAIN_CHANCE,
  SCENES,
  writeModal,
} from "./constants";
import { modFox, modScene, togglePoopBag } from "./ui";

const gameState = {
  current: "INIT",
  clock: 0,
  wakeTime: -1, // sentinel value
  sleepTime: -1,
  hungryTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  poopTime: -1,
  dieTime: -1,
  scene: 0,
  tick() {
    this.clock++;
    console.log("clock = ", this.clock);

    if (this.clock === this.wakeTime) this.wake();
    else if (this.clock === this.sleepTime) this.sleep();
    else if (this.clock === this.hungryTime) this.getHungry();
    else if (this.clock === this.dieTime) this.die();
    else if (this.clock === this.timeToStartCelebrating)
      this.startCelebrating();
    else if (this.clock === this.timeToEndCelebrating) this.endCelebrating();
    else if (this.clock === this.poopTime) this.poop();
    return this.clock;
  },
  handleUserAction(icon) {
    const blockStates = ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"];

    if (blockStates.includes(this.current)) return;

    if (["INIT", "DEAD"].includes(this.current)) {
      this.startGame();
      return;
    }

    switch (icon) {
      case "fish":
        this.feedFox();
        break;

      case "poop":
        this.cleanPoop();
        break;

      case "weather":
        this.changeWeather();
        break;

      default:
        break;
    }
  },
  startGame() {
    writeModal("");
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimers(); // call it before assigning waketime so it will overwrite the -1 value of timer.
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  feedFox() {
    if (this.current !== "HUNGRY") return;
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
    this.hungryTime = getNextHungerTime(this.clock);
  },
  cleanPoop() {
    if (this.current === "POOPING") {
      this.current = "POOP";
      this.dieTime = -1;
      togglePoopBag(true);
      this.startCelebrating();
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  die() {
    this.current = "DEAD";
    modFox("dead");
    modScene("dead");
    this.clearTimers();
    writeModal(
      "Aaah fox is dead :( <br> Click to a button to start a new game!"
    );
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.current = "IDLING";
    this.determineFoxState();
    this.timeToEndCelebrating = -1;
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") modFox("rain");
      else modFox("idling");
    }
  },
  clearTimers() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.dieTime = -1;
    this.hungryTime = -1;
    this.poopTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;

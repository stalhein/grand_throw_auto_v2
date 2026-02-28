import { Settings } from "./settings.js";
import { Cars } from "./cars.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const cars = new Cars(ctx);
await cars.load();

cars.spawnCar(0);
cars.spawnCar(1);
cars.spawnCar(2);

let lastTime = performance.now();

function loop(time) {
    const dt = (time - lastTime) / 1000;
    lastTime = time;

    ctx.clearRect(0, 0, Settings.SCR_WIDTH, Settings.SCR_HEIGHT);

    cars.update(dt);
    cars.render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
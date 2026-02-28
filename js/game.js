import { Settings } from "./settings.js";
import { Cars } from "./cars.js";

export class Game {
    constructor(ctx) {
        this.ctx = ctx;

        this.lastTime = 0;

        this.cars = new Cars(ctx);

        this.loop = this.loop.bind(this);

        this.background = new Image();
    }

    async initialize() {
        await this.cars.load();

        this.background.src = "assets/background.png";

        this.cars.spawnCar(0);
        this.cars.spawnCar(1);
        this.cars.spawnCar(2);
    }

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.ctx.clearRect(0, 0, Settings.SCR_WIDTH, Settings.SCR_HEIGHT);

        this.ctx.drawImage(this.background, 0, 0);

        this.cars.update(dt);
        this.cars.render();

        requestAnimationFrame(this.loop);
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }
};
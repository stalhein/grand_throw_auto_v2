import { Settings } from "./settings.js";

const LANES = [{y: 360, baseSpeed: 100, gap: 500}, {y: 400, baseSpeed: 90, gap: 400}, {y: 440, baseSpeed: 80, gap: 300}];
const SPEED_MULTIPLIER_INCREASE = 0.1;
const CAR_TYPES = {
    NORMAL_1: {path: "car_1.png"},
    NORMAL_2: {path: "car_2.png"},
};

export class Cars {
    constructor(ctx) {
        this.ctx = ctx;

        this.cars = [];

        this.speedMultiplier = 1;

        this.sprites = [];
        this.number_sprites = 2;
    }

    async load() {
        const types = Object.values(CAR_TYPES);
        for (let i = 0; i < types.length; ++i) {
            const image = new Image();
            image.src = `assets/${types[i].path}`;
            this.sprites[i] = image;
        }
    }

    spawnCar(lane, type) {
        this.cars.push({x: Settings.SCR_WIDTH+100, lane: lane, type: type});
    }

    update(dt) {
        for (let lane = 0; lane < LANES.length; ++lane) {
            let distance = Infinity;
            let searching = true;
            let i = this.cars.length-1;
            while (i >= 0 && searching) {
                if (this.cars[i].lane == lane) {
                    distance = Settings.SCR_WIDTH+100-this.cars[i].x;
                    searching = false;
                }
                i--;
            }
            if (distance >= LANES[lane].gap + Math.floor(Math.random()*150)) this.spawnCar(lane);
        }

        for (const car of this.cars) {
            car.x -= LANES[car.lane].baseSpeed * this.speedMultiplier * dt;

            if (car.x < -200) {
                const index = this.cars.indexOf(car);
                if (index == -1) continue;
                this.cars.splice(index, 1);
            }
        }

        this.speedMultiplier += SPEED_MULTIPLIER_INCREASE * dt;
    }

    render() {
        this.ctx.fillStyle = "red";
        for (const car of this.cars) {
            //this.ctx.fillRect(car.x, LANES[car.lane].y, 80, 25);
            this.ctx.drawImage(this.sprites[1], car.x, LANES[car.lane].y);
        }
    }
}
import { Settings } from "./settings.js";

const LANES = [{y: 320, baseSpeed: 100}, {y: 360, baseSpeed: 90}, {y: 400, baseSpeed: 80}];
const SPEED_MULTIPLIER_INCREASE = 0.1;

export class Cars {
    constructor(ctx) {
        this.ctx = ctx;

        this.cars = [];

        this.speedMultiplier = 1;

        this.sprites = [];
        this.number_sprites = 2;
    }

    async load() {
        for (let i = 0; i < this.number_sprites; ++i) {
            const image = new Image();
            image.src = `assets/car_${i+1}.png`;
            this.sprites[i] = image;
        }

    }

    spawnCar(lane) {
        this.cars.push({x: 1300, lane: lane});
    }

    update(dt) {
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
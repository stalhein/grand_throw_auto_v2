import { Settings } from "./settings.js";

export const LANES = [{y: 360, baseSpeed: 150, gap: 1500}, {y: 400, baseSpeed: 100, gap: 700}, {y: 440, baseSpeed: 60, gap: 300}];
const SPEED_MULTIPLIER_INCREASE = 0.15;
const CAR_TYPES = [
    {type: "NORMAL_1", path: "car_1.png"},
    {type: "NORMAL_2", path: "car_2.png"},
    {type: "POLICE", path: "car_police.png"},
];

export class CarManager {
    constructor(ctx) {
        this.ctx = ctx;

        this.cars = [];

        this.speedMultiplier = 1;

        this.sprites = [];
        this.number_sprites = 2;
    }

    async initialize() {
        for (let i = 0; i < CAR_TYPES.length; ++i) {
            const image = new Image();
            image.src = `assets/${CAR_TYPES[i].path}`;
            this.sprites[i] = image;
        }
	this.cars = [];
	this.speedMultiplier = 1;
    }

    spawnCar(lane) {
        let typeNumber = Math.random() * ((2-lane) + 0.5);
        let type = CAR_TYPES[0];
        if (typeNumber < 0.4) type = CAR_TYPES[0];
        else if (typeNumber < 1.3) type = CAR_TYPES[1];
        else type = CAR_TYPES[2];
        this.cars.push({x: Settings.SCR_WIDTH+100, lane: lane, type: type, hit: false});
    }

    update(dt) {
        let dscore = 0;

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
            if (distance >= LANES[lane].gap + Math.floor(Math.random()*300)) this.spawnCar(lane);
        }

        for (const car of this.cars) {
            if (car.hit) {
                const index = this.cars.indexOf(car);
                if (index == -1) continue;
                this.cars.splice(index, 1);

                if (car.type.type == "NORMAL_1") dscore += 10;
                else if (car.type.type == "NORMAL_2") dscore += 50;
                else dscore += 100;
            }

            car.x -= LANES[car.lane].baseSpeed * this.speedMultiplier * dt;

            if (car.x < -64) {
                const index = this.cars.indexOf(car);
                if (index == -1) continue;
                this.cars.splice(index, 1);

                dscore -= car.type.type == "POLICE" ? 0 : 5;
            }
        }

        this.speedMultiplier += SPEED_MULTIPLIER_INCREASE * dt;

        return dscore;
    }

    render() {
        for (const car of this.cars) {
            
            this.ctx.drawImage(this.sprites[CAR_TYPES.indexOf(car.type)], car.x, LANES[car.lane].y);

        }
    }
}

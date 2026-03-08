import { Settings } from "./settings.js";
import { LANES } from "./car_manager.js";

const PIXELS_PER_METER = 128;

export class BrickManager {
    constructor(ctx) {
        this.ctx = ctx;

        this.bricks = [];

        this.sprite1 = new Image();
        this.sprite2 = new Image();
    }

    async initialize() {
        this.sprite1.src = "assets/brick1.png";
        this.sprite2.src = "assets/brick2.png";
	this.bricks = [];
    }

    update(dt, cars) {
        let ds = 0;
        for (const brick of this.bricks) {
            brick.speed += 9.81 * PIXELS_PER_METER * dt;
            brick.y += brick.speed * dt;

            for (const car of cars) {
                const a = {x: car.x+3, y: LANES[car.lane].y+4, w: 56, h: 15};
                const b = {x: brick.x, y: brick.y, w: 10, h: 20};
                if (this.colliding(a, b)) {
                    if (car.type.type == "POLICE" && brick.type == 0) {
                        brick.speed = -brick.speed * 0.6;
                        brick.y -= 20;
                        ds -= 100;
                        continue;
                    }
                    car.hit = true;

                    const index = this.bricks.indexOf(brick);
                    if (index == -1) continue;
                    this.bricks.splice(index, 1);
                }
            }

            if (brick.y > Settings.SCR_HEIGHT + 100) {
                const index = this.bricks.indexOf(brick);
                if (index == -1) continue;
                this.bricks.splice(index, 1);
            }
        }

        return ds;
    }

    render() {
        for (const brick of this.bricks) {
            if (brick.type == 0) {
                this.ctx.drawImage(this.sprite1, brick.x, brick.y, 10, 20);
            } else {
                this.ctx.drawImage(this.sprite2, brick.x, brick.y, 10, 20);
            }
        }
    }

    shoot(type) {
        this.bricks.push({x: 134, y: 85, speed: 50, type: type});
    }

    colliding(a, b) {
        return (a.x < b.x+b.w &&
            a.x+a.w > b.x &&
            a.y < b.y+b.h &&
            a.y+a.h > b.y);
    }
}

import { Settings } from "./settings.js";
import { CarManager } from "./car_manager.js";
import { BrickManager } from "./brick_manager.js";

const PLAYER_X = 115, PLAYER_Y = 35;
const COOLDOWN = 500;

export class Game {
    constructor(ctx) {
        this.ctx = ctx;

        this.lastTime = 0;

        this.carManager = new CarManager(ctx);
        this.brickManager = new BrickManager(ctx);

        this.loop = this.loop.bind(this);

        this.background = new Image();
        this.bridge = new Image();
        this.player = new Image();
        this.font = new FontFace("Jersey10-Regular", "url(./assets/Jersey10-Regular.ttf)");
        this.font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        });

        this.score = 10000;

        this.heldSince = Infinity;
        this.lastThrow = -Infinity;
        this.playerFrame = 0;
        document.addEventListener("mousedown", () => {
            this.heldSince = performance.now();
        });
        document.addEventListener("mouseup", () => {
            const heldTime = performance.now() - this.heldSince;
            if (performance.now() - this.lastThrow > COOLDOWN) {
                
                this.brickManager.shoot(heldTime >= 1000 ? 1 : 0);

                this.heldSince = Infinity;
                this.lastThrow = performance.now();

            }
        });
    }

    async initialize() {
        await this.carManager.initialize();
        await this.brickManager.initialize();

        this.background.src = "assets/background.png";
        this.bridge.src = "assets/bridge.png";
        this.player.src = "assets/player.png";
    }

    loop(time) {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.ctx.clearRect(0, 0, Settings.SCR_WIDTH, Settings.SCR_HEIGHT);
        if (time - this.lastThrow < COOLDOWN) {
            this.playerFrame = 2;
        } else if (time - this.heldSince >= 1000) {
            this.playerFrame = 3;
        } else if(time - this.heldSince > 0) {
            this.playerFrame = 1;
        } else {
            this.playerFrame = 0;
        }

        // Render background
        this.ctx.drawImage(this.background, 0, 0);

        // Update and render cars and update score
        this.score += this.carManager.update(dt);
        this.carManager.render();

        // Render scenary, player and overlays
        this.ctx.drawImage(this.player, this.playerFrame * 160, 0, 160, 240, PLAYER_X, PLAYER_Y, 65, 100);
        this.ctx.drawImage(this.bridge, 0, 100);
        this.ctx.font = "50px Jersey10-Regular";
        this.ctx.fillText(this.score, Settings.SCR_WIDTH - 130, 50);

        // Update and render bricks
        this.brickManager.update(dt, this.carManager.cars);
        this.brickManager.render();

        requestAnimationFrame(this.loop);
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }
};
import { Settings } from "./settings.js";
import { CarManager } from "./car_manager.js";
import { BrickManager } from "./brick_manager.js";

const PLAYER_X = 115, PLAYER_Y = 35;
const COOLDOWN = 500;
const MAX_STAMINA = 10;

export class Game {
    constructor(ctx) {
        this.ctx = ctx;

        this.gameState = 0;

        this.lastTime = 0;

        this.carManager = new CarManager(ctx);
        this.brickManager = new BrickManager(ctx);

        this.loop = this.loop.bind(this);

        this.gameStart = new Image();
        this.gameOver = new Image();

        this.background = new Image();
        this.bridge = new Image();
        this.player = new Image();
        this.staminaBar = new Image();
        this.font = new FontFace("Jersey10-Regular", "url(./assets/Jersey10-Regular.ttf)");
        this.font.load().then(function(loadedFont) {
            document.fonts.add(loadedFont);
        });

	this.timePlayed = 0;
        this.score = 100;
        this.stamina = MAX_STAMINA;
        this.lastStaminaUpdate = 0;

        this.heldSince = Infinity;
        this.lastThrow = -Infinity;
        this.playerFrame = 0;
        document.addEventListener("keydown", (e) => {
            if (e.repeat) return;
            if (this.gameState == 0 || this.gameState == 2) return;
            this.heldSince = performance.now();
        });
        document.addEventListener("keyup", (e) => {
            if (e.repeat) return;

            if (this.gameState == 0 || this.gameState == 2) {
                this.gameState = 1;
                this.lastTime = performance.now();
		this.timePlayed = 0;
		this.carManager.initialize();
		this.brickManager.initialize();
		this.score = 100;
                return;
            }

            const heldTime = performance.now() - this.heldSince;
            if (performance.now() - this.lastThrow > COOLDOWN) {
                const s = heldTime >= 500 ? 1 : 0;
                const ds = (s == 0 ? 1 : 8);

                this.heldSince = Infinity;
                
                if (this.stamina-ds < 0) return;

                this.brickManager.shoot(s);
                this.stamina -= ds;
                this.lastThrow = performance.now();

            }
        });
    }

    async initialize() {
        await this.carManager.initialize();
        await this.brickManager.initialize();

        this.gameStart.src = "assets/game_start.png";
        this.gameOver.src = "assets/game_over.png";

        this.background.src = "assets/background.png";
        this.bridge.src = "assets/bridge.png";
        this.player.src = "assets/player.png";
        this.staminaBar.src = "assets/stamina_bar.png";

        this.lastStaminaUpdate = performance.now();
    }

    loop(time) {
        if (this.gameState == 0) {
	    this.ctx.drawImage(this.gameStart, 0, 0);
	    requestAnimationFrame(this.loop);
            return;
        } else if (this.gameState == 2) {
            this.ctx.clearRect(0, 0, Settings.SCR_WIDTH, Settings.SCR_HEIGHT);

            this.ctx.drawImage(this.background, 0, 0);

            this.ctx.drawImage(this.player, 0, 0, 160, 240, PLAYER_X, PLAYER_Y, 65, 100);
            this.ctx.drawImage(this.bridge, 0, 100);

            this.ctx.font = "80px Jersey10-Regular";
            this.ctx.fillText("GAME OVER", Settings.SCR_WIDTH/2 - (this.ctx.measureText("GAME OVER").width)/2, 70);

            this.ctx.font = "50px Jersey10-Regular";
            let text = `You survived: ${(this.timePlayed/1000).toFixed(2)} seconds`;
            this.ctx.fillText(text, Settings.SCR_WIDTH/2 - this.ctx.measureText(text).width/2, 200);

            text = "PRESS SPACE TO PLAY AGAIN";
            this.ctx.fillText(text, Settings.SCR_WIDTH/2 - this.ctx.measureText(text).width/2, 420);

	    requestAnimationFrame(this.loop);
	    
            return;
        }

	const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

	this.timePlayed += dt * 1000;

        this.ctx.clearRect(0, 0, Settings.SCR_WIDTH, Settings.SCR_HEIGHT);
        if (time - this.lastThrow < COOLDOWN) {
            this.playerFrame = 2;
        } else if (time - this.heldSince >= 500) {
            this.playerFrame = 3;
        } else if(time - this.heldSince > 0) {
            this.playerFrame = 1;
        } else {
            this.playerFrame = 0;
        }

        if (time - this.lastStaminaUpdate > 2000 && this.stamina < MAX_STAMINA) {
            this.stamina++;
            this.lastStaminaUpdate = time;
            console.log(this.stamina);
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
        this.ctx.fillText(this.score, Settings.SCR_WIDTH - 100 - this.ctx.measureText(this.score).width, 50);
        this.ctx.fillText((this.timePlayed/1000).toFixed(2), 100-this.ctx.measureText((this.timePlayed/1000).toFixed(2)).width/2, 50);
        this.ctx.fillStyle = "#FAC898";
        this.ctx.fillRect(212, 10, this.stamina * (600 / MAX_STAMINA), 50);
        this.ctx.drawImage(this.staminaBar, 207, 5);

        // Update and render bricks
        this.score += this.brickManager.update(dt, this.carManager.cars);
        this.brickManager.render();

        if (this.score <= 0) this.gameState = 2;

        requestAnimationFrame(this.loop);
    }

    start() {
        requestAnimationFrame(this.loop);
    }
};

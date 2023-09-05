import Game from "./Game";
import SmallLaser from "./SmallLaser";
import BigLaser from "./BigLaser";
class Player {
    game: Game;
    width: number;
    height: number;
    x: number;
    y: number;
    speedX: number;
    lives: number;
    playerSprite: HTMLImageElement | null
    playerJetSprite: HTMLImageElement | null
    frameWidth: number
    frameHeight: number
    playerFrame: number
    playerJetFrame: number
    maxLives: number
    smallLaser: SmallLaser
    bigLaser: BigLaser
    maxEnergy: number
    energy: number
    coolDown: boolean

    constructor(game: Game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.speedX = 6;
        this.lives = 3;
        this.maxLives = 10
        this.playerSprite = this.game.assetsHandler.getImage("player") as HTMLImageElement
        this.playerJetSprite = this.game.assetsHandler.getImage("player_jets") as HTMLImageElement;
        this.frameWidth = 140
        this.frameHeight = 120
        this.playerFrame = 0
        this.playerJetFrame = 1
        this.maxEnergy = 100
        this.energy = this.maxEnergy / 2
        this.coolDown = false
        this.smallLaser = new SmallLaser(this.game)
        this.bigLaser = new BigLaser(this.game)
    }

    draw(context: CanvasRenderingContext2D) {
        // context.fillRect(this.x, this.y, this.width, this.height);

        this.playerFrame = 0

        if(this.game.keys.includes('1')) {
            this.playerFrame = 1;
        }

        if(this.game.keys.includes('2')) {
            this.playerFrame = 2
            this.smallLaser.render(context)
            !this.coolDown && (this.energy -= this.smallLaser.damage)
        }
        
        if(this.game.keys.includes('3')) {
            this.playerFrame = 3
            this.bigLaser.render(context)
            !this.coolDown && (this.energy -= this.bigLaser.damage)
        }

        this.playerJetFrame = 1

        if(this.game.keys.includes('a')) {
            this.playerJetFrame = 0;
        }

        if(this.game.keys.includes('d')) {
            this.playerJetFrame = 2;
        }
        this.playerSprite && context.drawImage(this.playerSprite, this.playerFrame * this.frameWidth, 0 * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
        
        this.playerJetSprite && context.drawImage(this.playerJetSprite, this.playerJetFrame * this.frameWidth, 0 * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
    }

    update() {
        if(this.game.keys.includes('a')) {
            this.x -= this.speedX;
        }
        if(this.game.keys.includes('d')) {
            this.x += this.speedX;
        }

        if(this.x < -this.width/2 ) {
            this.x = -this.width/2;
        }
        if(this.x > this.game.width - this.width/2) {
            this.x = this.game.width - this.width/2;
        }

        if(this.energy < 1) {
            this.coolDown = true
        }else if(this.energy > this.maxEnergy * 0.1) {
            this.coolDown = false
        }

        if(this.energy < this.maxEnergy) {
            this.energy += 0.05
        }

    }

    shoot() {
        const projectTile = this.game.getFreeProjectTile()
        if(projectTile) {
            projectTile.start(this.x + this.width / 2, this.y)
            this.game.audioControl.playShootSound()
        }
    }

    restart() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.lives = 3
    }
}

export default Player
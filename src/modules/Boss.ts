import Game from "./Game";
class Boss {
    x: number;
    y: number;
    width: number;
    height: number;
    speedX: number;
    speedY: number
    game: Game
    markedToDelete: boolean
    imageSprite: HTMLImageElement | null;
    frameX: number;
    frameY: number;
    frameWidth: number;
    frameHeight:number;
    maxFrame: number;
    lives: number;
    maxLives: number;

    constructor(game: Game) {
        this.game = game;
        this.width = 200;
        this.height = 200;
        this.y = -this.height;
        this.x = (this.game.width - this.width) / 2;
        this.speedX = Math.random() > 0.5 ? -1 : 1;
        this.speedY = 0
        this.markedToDelete = false
        this.frameX = 0;
        this.frameY = Math.floor(Math.random() * 4);
        this.maxFrame = 11;
        this.frameWidth= 200;
        this.frameHeight = 200
        this.lives = this.game.bossLives;
        this.maxLives = this.lives;
        this.imageSprite = this.game.assetsHandler.getImage("boss") as HTMLImageElement;
    }

    draw(context: CanvasRenderingContext2D): void {
        this.imageSprite && context.drawImage(this.imageSprite, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
        context.save()
        context.textAlign = "center"
        context.shadowOffsetX = 4
        context.shadowOffsetY = 4
        context.shadowColor = 'black'
        this.lives > 0 && context.fillText(`${Math.ceil(this.lives)}`, this.x + this.width / 2, this.y + 50);
        context.restore()
    }
    update() {
        if(this.y < 0) this.y += 5;
        this.speedY = 0;
        this.x += this.speedX;

        if(this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX = -this.speedX;
            this.speedY = this.height * 0.4;
        }

        this.y += this.speedY;


        if(this.x < 0 ) {
            this.x = 0;
        }
        if(this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        this.game.projectTiles.forEach(item => {
            if(!item.free) {
                const collision = this.game.collisionCheck(item, this);
                if(collision && this.lives > 0 && this.y >= 0) {
                    item.reset()
                    this.hit(1)
                }
            }
        })

        if(this.game.height - this.y < this.height) {
            this.game.gameOver = true
            this.markedToDelete = true
        }

        if(this.game.collisionCheck(this, this.game.player) && this.lives > 0) {
            this.lives = 0;
            this.game.player.lives = 0;
            this.game.gameOver = true;
        }

        if(this.game.spriteUpdate && this.lives > 0) {
            this.frameX = 0
        }

        if(this.game.spriteUpdate && this.lives < 1 && this.frameX < this.maxFrame) {
            this.frameX++
        }

        if(this.frameX >= this.maxFrame) {
            this.game.audioControl.playExplosionSound()
            this.markedToDelete = true
            this.game.score += this.maxLives
            this.game.newWave()
        }
    }



    hit(damage: number) {
        this.game.audioControl.playHitSound()
        this.lives -= damage;
        if(this.lives > 0) {
            this.frameX = 1
        }
    }
}

export default Boss
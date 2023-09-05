import Game from "./Game";
class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    game: Game
    positionX: number;
    positionY: number;
    markedToDelete: boolean
    imageSprite: HTMLImageElement | null;
    frameX: number;
    frameY: number;
    frameWidth: number;
    frameHeight:number;
    maxFrame: number;
    lives: number;
    maxLives: number;
    constructor(game: Game, positionX: number, positionY: number) {
        this.game = game;
        this.positionX = positionX;
        this.positionY = positionY;
        this.x = 0;
        this.y = 0;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.speed = 0
        this.markedToDelete = false
        this.imageSprite = null
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 2;
        this.frameWidth= 80;
        this.frameHeight = 80
        this.lives = 1;
        this.maxLives = this.lives
    }

    hit(damage: number) {
        this.game.audioControl.playHitSound()
        this.lives -= damage;
    }

    draw(context: CanvasRenderingContext2D) {
        this.imageSprite && context.drawImage(this.imageSprite, this.frameX * this.frameWidth, this.frameY * this.frameHeight, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
    }

    update(x: number, y: number) {
        this.x = x + this.positionX;
        this.y = y + this.positionY;
        //collision check between projectiles
        this.game.projectTiles.forEach(item => {
            if(!item.free) {
                const collision = this.game.collisionCheck(item, this);
                if(collision && this.lives > 0) {
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

            if(!this.game.gameOver && this.game.score > 1) {
                this.game.score--;
            }
            this.game.player.lives--;
            if(this.game.player.lives < 1) {
                this.game.gameOver = true;
            }
        }

        if(this.lives <= 0 ) {
            if(this.game.spriteUpdate) this.frameX++;
            if(this.frameX > this.maxFrame) {
                this.game.audioControl.playExplosionSound()
                this.markedToDelete = true;
                if(!this.game.gameOver) this.game.score += this.maxLives
            }
        }
    }
}

export default Enemy
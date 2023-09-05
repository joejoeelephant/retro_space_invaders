import Enemy from "./Enemy";
import Game from "./Game";
class Rhinomorph extends Enemy {
    constructor(game: Game, positionX: number, positionY: number) {
        super(game, positionX, positionY)
        const beetleSprite = this.game.assetsHandler.getImage('rhinomorph') as HTMLImageElement;
        this.imageSprite = beetleSprite;
        this.frameY = Math.floor(Math.random() * 4)
        this.lives = 4
        this.maxLives = this.lives
        this.maxFrame = 5
    }

    hit(damage: number): void {
        super.hit(damage)
        this.frameX = Math.floor(this.maxLives - this.lives)
    }
}

export default Rhinomorph
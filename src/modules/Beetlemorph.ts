import Enemy from "./Enemy";
import Game from "./Game";
class Beetlemorph extends Enemy {
    constructor(game: Game, positionX: number, positionY: number) {
        super(game, positionX, positionY)
        const beetleSprite = this.game.assetsHandler.getImage('beetlemorph') as HTMLImageElement;
        this.imageSprite = beetleSprite;
        this.frameY = Math.floor(Math.random() * 4)
        this.lives = 1
    }
}

export default Beetlemorph
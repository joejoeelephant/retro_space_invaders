import Laser from "./Laser";
import Game from "./Game";
class BigLaser extends Laser {
    constructor(game: Game) {
        super(game)
        this.width = 20
        this.damage = 1
    }

    render(context: CanvasRenderingContext2D): void {
        if(this.game.player.energy > this.damage && !this.game.player.coolDown) {
            super.render(context)
        }
    }
}

export default BigLaser
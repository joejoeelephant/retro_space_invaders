import Laser from "./Laser";
import Game from "./Game";
class SmallLaser extends Laser {
    constructor(game: Game) {
        super(game)
        this.width = 4
    }

    render(context: CanvasRenderingContext2D): void {
        if(this.game.player.energy > this.damage && !this.game.player.coolDown) {
            super.render(context)
        }

    }
}

export default SmallLaser
import Game from "./Game"
class Laser {
    game: Game
    x: number
    y: number
    width: number
    height: number
    damage: number
    constructor(game: Game) {
        this.game = game
        this.x = 0;
        this.y = 0;
        this.height = this.game.height - 50;
        this.width = 0
        this.damage = 0.5
    }

    render(context: CanvasRenderingContext2D) {
        this.x = (this.game.player.x + (this.game.player.width - this.width) / 2)

        context.save()
        context.fillStyle = "gold"
        context.fillRect(this.x, this.y, this.width, this.height)
        context.restore()

        context.save()
        context.fillStyle = "white"
        context.fillRect(this.x + (this.width - this.width * 0.4) / 2, this.y, this.width * 0.4, this.height)
        context.restore()

        if(this.game.spriteUpdate) {
            this.game.waves.forEach(wave => {
                wave.enemies.forEach(enemy => {
                    if(this.game.collisionCheck(this, enemy) && enemy.lives > 0) {
                        enemy.hit(1)
                    }
                })
            })
    
            this.game.bossArray.forEach(boss => {
                if(this.game.collisionCheck(this, boss) && boss.lives > 0 && boss.y >= 0) {
                    boss.hit(this.damage)
                }
            })
        }
    }
}

export default Laser
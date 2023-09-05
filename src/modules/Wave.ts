import Game from "./Game";
import Enemy from "./Enemy";
import Beetlemorph from "./Beetlemorph";
import Rhinomorph from "./Rhinomorph";
class Wave {
    game: Game;
    width: number;
    height: number;
    x: number;
    y:number;
    speedX: number;
    speedY: number;
    enemies: Enemy[]
    nextWaveTrigger: boolean
    markedtoDelete: boolean

    constructor(game: Game) {
        this.game = game;
        this.height = this.game.enemyRows * this.game.enemySize;
        this.width = this.game.enemyCols * this.game.enemySize;
        this.x = this.game.width/2 - this.width ;
        this.y = -this.height - 1;
        this.speedX = Math.random() > 0.5 ? 1 : -1;
        this.speedY = 0;
        this.enemies = [];
        this.nextWaveTrigger = false
        this.markedtoDelete = false
        this.createEnemies()
    }
    
    createEnemies() {
        for(let i = 0; i < this.game.enemyRows; ++i) {
            for(let j = 0; j < this.game.enemyCols; ++j) {
                if(Math.random() > 0.3) {
                    this.enemies.push(new Beetlemorph(this.game, j * this.game.enemySize, i * this.game.enemySize))
                }else {
                    this.enemies.push(new Rhinomorph(this.game, j * this.game.enemySize, i * this.game.enemySize))
                }
            }
        }
    }

    render (context: CanvasRenderingContext2D) {
        this.enemies.forEach(item => {
            item.draw(context)
            item.update(this.x, this.y);
        })
    }

    update() {
        if(this.y < 0) this.y += 5;
        this.speedY = 0;
        this.x += this.speedX;

        if(this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX = -this.speedX;
            this.speedY = this.game.enemySize;
        }

        this.y += this.speedY;


        if(this.x < 0 ) {
            this.x = 0;
        }
        if(this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        this.enemies = this.enemies.filter(item => !item.markedToDelete)
        if(this.enemies.length < 1) {
            this.markedtoDelete = true
        }
        
    }
}

export default Wave
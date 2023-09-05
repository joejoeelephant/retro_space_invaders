import Player from "./Player";
import ProjectTile from "./ProjectTile";
import Wave from "./Wave";
import Boss from "./Boss";
import { AudioControl } from "./AudioControl";
import { AssetsHandler } from "./AssetsHandler";

class Game {
    canvas: HTMLCanvasElement
    width: number
    height: number
    player: Player
    keys: string[]
    projectTiles: ProjectTile[]
    private numberOfProjectTile= 10;
    waves: Wave[];
    enemyRows = 2;
    enemyCols = 2;
    enemySize = 60;
    score: number;
    gameOver: boolean;
    waveCount: number
    spriteUpdate: boolean;
    spriteTimer: number;
    spriteInterval: number;
    bossArray: Boss[]
    bossLives: number
    assetsHandler: AssetsHandler
    audioControl: AudioControl
    gameOverPlayed: boolean

    constructor(canvas: HTMLCanvasElement, assetsHandler: AssetsHandler) {
        this.canvas = canvas;
        this.height = canvas.height;
        this.width = canvas.width;
        this.keys = [];
        this.projectTiles = [];
        this.score = 0;
        this.bossLives = 10
        this.waves = []
        this.waveCount = 1
        this.gameOver = false
        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 100
        this.bossArray = []
        this.assetsHandler = assetsHandler
        this.player = new Player(this);
        this.audioControl = new AudioControl(assetsHandler)
        this.gameOverPlayed = false

        this.init()


        window.addEventListener("keydown", (event: KeyboardEvent) => {
            if(this.keys.includes(event.key)) {
                return;
            }
            if(event.key === '1') this.player.shoot()
            if(event.key === 'r' && this.gameOver) {
                this.restart();
            }
            this.keys.push(event.key)
        });

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            const index = this.keys.indexOf(event.key);
            this.keys.splice(index, 1);
        });
    }

    init() {
        this.keys = [];
        this.projectTiles = [];
        this.enemyRows = 2;
        this.enemyCols = 2;
        this.enemySize = 60;
        this.score = 0;
        this.player = new Player(this);
        this.waves = []
        this.bossArray = []
        this.waveCount = 1
        this.gameOver = false
        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 100
        this.createProjectTile()
        this.waves.push(new Wave(this))
        this.audioControl.playBackgroundMusic()
        // this.bossArray.push(new Boss(this))

    }

    render(context: CanvasRenderingContext2D, deltaTime: number) {
        context.clearRect(0, 0, this.width, this.height)
        if(this.spriteTimer > this.spriteInterval) {
            this.spriteTimer = 0
            this.spriteUpdate = true;
        }else {
            this.spriteUpdate = false
            this.spriteTimer += deltaTime
        }
        this.drawStatusText(context)

        this.projectTiles.forEach(item => {
            item.update();
            item.draw(context);
        })

        this.player.update()
        this.player.draw(context);
        if(this.gameOver) {
            if(!this.gameOverPlayed) {
                this.audioControl.stopBackgroundMusic()
                this.audioControl.stopBossBattle()
                this.audioControl.playGameOverSound()
                this.gameOverPlayed = true
            }
            return;
        }
        
        this.waves.forEach(item => {
            item.update()
            item.render(context)
            if(!item.nextWaveTrigger && !this.gameOver &&  item.enemies.length < 1) {
                item.nextWaveTrigger = true
                this.newWave()
            }
        })

        this.bossArray.forEach(item => {
            item.draw(context)
            item.update()
        })


    }

    createProjectTile() {
        for(let i = 0; i< this.numberOfProjectTile; ++i) {
            this.projectTiles.push(new ProjectTile())
        }
    }

    getFreeProjectTile() {
        for(let i = 0; i< this.numberOfProjectTile; ++i) {
            if(this.projectTiles[i].free) {
                return this.projectTiles[i]
            }
        }
    }
    // collision check between 2 rectangles
    collisionCheck(rect1: any, rect2: any) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    drawStatusText(context: CanvasRenderingContext2D) {
        context.font = "30px Impact"
        context.fillText(`Score: ${this.score}`, 20, 40)
        context.fillText(`WaveCount: ${this.waveCount}`, 20, 80)

        for(let i = 0; i < this.player.maxLives; ++i) {
            context.strokeRect(i * 15 + 20, 100, 5, 20)
        }

        for(let i = 0; i < this.player.lives; ++i) {
            context.fillRect(i * 15 + 20, 100, 5, 20)
        }

        context.save()
        for(let i = 0; i < this.player.energy; ++i) {
            this.player.energy < this.player.maxEnergy * 0.1 ? context.fillStyle = "red" : context.fillStyle = "gold"
            context.fillRect(i * 2 + 20, 140, 2, 16)
        }
        context.restore()


        if(this.gameOver) {
            context.save()
            context.shadowOffsetX = 8
            context.shadowOffsetY = 8
            context.shadowColor = 'black'
            context.textAlign = "center"
            context.font = "100px Impact"
            context.fillText(`Game Over`, this.width / 2, this.height / 2)
            context.font = "20px Impact"
            context.fillText(`Press "R" To Restart`, this.width / 2, this.height / 2 + 60)
            context.restore()
        }

        

    }

    restart() {
        this.init()
        this.player.restart()
    }

    newBoss() {
        this.bossArray.push(new Boss(this))
    }

    newWave() {
        if(this.waveCount % 4 == 0) {
            this.newBoss()
            this.bossLives += 5
        }else {
            if(Math.random() > 0.5 && this.enemyCols * this.enemySize < this.width * 0.8) {
                this.enemyCols++
            }else if(this.enemyRows * this.enemySize < this.height * 0.6) {
                this.enemyRows++;
            }
            this.waves.push(new Wave(this))
        }
        this.waveCount++
        if(this.player.lives < this.player.maxLives) this.player.lives++
        this.waves = this.waves.filter(item => !item.markedtoDelete)
        this.bossArray = this.bossArray.filter(item => !item.markedToDelete)

        if(this.waves.length) {
            this.audioControl.playBackgroundMusic()
            this.audioControl.stopBossBattle()
        }else if(this.bossArray.length){
            this.audioControl.stopBackgroundMusic()
            this.audioControl.playBossBattle()
        }

    }
}

export default Game
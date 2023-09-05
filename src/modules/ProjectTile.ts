class ProjectTile {
    width: number;
    height: number;
    speed: number;
    x: number;
    y: number;
    free: boolean;
    constructor() {
        this.width = 4;
        this.height = 20;
        this.speed = 30;
        this.x = 0; 
        this.y = 0;
        this.free = true;
    }

    draw(context: CanvasRenderingContext2D) {
        if(!this.free) {
            context.save()
            context.fillStyle = "gold";
            context.fillRect(this.x, this.y, this.width, this.height)
            context.restore()
        }
    }

    update() {
        if(this.free) {
            return;
        }
        this.y -= this.speed;

        if(this.y < -this.height) {
            this.reset()
        }
    }

    start(x: number, y: number) {
        this.free = false;
        this.x = x - this.width / 2;
        this.y = y;
    }

    reset() {
        this.free = true
    }
}

export default ProjectTile
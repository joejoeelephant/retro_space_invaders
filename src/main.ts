import './style.css'
import Assets from './modules/assets.config';
import { AssetsHandler, Asset } from './modules/AssetsHandler';
import Game from './modules/Game';
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <canvas id="canvasRef" style="background-image: url('/background.png');"></canvas>
    <div class="loading-mask">
      <div class='loading-img'>
        <img src='/loading_player.png' alt="loading_player.png">
      </div>
      <div class="loading-status" style="--i: 0%" id="loading_status">
        <span class="loading-dot"></span>
        <div class="loading-text">
          Loading
        </div>
      </div>
    </div>
    <div class="introduction">
      <div class="move-keys">
        <div></div>
        <div class="move-item">
          <div>up</div>
          <div>W</div>
        </div>
        <div></div>
        <div class="move-item">
          <div>left</div>
          <div>A</div>
        </div>
        <div></div>
        <div class="move-item">
          <div>right</div>
          <div>D</div>
        </div>
      </div>
      <div class="shoot-keys">
        <div class="move-item">
          <div>Shoot</div>
          <div>1</div>
        </div>
        <div class="move-item">
          <div>Laser1</div>
          <div>2</div>
        </div>
        <div class="move-item">
          <div>Laser2</div>
          <div>3</div>
        </div>
      </div>
      <div class="confirm-btn">
        Press "Enter" to Start
      </div>
    </div>
  </div>
`

window.addEventListener('load', () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvasRef");
  const context = canvas?.getContext('2d');
  if (!canvas || !context) {
    console.error('Canvas or context not initialized.');
    return;
  }
  canvas.width = 600;
  canvas.height = 800;
  context.fillStyle = "white"
  context.strokeStyle = "white"


  const updateProgress = (percent: number) => {
    // Here, you could update a progress bar or loading indicator on screen
    const loading_status_ref = document.querySelector<HTMLDivElement>("#loading_status")
    loading_status_ref?.style.setProperty("--i", Math.floor(percent)+"%")
    loading_status_ref?.querySelector<HTMLSpanElement>('.loading-dot')?.style.setProperty('transform', `rotate(${Math.floor(percent) / 100 * 360}deg)`)
    const loadingTextDiv = loading_status_ref?.querySelector<HTMLDivElement>('.loading-text');
    if (loadingTextDiv) {
      loadingTextDiv.textContent = Math.floor(percent) + "%";
    }
  };

  const init = () => {
    let acknowledged: boolean = false
    const assetsHandler = new AssetsHandler(Assets as Asset[])
    let game: Game|null = null;
    assetsHandler.load().then(() => {
      game = new Game(canvas, assetsHandler);
      document.querySelector<HTMLDivElement>('.loading-mask')?.style.setProperty("display", "none")
    })
   
    let lastTime = 0;

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if(event.key === "Enter") {
        acknowledged = true
        document.querySelector<HTMLDivElement>('.introduction')?.style.setProperty("display", "none")

      }
    })
    const animate = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime;
      lastTime  = timeStamp
      !game && updateProgress(assetsHandler.getProgress())
      game && acknowledged && game.render(context, deltaTime);
      requestAnimationFrame(animate);
    }

    animate(lastTime)
  }

  init()

  
});
type AssetType = 'ImageAssets' | 'AudioAssets';

export interface Asset {
  name: string;
  type: AssetType;
  filePath: string;
}

interface AssetOutput {
  name: string;
  file: HTMLImageElement | HTMLAudioElement;
}

export class AssetsHandler {
  private imageAssets: AssetOutput[] = [];
  private audioAssets: AssetOutput[] = [];
  private totalAssets = 0;
  private loadedAssets = 0;

  constructor(private assets: Asset[]) {
    this.totalAssets = assets.length;
  }

  public load(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const asset of this.assets) {
      if (asset.type === 'ImageAssets') {
        promises.push(this.loadImage(asset));
      } else if (asset.type === 'AudioAssets') {
        promises.push(this.loadAudio(asset));
      }
    }

    return Promise.all(promises).then(() => {
      console.log('All assets are loaded.');
    })
  }

  public getProgress(): number {
    return (this.loadedAssets / this.totalAssets) * 100;
  }

  public getImage(name: string): HTMLImageElement | undefined {
    return this.imageAssets.find(asset => asset.name === name)?.file as HTMLImageElement;
  }

  public getAudio(name: string): HTMLAudioElement | undefined {
    return this.audioAssets.find(asset => asset.name === name)?.file as HTMLAudioElement;
  }

  private loadImage(asset: Asset): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = asset.filePath;
      img.onload = () => {
        this.imageAssets.push({ name: asset.name, file: img });
        this.loadedAssets++;
        resolve();
      };
      img.onerror = () => {
        reject({ name: asset.name, type: 'ImageAssets', reason: 'Failed to load image.' });
      };
    });
  }

  private loadAudio(asset: Asset): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = asset.filePath;
      audio.addEventListener('canplaythrough', () => {
        this.audioAssets.push({ name: asset.name, file: audio });
        this.loadedAssets++;
        resolve();
      }, false);
      audio.onerror = () => {
        reject({ name: asset.name, type: 'AudioAssets', reason: 'Failed to load audio.' });
      };
    });
  }
}
import { AssetsHandler } from "./AssetsHandler";
enum SoundType {
    SHOOT = "shoot",
    HIT = "hit",
    BACKGROUND = "theme_song",
    EXPLOSION = "explosion",
    BOSS_BATTLE = "boss_battle",
    GAME_OVER = "game_over"
}
  
export class AudioControl {
    private assetsHandler: AssetsHandler; // Assume AssetsHandler is a class you've defined
    private backgroundMusic: HTMLAudioElement | undefined;
    private bossBattleMusic: HTMLAudioElement | undefined;


    constructor(assetsHandler: AssetsHandler) {
        this.assetsHandler = assetsHandler;
    }

    public playShootSound(): void {
        this.playSound(SoundType.SHOOT);
    }

    public playHitSound(): void {
        this.playSound(SoundType.HIT);
    }

    public playGameOverSound(): void {
        this.playSound(SoundType.GAME_OVER);
    }

    public playExplosionSound(): void {
        this.playSound(SoundType.EXPLOSION);
    }

    public playBackgroundMusic(): void {
        this.backgroundMusic = this.assetsHandler.getAudio(SoundType.BACKGROUND);
        if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.play();
        }
    }

    public stopBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    public playBossBattle(): void {
        this.bossBattleMusic = this.assetsHandler.getAudio(SoundType.BOSS_BATTLE);
        if (this.bossBattleMusic) {
            this.bossBattleMusic.loop = true;
            this.bossBattleMusic.play();
        }
    }

    public stopBossBattle(): void {
        if (this.bossBattleMusic) {
            this.bossBattleMusic.pause();
            this.bossBattleMusic.currentTime = 0;
        }
    }

    private playSound(type: SoundType): void {
        const audio = this.assetsHandler.getAudio(type);
        if (!audio) {
        console.warn(`Sound of type ${type} not found.`);
        return;
        }

        // Reset the audio time if the sound is still playing
        audio.currentTime = 0;

        audio.play().catch((e) => console.error(`Error playing sound: ${e}`));
    }
}
  
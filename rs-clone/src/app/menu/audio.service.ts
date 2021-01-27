import { Inject, Injectable } from '@angular/core';
import { globalProps } from './globalprops';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  audioList: Array<HTMLAudioElement> = [];
  constructor(
  ) {
    this.audioList[0] = new Audio(`assets/audio/menu/bg.mp3`);
    this.audioList[1] = new Audio(`assets/audio/menu/tap.wav`);
    this.audioList[0].onended = () => {
      this.audioList[0].play();
    }
  }

  playLink() {
    if (globalProps.options.sound) {
      this.audioList[1].currentTime = 0;
      this.audioList[1].play();
    }
  }

  playBg() {
     if (globalProps.options.sound) this.audioList[0].play();
  }

  pauseBg() {
    this.audioList[0].pause();
  }

  pauseAll() {
    this.audioList.forEach(el => {
      el.currentTime = 0;
      el.pause();
    })
  }

  setVolume() {
    this.audioList.forEach(el => {
      el.volume = globalProps.options.volume;
    })
  }
}

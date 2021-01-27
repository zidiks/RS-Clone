import { Inject, Injectable } from '@angular/core';
import { globalProps } from '../menu/globalprops';
import { States, STATES_TOKEN } from './game.component';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  // gameBachground: HTMLAudioElement;
  // coinSound: HTMLAudioElement;
  // deathSound: HTMLAudioElement;
  // jumpSound: HTMLAudioElement;
  // rollSound: HTMLAudioElement;
  // sideTrainSound: HTMLAudioElement;

  audioList: Array<HTMLAudioElement> = [];
  constructor(
    //@Inject(STATES_TOKEN) public STATES_TOKEN: States
  ) {
    this.audioList[0] = new Audio(`assets/audio/background.mp3`);
    this.audioList[0].onended = () => {
      this.audioList[0].play();
    }
    this.audioList[1] = new Audio(`assets/audio/coin.wav`);
    this.audioList[2] = new Audio(`assets/audio/death.wav`);
    this.audioList[3] = new Audio(`assets/audio/jump.wav`);
    this.audioList[4] = new Audio(`assets/audio/roll.wav`);
    this.audioList[5] = new Audio(`assets/audio/side-train.wav`);
  }

  sideTrainPlay() {
    if (globalProps.options.sound) {
      this.audioList[5].currentTime = 0;
      this.audioList[5].play();
    }
  }

  deathPlay() {
    if (globalProps.options.sound) this.audioList[2].play()
  }

  rollPlay() {
    if (globalProps.options.sound) {
      this.audioList[4].currentTime = 0;
      setTimeout(() => {
        this.audioList[4].play();
      }, 100);
    }
  }

  jumpPlay() {
    if (globalProps.options.sound) {
      this.audioList[3].currentTime = 0;
      this.audioList[3].play();
    }
  }

  coinPlay() {
    if (globalProps.options.sound) {
      this.audioList[1].currentTime = 0;
      this.audioList[1].play();
    }
  }

  playBackground() {
    if (globalProps.options.sound) this.audioList[0].play();
  }

  pauseBackground() {
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

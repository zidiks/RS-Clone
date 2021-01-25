import { Inject, Injectable } from '@angular/core';
import { States, STATES_TOKEN } from './game.component';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  gameBachground: HTMLAudioElement;
  coinSound: HTMLAudioElement;
  deathSound: HTMLAudioElement;
  jumpSound: HTMLAudioElement;
  rollSound: HTMLAudioElement;
  sideTrainSound: HTMLAudioElement;

  constructor(
    //@Inject(STATES_TOKEN) public STATES_TOKEN: States
  ) {
    this.gameBachground = new Audio(`assets/audio/background.mp3`);
    this.gameBachground.onended = () => {
      this.gameBachground.play();
    }
    this.coinSound = new Audio(`assets/audio/coin.wav`);
    this.deathSound = new Audio(`assets/audio/death.wav`);
    this.jumpSound = new Audio(`assets/audio/jump.wav`);
    this.rollSound = new Audio(`assets/audio/roll.wav`);
    this.sideTrainSound = new Audio(`assets/audio/side-train.wav`);
  }

  sideTrainPlay() {
    this.sideTrainSound.currentTime = 0;
    this.sideTrainSound.play();
  }

  deathPlay() {
    this.deathSound.play()
  }

  rollPlay() {
    this.rollSound.currentTime = 0;
    setTimeout(() => {
      this.rollSound.play();
    }, 100);
  }

  jumpPlay() {
    this.jumpSound.currentTime = 0;
    this.jumpSound.play();
  }

  coinPlay() {
    this.coinSound.currentTime = 0;
    this.coinSound.play();
  }

  playBackground() {
    //this.gameBachground.play();
  }

  pauseBackground() {
    this.gameBachground.pause();
  }
}

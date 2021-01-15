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

  constructor(
    //@Inject(STATES_TOKEN) public STATES_TOKEN: States
  ) {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }
    this.gameBachground = new Audio(`assets/audio/background.mp3`);
    this.gameBachground.onended = () => {
      this.gameBachground.play();
    }
    this.coinSound = new Audio(`assets/audio/coin.wav`);
    this.deathSound = new Audio(`assets/audio/death.wav`);
    this.jumpSound = new Audio(`assets/audio/jump.wav`);
    this.rollSound = new Audio(`assets/audio/roll.wav`);
  }

  deathPlay() {
    this.deathSound.play()
  }

  rollPlay() {
    this.rollSound.currentTime = 0;
    this.rollSound.play();
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
    this.gameBachground.play();
  }

  pauseBackground() {
    this.gameBachground.pause();
  }
}

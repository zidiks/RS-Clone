import { Inject, Injectable } from '@angular/core';
import { Animations, States, STATES_TOKEN } from './game.component';
import { AnimationService } from './animation.service';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class EndGameService {
  endGame: HTMLDivElement;
  audio: AudioService;
  states: any;
  animationManager: AnimationService;

  constructor(
    DOMel: HTMLDivElement,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States,
    audio: AudioService,
    animationManager: AnimationService
  ) { 
    this.endGame = DOMel;
    this.audio = audio;
    this.states = STATES_TOKEN;
    this.animationManager = animationManager;
  }

  endFunc() {
    this.endGame.style.display = 'flex';
    this.endGame.textContent = 'GAME OVER!';
    this.endGame.style.color = 'red';
    this.audio.pauseBackground();
    this.audio.deathPlay();
    this.states.play = false;
    this.states.end = true;
    setTimeout(() => {
      this.animationManager.changeAnimationTo('hit');
    }, 10);
    setTimeout(() => {
      this.states.animation = false;
    }, 710);
  }
}
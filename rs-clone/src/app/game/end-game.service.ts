import { Inject, Injectable } from '@angular/core';
import { Animations, States, STATES_TOKEN } from './game.component';
import { AnimationService } from './animation.service';

@Injectable({
  providedIn: 'root'
})
export class EndGameService {
  endGame: HTMLDivElement;
  audio: HTMLAudioElement;
  states: any;
  animationManager: AnimationService;

  constructor(
    DOMel: HTMLDivElement,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States,
    audio: HTMLAudioElement,
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
    this.audio.pause();
    this.states.play = false;
    this.states.end = true;
    this.animationManager.changeAnimationTo('hit');
    setTimeout(() => {
      this.states.animation = false;
    }, 700);
  }
}

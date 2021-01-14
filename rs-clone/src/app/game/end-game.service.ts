import { Injectable } from '@angular/core';
import { States } from './game.component';


@Injectable({
  providedIn: 'root'
})
export class EndGameService {
  endGame: HTMLDivElement;
  audio: any;
  states: States;

  constructor(
    DOMel: HTMLDivElement,
    states: States,
    audio: any
  ) { 
    this.endGame = DOMel;
    this.audio = audio;
    this.states = states;
  }

  endFunc() {
    this.endGame.style.display = 'flex';
    this.endGame.textContent = 'GAME OVER!';
    this.endGame.style.color = 'red';
    this.audio.pause();
    this.states.play = false;
    this.states.end = true;
  }
}

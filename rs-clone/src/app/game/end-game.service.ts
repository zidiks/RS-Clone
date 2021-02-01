import {Router} from '@angular/router';
import { Inject, Injectable } from '@angular/core';
import { Animations, States, STATES_TOKEN } from './game.component';
import { AnimationService } from './animation.service';
import { AudioService } from './audio.service';
import { globalProps } from '../menu/globalprops';
import { UserService } from '../menu/user.service';
@Injectable({
  providedIn: 'root'
})
export class EndGameService {
  endGame: HTMLDivElement;
  audio: AudioService;
  states: any;
  animationManager: AnimationService;

  constructor(
    public route: Router,
    DOMel: HTMLDivElement,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States,
    audio: AudioService,
    animationManager: AnimationService,
    public userManager: UserService
  ) {
    this.endGame = DOMel;
    this.audio = audio;
    this.states = STATES_TOKEN;
    this.animationManager = animationManager;
  }

  endFunc(name: string = 'hit') {
    if (name === 'hole') {
      this.states.hole = true;
      setTimeout(() => {
        this.audio.holePlay();
      }, 200);
    } else {
      this.audio.deathPlay();
    }
    this.endGame.style.display = 'flex';
    this.endGame.style.background = 'url("../../assets/UI/stop.png") center center no-repeat';
    this.audio.pauseBackground();
    this.states.play = false;
    this.states.end = true;
    setTimeout(() => {
      this.animationManager.changeAnimationTo(name);
    }, 10);
    this.userManager.setCoins(globalProps.coins + this.states.coins);
    if (globalProps.highScore < this.states.score )  {
      this.userManager.setScore(Math.round(this.states.score));
      this.userManager.setResult(Math.round(this.states.score));
    }
    setTimeout(() => {
      this.route.navigate(['end-stats']);
    }, 3000);
  }
}

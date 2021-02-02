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
  keyRightHandler: any;
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
    this.endGame.style.background = 'url("../../assets/UI/stop.png") top center no-repeat';
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
      const statWrapper = document.createElement("div");
      statWrapper.classList.add("stat-wrapper");
      this.endGame.appendChild(statWrapper);

      const stat = document.createElement("div");
      stat.className = "end-stat";
      statWrapper.appendChild(stat);

      const resultWrapper = document.createElement("div");
      resultWrapper.classList.add("result-wrapper");

      const coinWrapper = document.createElement("div");
      coinWrapper.classList.add("result-wrapper");
      const coin = document.createElement("div");
      coin.classList.add("coin-count");
      coinWrapper.appendChild(coin);

      coin.textContent = `Your got ${this.states.coins} coins`;
      const coinLogo = document.createElement("div");

      const crownWrapper = document.createElement("div");
      const crownCount = document.createElement("div");
      crownCount.classList.add("crown-wrapper");
      let { score } = this.states;
      let count:any = Math.round(score);
      crownCount.textContent = `Your score is ${count} miles`;
      const crownLogo = document.createElement("div");

      const btnWrapper = document.createElement("div");
      btnWrapper.classList.add("btn-wrapper");
      const newGame = document.createElement("div");
      newGame.classList.add("end-game-btn");
      newGame.textContent = "Restart";
      newGame.addEventListener("click", () => {
        this.route.navigateByUrl('/loader', { skipLocationChange: true }).then(() => {
        this.route.navigate(['/game']);
      });
      })

      const about = document.createElement("div");
      about.classList.add("end-game-btn");
      about.textContent = "Menu";
      about.addEventListener("click", () => {
        this.route.navigate(['/']);
      })

      stat.appendChild(resultWrapper);
      stat.appendChild(btnWrapper);

      resultWrapper.append(coinWrapper, crownWrapper);
      coinWrapper.append(coin, coinLogo);
      crownWrapper.append(crownCount, crownLogo);

      btnWrapper.append(newGame, about);
    }, 500);
  }
}


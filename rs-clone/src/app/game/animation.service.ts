import { Inject, Injectable } from '@angular/core';
import { last } from 'rxjs/operators';
import { States, STATES_TOKEN, Animations, ANIMATIONS_TOKEN } from './game.component';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  currentAnimation: any;
  playerAnimations: THREE.AnimationAction[];
  lastAnimation: any;
  constructor(
    @Inject(ANIMATIONS_TOKEN) public ANIMATIONS_TOKEN: Animations,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States,
  ) {
    this.playerAnimations = ANIMATIONS_TOKEN.playerAnimations;
   }

  changeAnimationTo(name: string) {
     if (name !== this.lastAnimation) {
      if (this.currentAnimation !== undefined) {
        this.currentAnimation.fadeOut(0.3);
       } else {
        this.currentAnimation = this.playerAnimations[3];
        this.currentAnimation.fadeOut(0.3);
       }
      switch (name) {
        case 'run':
          this.currentAnimation = this.playerAnimations[0];
          break;
        case 'roll':
          this.currentAnimation = this.playerAnimations[1];
          break;
        case 'hit':
          this.currentAnimation = this.playerAnimations[2];
          break;
        case 'jump':
          this.currentAnimation = this.playerAnimations[4];
          break;
        default:
          this.currentAnimation = this.playerAnimations[3];
          break;
      }
      this.currentAnimation.reset();
      this.currentAnimation.fadeIn(this.lastAnimation === 'jump' ? 0.1 : 0.3);
      this.currentAnimation.play();
      this.lastAnimation = name;
     }
  }
}

import { Inject, Injectable } from '@angular/core';
import { States, STATES_TOKEN, Animations, ANIMATIONS_TOKEN } from './game.component';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  currentAnimation: any;
  playerAnimations: THREE.AnimationAction[];
  constructor(
    @Inject(ANIMATIONS_TOKEN) public ANIMATIONS_TOKEN: Animations,
    @Inject(STATES_TOKEN) public STATES_TOKEN: States
  ) {
    this.playerAnimations = ANIMATIONS_TOKEN.playerAnimations;
   }

  changeAnimationTo(name: string) {
     if (this.currentAnimation !== undefined) {
      this.currentAnimation.stop();
      this.currentAnimation.reset();
     } else {
      this.currentAnimation = this.playerAnimations[3];
      this.currentAnimation.stop();
      this.currentAnimation.reset();
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
      case 'died':
        this.currentAnimation = this.playerAnimations[4];
        break;
      default:
        this.currentAnimation = this.playerAnimations[3];
        break;
    }
    this.currentAnimation.play();
  }
}

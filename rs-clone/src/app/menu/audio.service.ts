import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  menuBachground: HTMLAudioElement;
  menuLink: HTMLAudioElement;

  constructor(
  ) {
    this.menuBachground = new Audio(`assets/audio/menu/bg.mp3`);
    this.menuLink = new Audio(`assets/audio/menu/tap.wav`);
    this.menuBachground.onended = () => {
      this.menuBachground.play();
    }
  }

  playLink() {
    this.menuLink.currentTime = 0;
    this.menuLink.play();
  }

  playBg() {
    this.menuBachground.play();
  }

  pauseBg() {
    this.menuBachground.pause();
  }
}

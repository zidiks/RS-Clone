import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadObserverService {
  states: any;
  constructor(
  ) { }

  setStates(states: any) {
    this.states = states;
    this.start();
  }

  activatePoint(value: number) {
    this.states.loadProgress += value;
  }

  start() {
    const observer = setInterval(() => {
      if (this.states.loadProgress >= 100) {
       setTimeout(() => {
        this.states.loaded = true;
       }, 1500);
        clearInterval(observer);
      }
    }, 150)
  }
}

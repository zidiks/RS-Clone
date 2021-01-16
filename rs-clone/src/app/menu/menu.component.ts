import { Component, OnInit } from '@angular/core';
import { Animations, States, STATES_TOKEN } from '../game/game.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
// console.log(STATES_TOKEN)
// if (States.play === false) {
//   console.log('tut')
// }
// export function mainMenu() {
//   const wrapper = document.createElement("div");
//   wrapper.classList.add("wrapper");
//   document.body.appendChild(wrapper);
// }

// mainMenu()

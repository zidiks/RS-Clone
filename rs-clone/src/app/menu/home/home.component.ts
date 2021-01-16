import { Component, OnInit } from '@angular/core';
import { audioManager} from '../menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('menu-active-link');
      if(e.key == 'ArrowDown'){
        if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
      }
      if(e.key == 'ArrowUp'){
        if (this.activeLink - 1 < 0) this.activeLink = 3; else this.activeLink--;
      }
      this.menuLinks[this.activeLink].classList.add('menu-active-link');
      audioManager.playLink();
      } else {
        if(e.key == 'Enter'){
          if (this.activeLink === 0) audioManager.pauseBg();
          this.menuLinks[this.activeLink].click();
        }
      }
    }
  }
  constructor() {
    
   }

  ngOnInit(): void {
    const domName= <HTMLDivElement>document.getElementById('p-name');
    domName.textContent = JSON.parse(localStorage.getItem('user') || '{}').displayName;
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('menu-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }

}

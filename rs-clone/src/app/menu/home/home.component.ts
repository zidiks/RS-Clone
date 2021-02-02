import { Component, OnInit } from '@angular/core';
import { audioManager, MenuComponent} from '../menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  linksBox: any;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('menu-active-link');
        if(e.key == 'ArrowDown'){
          if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
        }
        if(e.key == 'ArrowUp'){
          if (this.activeLink - 1 < 0) this.activeLink = this.menuLinks.length - 1; else this.activeLink--;
        }
        this.menuLinks[this.activeLink].classList.add('menu-active-link');
        audioManager.playLink();
      } else if(e.key == 'Enter') {
          this.menuLinks[this.activeLink].click();
      }
    }
  }
  constructor(
    public AllMenu: MenuComponent
  ) {
    
   }

  ngOnInit(): void {
    this.linksBox = <HTMLDivElement>document.getElementById('menu-links');
    const domName= <HTMLDivElement>document.getElementById('p-name');
    const playerName = this.AllMenu.user?.displayName || 'No Name';
    console.log(playerName);
    //if (playerName !== null) domName.textContent = playerName;
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('menu-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }

}

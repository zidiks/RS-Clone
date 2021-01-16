import { Component, OnInit } from '@angular/core';
import { audioManager} from '../menu.component';


@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('me-active-link');
      if(e.key == 'ArrowDown'){
        if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
      }
      if(e.key == 'ArrowUp'){
        if (this.activeLink - 1 < 0) this.activeLink = this.menuLinks.length - 1; else this.activeLink--;
      }
      this.menuLinks[this.activeLink].classList.add('me-active-link');
      audioManager.playLink();
      } else {
        if(e.key == 'Enter'){
          this.menuLinks[this.activeLink].click();
        }
      }
    }
  }
  constructor() { }

  ngOnInit(): void {
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('me-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }

}

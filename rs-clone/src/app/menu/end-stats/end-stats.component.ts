import { Component, OnInit } from '@angular/core';
import { audioManager } from '../menu.component';

@Component({
  selector: 'app-end-stats',
  templateUrl: './end-stats.component.html',
  styleUrls: ['./end-stats.component.scss']
})
export class EndStatsComponent implements OnInit {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  linksBox: any;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('end-stats-active-link');
        if(e.key == 'ArrowDown'){
          if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
        }
        if(e.key == 'ArrowUp'){
          if (this.activeLink - 1 < 0) this.activeLink = 4; else this.activeLink--;
        }
        this.menuLinks[this.activeLink].classList.add('end-stats-active-link');
        audioManager.playLink();
      } else if(e.key == 'Enter') {
          this.menuLinks[this.activeLink].click();
      }
    }
  }
  constructor(
  ) {
    
   }

  ngOnInit(): void {
    this.linksBox = <HTMLDivElement>document.getElementById('end-stats-links');
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('end-stats-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }
}

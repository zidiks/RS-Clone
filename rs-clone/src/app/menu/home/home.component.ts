import { Component, OnInit } from '@angular/core';
import { audioManager} from '../menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor() {
    
   }

  ngOnInit(): void {
    const menuLinks: HTMLDListElement[] = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('menu-link'));
    console.log(menuLinks);
    let activeLink = 0;


    document.addEventListener('keydown', (e) => {
      console.log(e);
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        menuLinks[activeLink].classList.remove('menu-active-link');
      if(e.key == 'ArrowDown'){
        if (activeLink + 1 > menuLinks.length - 1) activeLink = 0; else activeLink++;
      }
      if(e.key == 'ArrowUp'){
        if (activeLink - 1 < 0) activeLink = 3; else activeLink--;
      }
      menuLinks[activeLink].classList.add('menu-active-link');
      audioManager.playLink();
      } else {
        if(e.key == 'Enter'){
          if (activeLink === 0) audioManager.pauseBg();
          menuLinks[activeLink].click();
        }
      }
      
    }, false);
  }

}

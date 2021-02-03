import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Leader } from 'src/app/user';
import { audioManager } from '../menu.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  linksBox: any;
  leadersData: any;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('leaders-active-link');
        if(e.key == 'ArrowDown'){
          if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
        }
        if(e.key == 'ArrowUp'){
          if (this.activeLink - 1 < 0) this.activeLink = this.menuLinks.length - 1; else this.activeLink--;
        }
        this.menuLinks[this.activeLink].classList.add('leaders-active-link');
        audioManager.playLink();
      } else if(e.key == 'Enter') {
          this.menuLinks[this.activeLink].click();
      }
    }
  }
  constructor(
    public userManager: UserService
  ) {
    userManager.getLeaders(10).subscribe(data => {
      this.leadersData = data;
    });
   }

  ngOnInit(): void {
    this.linksBox = <HTMLDivElement>document.getElementById('leaders-links');
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('leaders-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }
}

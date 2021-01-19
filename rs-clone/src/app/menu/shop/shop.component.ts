import { Component, OnDestroy, OnInit } from '@angular/core';
import { audioManager} from '../menu.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  shopSkins = [
    {
      name: 'woodcutter',
      price: 0,
      model: 'assets/player.fbx',
      color: 'orange'
    },
    {
      name: 'panda',
      price: 1500,
      model: 'assets/player.fbx',
      color: 'green'
    }
  ];
  currentSkin: number = 0;
  activeSkin: number = 0;
  boughtSkins: Array<Object> = [0];
  skinName: any;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('shop-active-link');
      if(e.key == 'ArrowDown'){
        if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
      }
      if(e.key == 'ArrowUp'){
        if (this.activeLink - 1 < 0) this.activeLink = this.menuLinks.length - 1; else this.activeLink--;
      }
      this.menuLinks[this.activeLink].classList.add('shop-active-link');
      audioManager.playLink();
      } else {
        if(e.key == 'Enter'){
          this.menuLinks[this.activeLink].click();
        }
      }
    }
  }
  nextSkin() {
    if (this.currentSkin + 1 > this.shopSkins.length - 1) this.currentSkin = 0; else this.currentSkin++;
    this.renderCurrSkin();
  }

  prevSkin() {
    if (this.currentSkin - 1 < 0) this.currentSkin = this.shopSkins.length - 1; else this.currentSkin--;
    this.renderCurrSkin();
  }

  renderCurrSkin() {
    this.skinName.style.color = this.shopSkins[this.currentSkin].color;
  }

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.skinName = <HTMLDivElement>document.getElementById('skin-name');
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('shop-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/alert.service';
import { globalProps, saveOptions } from '../globalprops';
import { audioManager} from '../menu.component';

interface domOptions {
  [key: string]: HTMLDivElement;
}

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit, OnDestroy {
  domOptions: domOptions = {};
  menuLinks: HTMLDListElement[] | undefined;
  activeLink = 0;
  GP = globalProps;
  moveMenu = (e: any) => {
    if (this.menuLinks) {
      if (e.key == 'ArrowDown' || e.key == 'ArrowUp') {
        this.menuLinks[this.activeLink].classList.remove('options-active-link');
      if(e.key == 'ArrowDown'){
        if (this.activeLink + 1 > this.menuLinks.length - 1) this.activeLink = 0; else this.activeLink++;
      }
      if(e.key == 'ArrowUp'){
        if (this.activeLink - 1 < 0) this.activeLink = this.menuLinks.length - 1; else this.activeLink--;
      }
      this.menuLinks[this.activeLink].classList.add('options-active-link');
      audioManager.playLink();
      } else if ((this.activeLink === 4 || this.activeLink === 1) && (e.key == 'ArrowRight' || e.key == 'ArrowLeft')) {
        if (this.activeLink === 4) {
          if (e.key == 'ArrowRight') {
            if (globalProps.options.quality + 0.1 > 1) globalProps.options.quality = 0.1; else globalProps.options.quality = ((globalProps.options.quality * 100) + 10) / 100;
            saveOptions();
          }
          if (e.key == 'ArrowLeft') {
            if (globalProps.options.quality - 0.1 < 0.1) globalProps.options.quality = 1; else globalProps.options.quality = ((globalProps.options.quality * 100) - 10) / 100;
            saveOptions();
          }
        }
        if (this.activeLink === 1) {
          if (e.key == 'ArrowRight') {
            if (globalProps.options.volume + 0.1 > 1) globalProps.options.volume = 0; else globalProps.options.volume = ((globalProps.options.volume * 100) + 10) / 100;
            saveOptions();
            audioManager.setVolume();
          }
          if (e.key == 'ArrowLeft') {
            if (globalProps.options.volume - 0.1 < 0) globalProps.options.volume = 1; else globalProps.options.volume = ((globalProps.options.volume * 100) - 10) / 100;
            saveOptions();
            audioManager.setVolume();
          }
        }
      } else if (this.activeLink !== 5 && (e.key == 'ArrowRight' || e.key == 'ArrowLeft')) {
        this.menuLinks[this.activeLink].click();
      } else {
        if(e.key == 'Enter'){
          this.menuLinks[this.activeLink].click();
        }
      }
    }
  };

  constructor(
    public alertManager: AlertService
  ) {
  }

  changeShadows() {
    globalProps.options.shadows = !globalProps.options.shadows;
    if (globalProps.options.shadows) {
      this.domOptions.shadows.textContent = 'on';
    } else {
      this.domOptions.shadows.textContent = 'off';
    }
    saveOptions();
  }

  changeAntialiasing() {
    globalProps.options.antialiasing = !globalProps.options.antialiasing;
    if (globalProps.options.antialiasing) {
      this.domOptions.antialiasing.textContent = 'on';
    } else {
      this.domOptions.antialiasing.textContent = 'off';
    }
    saveOptions();
  }

  changeSound() {
    globalProps.options.sound = !globalProps.options.sound;
    if (globalProps.options.sound) {
      this.domOptions.sound.textContent = 'on';
      audioManager.playBg();
    } else {
      this.domOptions.sound.textContent = 'off';
      audioManager.pauseAll();
    }
    saveOptions();
  }

  ngOnInit(): void {
    this.domOptions.shadows = <HTMLDivElement>document.getElementById('o-shadows');
    if (globalProps.options.shadows) {
      this.domOptions.shadows.textContent = 'on';
    } else {
      this.domOptions.shadows.textContent = 'off';
    }
    this.domOptions.antialiasing = <HTMLDivElement>document.getElementById('o-antialiasing');
    if (globalProps.options.antialiasing) {
      this.domOptions.antialiasing.textContent = 'on';
    } else {
      this.domOptions.antialiasing.textContent = 'off';
    }
    this.domOptions.sound = <HTMLDivElement>document.getElementById('o-sound');
    if (globalProps.options.sound) {
      this.domOptions.sound.textContent = 'on';
    } else {
      this.domOptions.sound.textContent = 'off';
    }
    this.menuLinks = Array.prototype.slice.call(<HTMLDivElement><unknown>document.getElementsByClassName('options-link'));
    document.addEventListener('keydown', this.moveMenu, false);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.moveMenu, false);
  }

}

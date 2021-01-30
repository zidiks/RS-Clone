import { ChangeDetectorRef } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { globalProps } from './menu/globalprops';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rs-clone';
  gP = globalProps;
  imgs = globalProps.loadImg;
  constructor(
  ) {
  }

  ngOnInit() {
    this.pload(
      "assets/UI/loading-screen.png");
  }
  
  pload(...args: any[]):void {
    for (var i = 0; i < args.length; i++) {
      this.imgs[i] = new Image();
      this.imgs[i].src = args[i];
      console.log('loaded: ' + args[i]);
    }
  }
}

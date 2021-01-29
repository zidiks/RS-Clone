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
  constructor(
  ) {
  }

  ngOnInit() {
  }
}

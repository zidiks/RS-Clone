import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MeComponent } from './me/me.component';



@NgModule({
  declarations: [HomeComponent, MeComponent],
  imports: [
    CommonModule
  ]
})
export class MenuModule { }

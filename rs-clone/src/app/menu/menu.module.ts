import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MeComponent } from './me/me.component';
import { ShopComponent } from './shop/shop.component';
import { OptionsComponent } from './options/options.component';



@NgModule({
  declarations: [HomeComponent, MeComponent, ShopComponent, OptionsComponent],
  imports: [
    CommonModule
  ]
})
export class MenuModule { }

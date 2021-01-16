import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './menu/home/home.component';
import { MenuComponent } from './menu/menu.component';

const itemRoutes: Routes = [
  { path: '', component: HomeComponent}
];

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: '', component: MenuComponent, children: itemRoutes }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

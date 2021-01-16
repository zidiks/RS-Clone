import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { SetComponent } from './menu/setting/set.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: '', component: MenuComponent },
  { path: 'set', component: SetComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

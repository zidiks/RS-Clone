import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './menu/home/home.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoaderComponent } from './welcome/loader.component';
import { AuthService } from './auth.service';
import { MeComponent } from './menu/me/me.component';
import { ShopComponent } from './menu/shop/shop.component';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { OptionsComponent } from './menu/options/options.component';
import { VerifyComponent } from './verify/verify.component';
import { LeaderBoardComponent } from './menu/leader-board/leader-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    WelcomeComponent,
    LoaderComponent,
    MeComponent,
    ShopComponent,
    NotfoundComponent,
    OptionsComponent,
    VerifyComponent,
    LeaderBoardComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    RouterModule
  ],
  providers: [AuthService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }

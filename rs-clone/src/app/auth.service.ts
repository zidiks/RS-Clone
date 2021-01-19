import { Injectable, NgZone } from '@angular/core';
import { User } from "./user";
import firebase from 'firebase/app'
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { audioManager } from './menu/menu.component';
import { globalProps } from './menu/globalprops';
import { UserService } from './menu/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', '');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    })
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SetUserData(result.user);
        window.alert('ready!');
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let userData: User;
    let coins = 0;
    let highScore = 0;
    userRef.ref.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        coins = data.coins;
        highScore = data.highScore;
      }
    }).then(() => {
      userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: true,
        coins: coins,
        highScore: highScore
      }
    }).then(() => {
      userRef.set(userData, {
        merge: true
      })
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (user.uid && user !== null && user.emailVerified !== false) ? true : false;
  }

   // Sign in with Google
   GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

   // Sign in with Google
   GithubAuth() {
    return this.AuthLogin(new firebase.auth.GithubAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
      this.SetUserData(result.user);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 300);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      audioManager.pauseBg();
      this.router.navigate(['../../login']);
    });
  }
}

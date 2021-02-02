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
        if (result.user)  {
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${result.user.uid}`);
          const userData = Object.assign({}, result.user);
          userRef.ref.get().then(doc => {
            if (doc.exists) {
              const data = doc.data();
              userData.displayName = data.displayName;
              console.log(userData);
              this.SetUserData(userData);
              setTimeout(() => {
                this.router.navigate(['']);
              }, 300);
            }
          })
        }        
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email: string, password: string, displayName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        if (result.user) {
          this.SendVerificationMail();
          const userData = Object.assign({}, result.user);
          userData.displayName = displayName;
          this.SetUserData(userData);
        }
      }).catch((error) => {
        window.alert(error.message)
      })
  }


    // Send email verfificaiton when new user sign up
    SendVerificationMail() {
      return this.afAuth.currentUser.then(u => { if (u) u.sendEmailVerification() })
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
    }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let userData: User;
    let coins = 1500;
    let highScore = 0;
    let boughtSkins = [0];
    let activeSkin = 0;
    userRef.ref.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        coins = data.coins;
        highScore = data.highScore;
        boughtSkins = data.boughtSkins;
        activeSkin = data.activeSkin;
      }
    }).then(() => {
      userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName == null ? user.email : user.displayName,
        emailVerified: user.emailVerified,
        coins: coins,
        highScore: highScore,
        boughtSkins: boughtSkins,
        activeSkin: activeSkin
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
    return (user.uid && user !== null) ? true : false;
  }

  isVerified() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    let verified = false;
    userRef.ref.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        verified = doc.data().emailVerified; 
        console.log('verif: ', data);
      }
    })
    return (verified === false) ? false : true;
  }

  setVerifiedStatus() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    userRef.ref.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        data.emailVerified = true;
        this.SetUserData(data);
        user.emailVerified = true;
        localStorage.setItem('user', JSON.stringify(user));
      }
    })
  }

   // Sign in with Google
   GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

   // Sign in with GitHub
   GithubAuth() {
    return this.AuthLogin(new firebase.auth.GithubAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
      if (result.user?.emailVerified) {
        setTimeout(() => {
          this.router.navigate(['']);
        }, 300);
      } else {
        this.SendVerificationMail();
      }
      this.SetUserData(result.user);
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

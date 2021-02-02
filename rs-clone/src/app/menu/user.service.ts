import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Leader, User } from '../user';
import { map, take } from 'rxjs/operators';
import { globalProps } from './globalprops';
import { AlertService } from '../alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public usersCollection: AngularFirestoreCollection<User>;
  constructor(
    public afs: AngularFirestore,
    public alertManager: AlertService
  ) {
    this.usersCollection = afs.collection<User>('users');
  }

  getUser(id: string = JSON.parse(localStorage.getItem('user') || '{ }').uid): Observable<User | undefined> {
    return this.usersCollection.doc<User>(id).valueChanges().pipe(
      map(user => {
        if (user) user.id = id;
        return user;
      })
    );
  }

  getLeaders(size: number) {
     return  this.afs.collection('leaders-board', ref => ref.orderBy('score', 'desc').limit(size)).snapshotChanges().pipe(
      map(leaders => leaders.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...(data as object) };
      }))
    );
  }

  setResult(newScore: number) {
    const user = JSON.parse(localStorage.getItem('user') || '{ }');
    const uid = user.uid;
    const name = user.displayName;
    const data: Leader = {
      uid: uid,
      score: newScore,
      name: name
    }
    this.afs.doc(`leaders-board/${uid}`)
  .update(data)
  .then(() => {

  })
  .catch((error) => {
    this.afs.doc(`leaders-board/${uid}`)
      .set(data);
  });
  }

  setCoins(value: number) {
    const id:string = JSON.parse(localStorage.getItem('user') || '{ }').uid;
    this.usersCollection.doc<User>(id).update({ coins: value });
  }

  setScore(value: number) {
    const id:string = JSON.parse(localStorage.getItem('user') || '{ }').uid;
    this.usersCollection.doc<User>(id).update({ highScore: value });
  }

  setBuy(value: number, price: number) {
    if (globalProps.coins >= price) {
      const id:string = JSON.parse(localStorage.getItem('user') || '{ }').uid;
      globalProps.boughtSkins.push(value);
      this.usersCollection.doc<User>(id).update({ coins: globalProps.coins - price });
      this.usersCollection.doc<User>(id).update({ boughtSkins: globalProps.boughtSkins });
      this.alertManager.showAlert('You have purchased a new skin!', 
      {
        cb: () => {
          this.alertManager.hideAlert();
        },
        label: 'OK'
      })
    } else {
      this.alertManager.showAlert('Need more coins :(',
      {
        cb: () => {
          this.alertManager.hideAlert();
        },
        label: 'OK'
      })
    }
  }

  setActive(value: number) {
    const id:string = JSON.parse(localStorage.getItem('user') || '{ }').uid;
    this.usersCollection.doc<User>(id).update({ activeSkin: value });
  }
}

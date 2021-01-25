import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../user';
import { map, take } from 'rxjs/operators';
import { globalProps } from './globalprops';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public usersCollection: AngularFirestoreCollection<User>;
  constructor(
    public afs: AngularFirestore
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
      console.log(globalProps.boughtSkins);
      this.usersCollection.doc<User>(id).update({ coins: globalProps.coins - price });
      this.usersCollection.doc<User>(id).update({ boughtSkins: globalProps.boughtSkins });
      alert('Еу! Новый скин :)');
    } else {
      alert('Не хватает денег :(');
    }
  }

  setActive(value: number) {
    const id:string = JSON.parse(localStorage.getItem('user') || '{ }').uid;
    this.usersCollection.doc<User>(id).update({ activeSkin: value });
  }
}

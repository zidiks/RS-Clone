import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../user';
import { map, take } from 'rxjs/operators';

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
}

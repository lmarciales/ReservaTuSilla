import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore: AngularFirestore) {
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.authState.subscribe((user) => {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getUsers() {
    return this.angularFirestore.collection('users').snapshotChanges();
  }
}

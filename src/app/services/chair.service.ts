import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChairService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  getChairs() {
    return this.angularFirestore.collection('chairs').snapshotChanges();
  }

  createChair(chair) {
    return this.angularFirestore.collection('chairs').add(chair);
  }

  updateChair(chair) {
    return this.angularFirestore.doc(`chairs/${chair.id}`).update(chair);
  }

  deleteChair(chair) {
    return this.angularFirestore.doc(`chairs/${chair.id}`).delete();
  }

}

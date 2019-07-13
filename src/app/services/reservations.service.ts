import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  constructor(private angularFirestore: AngularFirestore) {
  }

  getReservations() {
    return this.angularFirestore.collection('reservations').snapshotChanges();
  }

  createReservation(reservation) {
    return this.angularFirestore.collection('reservations').add(reservation);
  }

  updateReservation(reservation) {
    return this.angularFirestore.doc(`reservations/${reservation.id}`).update(reservation);
  }

  deleteReservation(reservation) {
    return this.angularFirestore.doc(`reservations/${reservation.id}`).delete();
  }
}

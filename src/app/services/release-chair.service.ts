import { Injectable } from '@angular/core';
import { ChairModel } from '../models/chair.model';
import { DateModel, TimeModel } from '../models/date-time.model';
import { ReservationModel } from '../models/reservation.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseChairService {

  private collectionChairs: string;
  private collectionReservations: string;

  constructor(private crudService: CrudService) {
    this.collectionChairs = 'chairs';
    this.collectionReservations = 'reservation';
  }

  private static _checkPreviousDate(currentDate: DateModel, reservationDate: DateModel) {
    return (currentDate.day > reservationDate.day && currentDate.month > reservationDate.month && currentDate.year >
      reservationDate.year) ||
      (currentDate.day > reservationDate.day && currentDate.month > reservationDate.month && currentDate.year >= reservationDate.year) ||
      (currentDate.day > reservationDate.day && currentDate.month >= reservationDate.month && currentDate.year >= reservationDate.year);
  }

  private static _checkSameDate(currentDate: DateModel, reservationDate: DateModel) {
    return (currentDate.day === reservationDate.day && currentDate.month === reservationDate.month && currentDate.year ===
      reservationDate.year);
  }

  private static _checkTime(currentTime: TimeModel, reservationTime: TimeModel) {
    return (currentTime.hour >= reservationTime.hour && currentTime.minute >= reservationTime.minute);
  }

  addReservations() {
    this.crudService.getCollection(this.collectionChairs).subscribe(res => {
      for (const chair of res) {
        const id = chair.payload.doc.id;
        const data = chair.payload.doc.data();
        const currentDate = new Date();

        // @ts-ignore
        if (data.owner !== 'free' && data.released !== false && data.systemJob !== true) {
          const reservation: ReservationModel = {
            // @ts-ignore
            userId: data.owner,
            chairId: id,
            date: {
              year: currentDate.getFullYear(),
              month: currentDate.getMonth() + 1,
              day: currentDate.getDate()
            },
            sTime: {
              hour: 0,
              minute: 0
            },
            eTime: {
              hour: 24,
              minute: 0
            }
          };

          this.createReservation(reservation);

          const chairToUpdate: ChairModel = {
            // @ts-ignore
            owner: data.owner,
            // @ts-ignore
            description: data.description,
            // @ts-ignore
            location: data.location,
            released: false,
            systemJob: true
          };

          this.updateChairReleasedState(id, chairToUpdate);
        }
      }
    });
  }

  createReservation(reservation: ReservationModel) {
    this.crudService.createDocument(this.collectionReservations, reservation).then(() => {
      console.log('Reservations updated');
    }).catch(error => {
      console.log(error);
    });
  }

  updateChairReleasedState(chairId, data) {
    this.crudService.updateDocument(this.collectionChairs, chairId, data).then(() => {
      console.log('Chairs updated');
    }).catch(error => {
      console.log(error);
    });
  }

  removeOutdatedReservations() {
    const date = new Date();
    const currentDate: DateModel = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
    const currentTime: TimeModel = {
      hour: date.getHours(),
      minute: date.getMinutes()
    };

    this.crudService.getCollection(this.collectionReservations).subscribe(res => {
      for (const reservation of res) {
        // @ts-ignore
        const reservationDate: DateModel = reservation.payload.doc.data().date;
        // @ts-ignore
        const reservationTime: TimeModel = reservation.payload.doc.data().eTime;

        if (ReleaseChairService._checkPreviousDate(currentDate, reservationDate) ||
          (ReleaseChairService._checkSameDate(currentDate, reservationDate) &&
            ReleaseChairService._checkTime(currentTime, reservationTime))) {
          this.removeReservationById(reservation.payload.doc.id);
        }
      }
    });
  }

  removeReservationById(reservationId) {
    this.crudService.deleteDocument(this.collectionReservations, reservationId).then(() => {
      console.log('Reservations updated');
    }).catch(error => {
      console.log(error);
    });
  }
}

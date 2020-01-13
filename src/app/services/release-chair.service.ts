import { Injectable } from '@angular/core';
import { DateModel, TimeModel } from '../models/date-time.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseChairService {

  private collectionReservations: string;

  constructor(private crudService: CrudService) {
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

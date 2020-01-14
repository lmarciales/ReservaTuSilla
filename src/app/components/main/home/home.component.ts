import { Component, OnInit } from '@angular/core';
import { ChairService } from '../../../services/chair.service';
import { ReservationsService } from '../../../services/reservations.service';
import { AuthService } from '../../../services/auth.service';
import { chairModel } from 'src/app/model/chair.model';
import { reserveChair } from 'src/app/model/reserveChair.model';
import { ReservationView } from 'src/app/model/reservationView.model';
import { ConfirmationModalModel } from 'src/app/models/confirmation-modal.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInfo: any;
  chairName: any;
  users: any;
  chairs: any;
  reservations: any;
  closeResult: string;
  modalProperties: ConfirmationModalModel;

  constructor(private authService: AuthService, private chairService: ChairService, private reservationService: ReservationsService) {
    this.modalProperties = {
      buttonText: 'Eliminar',
      modalText: '¿Está seguro que desea eliminar este archivo?',
      title: ''
    };
  }

  ngOnInit() {
  }

  // User functions
  getUsers() {
  }

  // Chair functions
  createChair() {
    const chair = {
      name: this.chairName,
      isReserved: false
    };
    this.chairService.createChair(chair).then(() => {
      console.log('Chair created');
    }).catch((error) => {
      console.log(error);
    });
  }

  updateChair(chair) {
    this.chairService.updateChair(chair).then(() => {
      console.log('Chair updated.');
    }).catch(error => {
      console.log(error);
    });
  }

  deleteChair(chair) {
    this.chairService.deleteChair(chair).then(() => {
      console.log('Chair deleted');
    }).catch(error => {
      console.log(error);
    });
  }

  takeChair(chair: reserveChair) {
    const reservation = {
      userId: chair.userId,
      chairId: chair.chairId
    };
    const hasReserved = this.reservations.find(r => r.userId === reservation.userId);
    console.log(hasReserved);
    if (!chair.isReserved && !hasReserved) {
      this.reservationService.createReservation(reservation).then(() => {
        console.log('Reservation created');
        this.userInfo.hasReserved = true;
        chair.isReserved = true;
        this.updateChair(chair);
      }).catch(error => {
        console.log(error);
      });
    } else {
      console.log('Can not reserve more chairs');
    }
  }

  leaveChair(reservation) {
    if (this.userInfo.uid === reservation.userId) {
      this.reservationService.deleteReservation(reservation).then(() => {
        console.log('Reservation deleted');
        this.userInfo.hasReserved = false;
        const chair = this.chairs.find(c => c.id === reservation.chairId);
        chair.isReserved = false;
        this.updateChair(chair);
      }).catch(error => {
        console.log(error);
      });
    } else {
      console.log('Can not remove reservations from others');
    }
  }
  // Open Modal
}

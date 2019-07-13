import { Component, OnInit } from '@angular/core';
import { ChairService } from '../../services/chair.service';
import { ReservationsService } from '../../services/reservations.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInfo;

  chairName;

  users;
  chairs;
  reservations;

  constructor(private userService: UserService, private chairService: ChairService, private reservationService: ReservationsService) {
  }

  ngOnInit() {
    this.userService.getCurrentUser().then((user) => {
      this.userInfo = user;
    }).catch(error => {
      console.log(error);
    });

    this.getUsers();
    this.getChairs();
    this.getReservations();
  }

  // User functions
  getUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    }, error => {
      console.log(error);
    });
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

  getChairs() {
    this.chairService.getChairs().subscribe((data) => {
      this.chairs = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    }, error => {
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

  // Reservation functions
  getReservations() {
    this.reservationService.getReservations().subscribe((data) => {
      this.reservations = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    }, error => {
      console.log(error);
    });
  }

  takeChair(chair) {
    const reservation = {
      userId: this.userInfo.uid,
      chairId: chair.id
    };

    const hasReserved = this.reservations.find(r => r.userId === reservation.userId);

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

}

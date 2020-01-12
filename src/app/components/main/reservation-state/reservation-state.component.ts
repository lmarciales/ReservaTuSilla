import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditReservationComponent } from 'src/app/components/main/edit-reservation/edit-reservation.component';
import { ReservationView } from 'src/app/model/reservationView.model';
import { ReservationModel } from 'src/app/models/reservation.model';
import { CrudService } from 'src/app/services/crud.service';
import { AlertModel } from '../../../models/alert.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservation-state',
  templateUrl: './reservation-state.component.html',
  styleUrls: ['./reservation-state.component.css']
})
export class ReservationStateComponent implements OnInit {

  @Input() information: ReservationView;

  private uid: string;

  collectionName: string;
  editable: boolean;
  public alert: AlertModel[];
  reservation: ReservationModel = {
    date: {
      day: 0,
      month: 0,
      year: 0
    },
    eTime: {
      hour: 0,
      minute: 0
    },
    sTime: {
      hour: 0,
      minute: 0
    },
    userId: '',
    chairId: ''
  };

  constructor(public dialog: MatDialog, private crudService: CrudService, private user: AuthService) {
    this.editable = false;
    this.collectionName = 'reservation';
  }

  ngOnInit() {
    this.user.currentUser.subscribe((data) => { this.uid = data.uid; });
    this.getReservations();
    // this.createReservation();
    this.deleteChair("LZsvYX9klTlbVAPbZClU");
  }

  public editReservation() {
    this.editable = true;
  }

  public openEditModal() {
    const dialogRef = this.dialog.open(EditReservationComponent, {
      width: '992px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getReservations() {
    this.crudService.getDocumentByParam(this.collectionName, '45gUQmCRxggo6GhXeJILrAZ2TU73').subscribe(reservation => {
      // @ts-ignore
      this.reservation = reservation.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      console.log(this.reservation);
    }, error => {
      this.alert = [{
        type: 'danger',
        message: 'Something went wrong: ' + error
      }];
    });
  }

  createReservation() {
    this.crudService.createDocument(this.collectionName, this.reservation).then(() => {
      this.alert = [{
        type: 'success',
        message: 'Chair created successfully!'
      }];
      console.log('bien');
    }).catch(error => {
      console.log(error);
      this.alert = [{
        type: 'danger',
        message: 'Something went wrong: ' + error
      }];
    });
  }

  // editChair(chair: ChairModel) {
  //   console.log(chair);
  //   const dialogRef = this.dialog.open(AddChairComponent, {
  //     width: '600px',
  //     data: {
  //       id: chair.id,
  //       description: chair.description,
  //       owner: chair.owner,
  //       location: chair.location
  //     }
  //   });
  //   dialogRef.componentInstance.buttonText = 'Edit chair';
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result !== undefined && result !== false) {
  //       this.crudService.updateDocument(this.collectionName, chair.id, result)
  //         .then(() => {
  //           this.alert = [{
  //             type: 'success',
  //             message: 'Chair edited successfully!'
  //           }];
  //         })
  //         .catch(error => {
  //           this.alert = [{
  //             type: 'danger',
  //             message: 'Something went wrong: ' + error
  //           }];
  //         });
  //     }
  //   });
  // }

  deleteChair(chairId) {
    // const dialogRef = this.dialog.open(ConfirmationModalComponent, {
    //   width: '600px',
    //   data: {
    //     buttonText: 'Delete',
    //     modalText: 'Are you sure that you want to delete chair?',
    //     title: 'Delete chair'
    //   }
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result !== undefined && result === true) {
    this.crudService.deleteDocument(this.collectionName, chairId)
      .then(() => {
        this.alert = [{
          type: 'success',
          message: 'Chair deleted successfully!'
        }];
      })
      .catch(error => {
        this.alert = [{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }];
      });
    // }
    // });
  }

}

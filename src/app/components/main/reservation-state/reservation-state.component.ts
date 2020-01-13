import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditReservationComponent } from 'src/app/components/main/edit-reservation/edit-reservation.component';
import { ReservationView } from 'src/app/model/reservationView.model';
import { ReservationModel } from 'src/app/models/reservation.model';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { AlertModel } from '../../../models/alert.model';
import { ChairModel } from '../../../models/chair.model';
import { ChairService } from 'src/app/services/chair.service';

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
  chairs: ChairModel[];
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

  constructor(public dialog: MatDialog, private crudService: CrudService, private user: AuthService, private chair: ChairService) {
    this.user.currentUser.subscribe((data) => { this.uid = data.uid; });
    this.editable = false;
    this.collectionName = 'reservation';
  }

  ngOnInit() {
    this.getReservations();
    this.deleteChair("TSF5C4BzzzNxcpCH0XCc");
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
    this.crudService.getDocumentByParam(this.collectionName, this.uid, 'userId').subscribe(reservation => {
      // @ts-ignore
      this.reservation = reservation.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.crudService.getDocumentByParam('chairs', this.reservation[0].chairId, 'id').subscribe((chairResponse) => {
        // @ts-ignore
        this.chairs = chairResponse.map((e) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          };
        });
        console.log(this.chairs);
      }, error => {
        this.alert = [{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }];
      });
    }, error => {
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

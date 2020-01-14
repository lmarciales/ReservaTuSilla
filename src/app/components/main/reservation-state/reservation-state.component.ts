import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditReservationComponent } from 'src/app/components/main/edit-reservation/edit-reservation.component';
import { ConfirmationModalComponent } from 'src/app/components/shared/confirmation-modal/confirmation-modal.component';
import { ReservationModel } from 'src/app/models/reservation.model';
import { AuthService } from 'src/app/services/auth.service';
import { CrudService } from 'src/app/services/crud.service';
import { AlertModel } from '../../../models/alert.model';
import { ChairModel } from '../../../models/chair.model';

@Component({
  selector: 'app-reservation-state',
  templateUrl: './reservation-state.component.html',
  styleUrls: ['./reservation-state.component.css']
})
export class ReservationStateComponent implements OnInit {

  collectionName: string;
  editable: boolean;
  chairLocation: string[];
  public alert: AlertModel[];
  reservation: ReservationModel[];
  private uid: string;

  constructor(public dialog: MatDialog, private crudService: CrudService, private user: AuthService) {
    this.user.currentUser.subscribe((data) => {
      this.uid = data.uid;
    });
    this.editable = false;
    this.collectionName = 'reservation';
    this.chairLocation = [];
    this.reservation = [];
  }

  ngOnInit() {
    this.getReservations();
  }

  public editReservation() {
    this.editable = true;
  }

  public openEditModal() {
    const dialogRefEdit = this.dialog.open(EditReservationComponent, {
      width: '992px'
    });
    dialogRefEdit.afterClosed().subscribe(result => {
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
      if (this.reservation !== undefined && this.reservation.length) {
        this.crudService.getDocument('chairs', this.reservation[0].chairId).then((chairResponse) => {
          this.chairLocation[0] = chairResponse.data() ? (chairResponse.data().location ? chairResponse.data().location : '- -') : '- -';
          this.chairLocation[1] =
            chairResponse.data() ? (chairResponse.data().description ? chairResponse.data().description : '- -') : '- -';
        }, error => {
          this.alert = [{
            type: 'danger',
            message: 'Something went wrong: ' + error
          }];
        });
      }
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

  deleteReservation(id: string, chairId: string) {
    const dialogRefDelete = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        buttonText: 'Delete',
        modalText: 'Are you sure that you want to delete chair?',
        title: 'Delete chair'
      }
    });
    dialogRefDelete.afterClosed().subscribe((result) => {
      if (result !== undefined && result === true) {
        this.crudService.deleteDocument(this.collectionName, id)
          .then(() => {
            this.crudService.getDocument('chairs', chairId).then(res => {
              if (res) {
                const response = res.data();
                const chair: ChairModel = {
                  description: response.description,
                  owner: response.owner,
                  location: response.location,
                  released: true,
                  systemJob: response.systemJob
                };
                this.crudService.updateDocument('chairs', chairId, chair).then(() => {
                  console.log('Chair updated');
                });
              }
            });
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
      }
    });
  }
}

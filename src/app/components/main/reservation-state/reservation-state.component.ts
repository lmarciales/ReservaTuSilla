import { Component, OnInit, Input } from '@angular/core';
import { ReservationView } from 'src/app/model/reservationView.model';
import { MatDialog } from '@angular/material';
import { EditReservationComponent } from 'src/app/components/main/edit-reservation/edit-reservation.component';

@Component({
  selector: 'app-reservation-state',
  templateUrl: './reservation-state.component.html',
  styleUrls: ['./reservation-state.component.css']
})
export class ReservationStateComponent implements OnInit {

  @Input() information: ReservationView;

  editable: boolean;

  constructor(public dialog: MatDialog) {
    this.editable = false;
  }

  ngOnInit() {
  }

  public editReservation() {
    this.editable = true;
    console.log('Me llaman');
  }

  public openEditModal() {
    const dialogRef = this.dialog.open(EditReservationComponent, {
      width: '992px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

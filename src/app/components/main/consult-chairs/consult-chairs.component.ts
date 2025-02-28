import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from 'src/app/components/shared/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { AlertModel } from '../../../models/alert.model';
import { ChairModel } from '../../../models/chair.model';
import { DateModel, TimeModel } from '../../../models/date-time.model';
import { ReservationModel } from '../../../models/reservation.model';
import { CrudService } from '../../../services/crud.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-consult-chairs',
  templateUrl: './consult-chairs.component.html',
  styleUrls: ['./consult-chairs.component.css']
})
export class ConsultChairsComponent implements OnInit {

  public tableHeaders = {
    description: 'Description',
    owner: 'Owned by',
    location: 'Location'
  };

  public alert: AlertModel[];
  public uid: string;
  public consultForm: FormGroup;
  public collectionName: string;
  public today: Date;
  public currentDate: DateModel;
  public startTime: TimeModel;
  public endTime: TimeModel;
  public errors: string[];
  public chairList: ChairModel[];
  public reservationList: ReservationModel[];
  public availableChairs: ChairModel[];
  private collectionChair: string;
  private collectionReservation: string;
  private reservationUser: ReservationModel;
  private reservation: ReservationModel = {
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

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private crudService: CrudService,
    public dialog: MatDialog,
    private user: AuthService) {
    this.today = new Date();
    this.currentDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    };
    this.collectionName = 'reservation';
    this.startTime = { hour: 8, minute: 0 };
    this.endTime = { hour: 9, minute: 0 };
    this.errors = utilService.errors;

    this.collectionChair = 'chairs';
    this.collectionReservation = 'reservation';

    this.chairList = [];
    this.reservationList = [];

    this.getChairsList();
    this.getReservationList();
  }

  private static _checkDates(resDay, resMonth, resYear, selDay, selMonth, selYear): boolean {
    return (resDay === selDay && resMonth === selMonth && resYear === selYear);
  }

  private static _checkTimeRanges(resSTime, resETime, selSTime, selETime): boolean {
    return ((resSTime < selSTime && resETime <= selSTime) && (resSTime < selETime && resETime < selETime) ||
      (resSTime > selSTime && resETime > selSTime) && (resSTime >= selETime && resETime > selETime)) &&
      (resSTime !== selSTime && resETime !== selETime);
  }

  ngOnInit() {
    this.user.currentUser.subscribe((data) => {
      this.uid = data.uid;
    });
    this._buildForm();
  }

  public onClick() {
    this.availableChairs = [];
    const responseForm = this.consultForm.value;
    for (const chair of this.chairList) {
      const temp: ReservationModel = this.reservationList.find(reservation => reservation.chairId === chair.id);
      if (responseForm.sTime.hour < responseForm.eTime.hour ||
        (responseForm.sTime.hour < responseForm.eTime.hour && responseForm.sTime.minute < responseForm.eTime.minute)) {
        if (temp && chair.owner === 'free') {
          if (ConsultChairsComponent._checkDates(temp.date.day, temp.date.month, temp.date.year, responseForm.date.day,
            responseForm.date.month, responseForm.date.year)) {
            if (ConsultChairsComponent._checkTimeRanges(temp.sTime.hour, temp.eTime.hour, responseForm.sTime.hour,
              responseForm.eTime.hour)) {
              this.availableChairs.push(chair);
            }
          } else {
            this.availableChairs.push(chair);
          }
        } else {
          this.availableChairs.push(chair);
        }
      }
    }
  }

  public getChairsList() {
    this.crudService.getCollection(this.collectionChair).subscribe(res => {
      // @ts-ignore
      this.chairList = res.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  public getReservationList() {
    this.crudService.getCollection(this.collectionReservation).subscribe(res => {
      // @ts-ignore
      this.reservationList = res.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

  createReservation(chair: ChairModel) {
    this.crudService.getDocumentByParam(this.collectionName, this.uid, 'userId').subscribe(reservation => {
      // @ts-ignore
      const reservationUser = reservation.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      }, error => {
        this.alert = [{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }];
      });
      if (!(Array.isArray(reservationUser) && reservationUser.length)) {
        this.openModalReservation(chair);
      } else {
        this.openModalNoReservation();
      }
    });
  }

  private _buildForm() {
    this.consultForm = this.fb.group({
      date: [this.currentDate, (control: FormControl) => this.utilService.validateDateInput(control)],
      sTime: [this.startTime, (control: FormControl) => this.utilService.validateTimeInput(control)],
      eTime: [this.endTime, (control: FormControl) => this.utilService.validateTimeInput(control)]
    });
  }

  private openModalReservation(chair: ChairModel) {
    const dialogRefReservation = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        buttonText: 'Create reservation',
        modalText: 'Are you sure that you want to create this reservation?',
        title: 'Add reservation'
      }
    });
    dialogRefReservation.afterClosed().subscribe((result) => {
      if (result !== undefined && result === true) {
        this.reservation.chairId = chair.id;
        this.reservation.userId = this.uid;
        this.reservation.date = this.consultForm.value.date;
        this.reservation.sTime = this.consultForm.value.sTime;
        this.reservation.eTime = this.consultForm.value.eTime;
        this.crudService.createDocument(this.collectionName, this.reservation).then(() => {
          this.onClick();
          this.alert = [{
            type: 'success',
            message: 'Chair created successfully!'
          }];
        }).catch(error => {
          this.alert = [{
            type: 'danger',
            message: 'Something went wrong: ' + error
          }];
        });
      }
    });
  }

  private openModalNoReservation() {
    this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        buttonText: 'Return',
        modalText: 'You have an active reservation at this time and therefore you cannot book later.',
        title: 'Active booking'
      }
    });
  }
}

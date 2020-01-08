import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

  public consultForm: FormGroup;

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

  constructor(private fb: FormBuilder, private utilService: UtilService, private crudService: CrudService) {
    this.today = new Date();
    this.currentDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    };
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
    return (!(resSTime < selSTime && resETime > selSTime) && !(resSTime < selETime && resETime > selETime));
  }

  ngOnInit() {
    this._buildForm();
  }

  public onClick() {
    this.availableChairs = [];
    const responseForm = this.consultForm.value;

    for (const chair of this.chairList) {
      const temp: ReservationModel = this.reservationList.find(reservation => reservation.chairId === chair.uid);
      if (chair.owner === 'free') {
        if (ConsultChairsComponent._checkDates(temp.date.day, temp.date.month, temp.date.year, responseForm.date.day,
          responseForm.date.month,
          responseForm.date.year)) {
          if (ConsultChairsComponent._checkTimeRanges(temp.sTime.hour, temp.eTime.hour, responseForm.sTime.hour, responseForm.eTime.hour)) {
            console.log(
              ConsultChairsComponent._checkTimeRanges(temp.sTime.hour, temp.eTime.hour, responseForm.sTime.hour, responseForm.eTime.hour));
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

  private _buildForm() {
    this.consultForm = this.fb.group({
      date: [this.currentDate, (control: FormControl) => this.utilService.validateDateInput(control)],
      sTime: [this.startTime, (control: FormControl) => this.utilService.validateTimeInput(control)],
      eTime: [this.endTime, (control: FormControl) => this.utilService.validateTimeInput(control)]
    });
  }
}

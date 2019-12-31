import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateModel, TimeModel } from '../../../models/date-time.model';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-consult-chairs',
  templateUrl: './consult-chairs.component.html',
  styleUrls: ['./consult-chairs.component.css']
})
export class ConsultChairsComponent implements OnInit {

  public consultForm: FormGroup;

  public today: Date;
  public currentDate: DateModel;
  public startTime: TimeModel;
  public endTime: TimeModel;
  public errors: string[];

  constructor(private fb: FormBuilder, private utilService: UtilService) {
    this.today = new Date();
    this.currentDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    };
    this.startTime = { hour: 8, minute: 0 };
    this.endTime = { hour: 9, minute: 0 };
    this.errors = utilService.errors;
  }

  ngOnInit() {
    this._buildForm();
  }

  public onClick() {
    console.log(this.consultForm.value);
  }

  private _buildForm() {
    this.consultForm = this.fb.group({
      date: [this.currentDate, (control: FormControl) => this.utilService.validateDateInput(control)],
      sTime: [this.startTime, (control: FormControl) => this.utilService.validateTimeInput(control)],
      eTime: [this.endTime, (control: FormControl) => this.utilService.validateTimeInput(control)]
    });
  }
}

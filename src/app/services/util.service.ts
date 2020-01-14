import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorListModel } from '../models/error-list.model';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public errors: string[];
  public errorList: ErrorListModel;

  constructor() {
    this.errors = [];
    this.errorList = {
      emptyField: 'Empty fields. Please fill them all.',
      dateFormat: 'Date format invalid. Use the calendar button and select the day.',
      minTime: 'Time can not be lower than 8(am).',
      maxTime: 'Time can not be higher than 18(6pm).'
    };
  }

  validateDateInput(control: FormControl) {
    const value = control.value;

    if (!value) {
      this._fillErrors(this.errorList.emptyField);
      return this.errorList.emptyField;
    } else {
      this._deleteErrors(this.errorList.emptyField);
    }
    if (!value.hasOwnProperty('year')) {
      this._fillErrors(this.errorList.dateFormat);
      return this.errorList.dateFormat;
    } else {
      this._deleteErrors(this.errorList.dateFormat);
    }
  }

  validateTimeInput(control: FormControl) {
    const value = control.value;

    if (!value) {
      this._fillErrors(this.errorList.emptyField);
      return this.errorList.emptyField;
    } else {
      this._deleteErrors(this.errorList.emptyField);
    }
    if (value.hour < 8) {
      this._fillErrors(this.errorList.minTime);
      return this.errorList.minTime;
    } else {
      this._deleteErrors(this.errorList.minTime);
    }
    if (value.hour > 18) {
      this._fillErrors(this.errorList.maxTime);
      return this.errorList.maxTime;
    } else {
      this._deleteErrors(this.errorList.maxTime);
    }
  }

  private _fillErrors(msgError: string) {
    if (this.errors.indexOf(msgError) === -1) {
      this.errors.push(msgError);
    }
  }

  private _deleteErrors(msgError: string) {
    this.errors.splice(this.errors.indexOf(msgError), 1);
  }
}

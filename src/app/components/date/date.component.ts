import { Component, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';


@Component({
  selector: 'ibm-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {

  @Output('hour') hourEmitter = new EventEmitter();

  startTime = {hour: 8, minute: 0, second: 0};
  endTime = {hour: 18, minute: 0, second: 0};
  date = 'yyyy-mm-dd'
  
  constructor() {
    interval().subscribe(() =>{this.hourEmitter.emit([this.startTime, this.endTime, this.date]);})
  }

}

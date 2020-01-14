import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertModel } from 'src/app/models/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnChanges {

  @Input() alerts: AlertModel[];
  staticAlertClosed = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.staticAlertClosed = false;
    setTimeout(() => this.staticAlertClosed = !this.staticAlertClosed, 5000);
  }

  close(alert: AlertModel) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}

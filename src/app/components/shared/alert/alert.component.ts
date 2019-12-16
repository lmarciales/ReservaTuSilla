import { Component, OnInit, Input } from '@angular/core';
import { AlertModel } from 'src/app/models/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() alerts: AlertModel[];

  constructor() {
  }

  ngOnInit() {
  }

  close(alert: AlertModel) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}

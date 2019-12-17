import { Component, OnInit, Input } from '@angular/core';
import { ReservationView } from 'src/app/model/reservationView.model';

@Component({
  selector: 'app-reservation-state',
  templateUrl: './reservation-state.component.html',
  styleUrls: ['./reservation-state.component.css']
})
export class ReservationStateComponent implements OnInit {

  @Input() information: ReservationView;

  constructor() { }

  ngOnInit() {
  }

}

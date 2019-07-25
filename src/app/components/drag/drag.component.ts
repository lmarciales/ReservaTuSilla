import { Component, OnInit, Input } from '@angular/core';
import { chairModel } from 'src/app/model/chair.model';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'ibm-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.css']
})
export class DragComponent implements OnInit {

  @Input('chair') chairInput: chairModel;

  dragPosition = {x: 0, y: 0};
  showGarbage: boolean;
  disappear: boolean;

  constructor (private _homeObject: HomeComponent) {
    this.showGarbage = false;
    this.disappear = false;
  }

  ngOnInit() {
  }

  changePosition() {
    console.log(this.chairInput.isReserved);
    this.showGarbage = false;
    this.dragPosition = {x: this.dragPosition.x, y: this.dragPosition.y};
    this.disappear = false;
  }

  deleteReserve() {
    this.disappear = true;
    console.log('ELIMINAR');
  }
}

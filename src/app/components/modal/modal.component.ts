import { Component, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from '../main/home/home.component';
import { reserveChair } from 'src/app/model/reserveChair.model';
import { chairModel } from 'src/app/model/chair.model';

@Component({
  selector: 'ibm-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input('chair') chairInput: chairModel;
  closeResult: string;
  dataSave: reserveChair;

  constructor(private modalService: NgbModal, private _homeObject: HomeComponent) {
    this.dataSave = {
      name: null,
      userId: null,
      chairId: null,
      date: null,
      startTime: null,
      endTime: null,
      isReserved: false
    }
  }

  private open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.dataSave.isReserved = true;
      console.log(this.dataSave);
      this._homeObject.takeChair(this.dataSave);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  private updateData(e: any) {
    if (this.chairInput) {
      this.dataSave.userId = this.chairInput.userId;
      this.dataSave.chairId = this.chairInput.chairId;
      this.dataSave.name = this.chairInput.name;
    }
    this.dataSave.startTime = e[0];
    this.dataSave.endTime = e[1];
    this.dataSave.date = e[2];
  }
}

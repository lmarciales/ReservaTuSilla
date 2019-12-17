import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationModalModel } from 'src/app/models/confirmation-modal.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertModel } from 'src/app/models/alert.model';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  ALERTS: AlertModel[] = [{
    type: 'success',
    message: 'This is an success alert',
  }, {
    type: 'info',
    message: 'This is an info alert',
  }, {
    type: 'warning',
    message: 'This is a warning alert',
  }, {
    type: 'danger',
    message: 'This is a danger alert',
  }, {
    type: 'primary',
    message: 'This is a primary alert',
  }, {
    type: 'secondary',
    message: 'This is a secondary alert',
  }, {
    type: 'light',
    message: 'This is a light alert',
  }, {
    type: 'dark',
    message: 'This is a dark alert',
  }
];

  @Input() properties: ConfirmationModalModel;

  triggerAlert: boolean;

  constructor(private modalService: NgbModal) {
    this.triggerAlert = false;
  }

  ngOnInit() {
  }

  /**
   * @description This function is invoked when the modal is opened or closed
   * @param {*} content
   * @memberof ConfirmationModalComponent
   */
  public onModalActive(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
        this.onButtonClick(result);
      }, () => { }
    );
  }

  /**
   * @description This function invokes other function to execute the CRUD
   * @private
   * @param {string} reason
   * @memberof ConfirmationModalComponent
   */
  private onButtonClick(reason: string): void {
    console.log(reason);
    this.triggerAlert = true;
    // TODO: Implementar un switch con las diferentes funciones a ejecutar.
  }
}

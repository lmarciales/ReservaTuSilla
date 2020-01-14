import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChairModel } from 'src/app/models/chair.model';
import { UserModel } from '../../../models/user.model';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-add-chair',
  templateUrl: './add-chair.component.html',
  styleUrls: ['./add-chair.component.css']
})
export class AddChairComponent implements OnInit {

  public chairForm: FormGroup;
  public buttonText: string;
  public users: UserModel[];
  private collectionName: string;

  constructor(public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddChairComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChairModel,
              private crudService: CrudService) {
    this.chairForm = formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      owner: ['', [Validators.required]]
    });
    this.collectionName = 'users';
  }

  ngOnInit() {
    this.chairForm.controls.description.setValue(this.data ? this.data.description : '');
    this.chairForm.controls.location.setValue(this.data ? this.data.location : '');
    this.chairForm.controls.owner.setValue(this.data ? this.data.owner : '');
    this.getUserList();
  }

  getUserList() {
    this.crudService.getCollection(this.collectionName).subscribe(users => {
      // @ts-ignore
      this.users = users.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    });
  }

}

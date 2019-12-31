import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChairModel } from 'src/app/models/chair.model';

@Component({
  selector: 'app-add-chair',
  templateUrl: './add-chair.component.html',
  styleUrls: ['./add-chair.component.css']
})
export class AddChairComponent implements OnInit {

  public chairForm: FormGroup;
  public buttonText: string;

  constructor(public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddChairComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChairModel) {
    this.chairForm = formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      owner: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.chairForm.controls.description.setValue(this.data ? this.data.description : '');
    this.chairForm.controls.location.setValue(this.data ? this.data.location : '');
    this.chairForm.controls.owner.setValue(this.data ? this.data.owner : '');
  }

}

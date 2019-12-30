import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { UserModel } from '../../../models/user.model';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public userForm: FormGroup;
  public buttonText: string;

  constructor(public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserModel) {
    this.userForm = formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
    });
  }

  ngOnInit() {
    this.userForm.controls.firstname.setValue(this.data ? this.data.name.firstname : '');
    this.userForm.controls.lastname.setValue(this.data ? this.data.name.lastname : '');
    this.userForm.controls.role.setValue(this.data ? this.data.role : '');
    this.userForm.controls.email.setValue(this.data ? this.data.email : '');
    this.userForm.controls.password.setValue(this.data ? this.data.password : '');
  }
}

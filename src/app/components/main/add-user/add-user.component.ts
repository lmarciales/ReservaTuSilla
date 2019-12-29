import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  public userForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddUserComponent>) {
    this.userForm = formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
    });
  }

  ngOnInit() {
  }

}

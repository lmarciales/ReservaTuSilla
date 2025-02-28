import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertModel } from '../../../models/alert.model';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CrudService } from '../../../services/crud.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public tableHeaders = {
    name: 'Name',
    email: 'Email',
    role: 'Role'
  };

  public data: UserModel = {
    email: '',
    password: '',
    name: {
      firstname: '',
      lastname: ''
    },
    role: ''
  };

  public userList: any[];
  public alert: AlertModel[];
  private collectionName = 'users';
  private alertSubs;

  constructor(private crudService: CrudService, private authService: AuthService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.alertSubs = this.authService.alert.subscribe(value => {
      this.alert = value;
    });
    this.getUserList();
  }

  getUserList() {
    this.crudService.getCollection(this.collectionName).subscribe(users => {
      // @ts-ignore
      this.userList = users.map((e) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
    }, error => {
      this.alert = [{
        type: 'danger',
        message: 'Something went wrong: ' + error
      }];
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px'
    });
    dialogRef.componentInstance.buttonText = 'Add user';
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== false) {
        this.data.email = result.email ? result.email : '';
        this.data.name.firstname = result.firstname ? result.firstname : '';
        this.data.name.lastname = result.lastname ? result.lastname : '';
        this.data.password = result.password ? result.password : '';
        this.data.role = result.role ? result.role : '';
        this.authService.register(this.data);
      }
    });
  }

  editUser(user: UserModel) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px',
      data: {
        email: user.email,
        password: user.password,
        name: {
          firstname: user.name.firstname,
          lastname: user.name.lastname
        },
        role: user.role,
        id: user.id
      }
    });
    dialogRef.componentInstance.buttonText = 'Edit user';
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== false) {
        this.data.email = result.email ? result.email : '';
        this.data.name.firstname = result.firstname ? result.firstname : '';
        this.data.name.lastname = result.lastname ? result.lastname : '';
        this.data.password = result.password ? result.password : '';
        this.data.role = result.role ? result.role : '';
        this.data.id = user.id;
        this.authService.editUser(this.data);
      }
    });
  }

  deleteUser(userId) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      data: {
        buttonText: 'Delete',
        modalText: 'Are you sure that you want to delete user?',
        title: 'Delete user'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result === true) {
        this.authService.deleteUser(userId);
      }
    });
  }
}

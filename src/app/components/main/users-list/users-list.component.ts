import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertModel } from '../../../models/alert.model';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CrudService } from '../../../services/crud.service';
import { AddUserComponent } from '../add-user/add-user.component';

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
    // TODO: Llamar modal.
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '600px'
    });
    
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

  deleteUser(userId) {
    this.authService.deleteUser(userId);
  }

}

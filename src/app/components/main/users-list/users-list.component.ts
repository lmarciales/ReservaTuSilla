import { Component, OnInit } from '@angular/core';
import { AlertModel } from '../../../models/alert.model';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { CrudService } from '../../../services/crud.service';

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
    email: '1@ibm.com',
    password: '123456',
    name: {
      firstname: 'Felipe',
      lastname: 'Marciales'
    },
    role: 'admin'
  };

  public userList: any[];
  public alert: AlertModel[];
  private collectionName = 'users';
  private alertSubs;

  constructor(private crudService: CrudService, private authService: AuthService) {
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
    this.authService.register(this.data);
  }

  deleteUser(userId) {
    this.authService.deleteUser(userId);
  }

}

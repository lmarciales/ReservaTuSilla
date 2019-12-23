import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { AlertModel } from '../models/alert.model';
import { UserModel } from '../models/user.model';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: Observable<firebase.User>;
  authApp = firebase.initializeApp(environment.firebase, 'authApp');
  detachedAuth;
  collectionName = 'users';
  alert: Subject<AlertModel[]> = new Subject<AlertModel[]>();

  constructor(private angularFireAuth: AngularFireAuth, private crudService: CrudService, private router: Router) {
    this.authState = angularFireAuth.authState;
    this.detachedAuth = this.authApp.auth();
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  register(newUser: UserModel) {
    this.detachedAuth.createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(res => {
        const userData: UserModel = {
          email: res.user.email,
          password: btoa(newUser.password),
          name: {
            firstname: newUser.name.firstname,
            lastname: newUser.name.lastname
          },
          role: newUser.role
        };
        this.crudService.createDocument(this.collectionName, userData)
          .then(() => {
            this.alert.next([{
              type: 'success',
              message: 'User created successfully!'
            }]);
          })
          .catch(error => {
            this.alert.next([{
              type: 'danger',
              message: 'Something went wrong: ' + error
            }]);
          });
      })
      .catch(error => {
        this.alert.next([{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }]);
      });
  }

  deleteUser(userId) {
    this.crudService.getDocument(this.collectionName, userId)
      .then(doc => {
        if (doc.exists) {
          const email = doc.data().email;
          const password = atob(doc.data().password);
          this.detachedAuth.signInWithEmailAndPassword(email, password)
            .then((res) => {
              res.user.delete();
              this.crudService.deleteDocument(this.collectionName, userId)
                .then(() => {
                  this.alert.next([{
                    type: 'success',
                    message: 'User deleted successfully!'
                  }]);
                })
                .catch(error => {
                  this.alert.next([{
                    type: 'danger',
                    message: 'Something went wrong: ' + error
                  }]);
                });
            })
            .catch(error => {
              this.alert.next([{
                type: 'danger',
                message: 'Something went wrong: ' + error
              }]);
            });
        }
      })
      .catch(error => {
        this.alert.next([{
          type: 'danger',
          message: 'Something went wrong: ' + error
        }]);
      });
  }

  login(email: string, password: string) {
    this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['dashboard/home']);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout() {
    this.angularFireAuth.auth.signOut();
  }

}

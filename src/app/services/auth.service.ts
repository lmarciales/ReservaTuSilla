import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { AlertModel } from '../models/alert.model';
import { UserModel } from '../models/user.model';
import { CrudService } from './crud.service';
import { ReleaseChairService } from './release-chair.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: Observable<firebase.User>;
  authApp = firebase.initializeApp(environment.firebase, 'authApp');
  detachedAuth;
  collectionName = 'users';
  alert: Subject<AlertModel[]> = new Subject<AlertModel[]>();

  constructor(private angularFireAuth: AngularFireAuth, private crudService: CrudService, private router: Router,
              private releaseChairService: ReleaseChairService) {
    this.authState = angularFireAuth.authState;
    this.detachedAuth = this.authApp.auth();

    releaseChairService.removeOutdatedReservations();
    releaseChairService.addReservations();
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
        this.crudService.createDocumentWithId(this.collectionName, res.user.uid, userData)
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

  editUser(user: UserModel) {
    this.crudService.getDocument(this.collectionName, user.id)
      .then(doc => {
        if (doc.exists) {
          const email = doc.data().email;
          const password = atob(doc.data().password);
          this.detachedAuth.signInWithEmailAndPassword(email, password)
            .then((res) => {
              res.user.updateEmail(user.email);
              res.user.updatePassword(user.password);
              if (user.password === '') {
                user.password = password;
              }
              user.password = btoa(user.password);
              this.crudService.updateDocument(this.collectionName, user.id, user)
                .then(() => {
                  this.alert.next([{
                    type: 'success',
                    message: 'User update successfully!'
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
          this.detachedAuth.signOut();
        }
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

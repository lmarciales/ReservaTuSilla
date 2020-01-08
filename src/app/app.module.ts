import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragComponent } from './components/drag/drag.component';
import { AddUserComponent } from './components/main/add-user/add-user.component';
import { AdministrationComponent } from './components/main/administration/administration.component';
import { ChairsListComponent } from './components/main/chairs-list/chairs-list.component';
import { DateComponent } from './components/main/date/date.component';
import { EditReservationComponent } from './components/main/edit-reservation/edit-reservation.component';
import { HomeComponent } from './components/main/home/home.component';
import { LoginComponent } from './components/main/login/login.component';
import { MenuComponent } from './components/main/menu/menu.component';
import { ReservationStateComponent } from './components/main/reservation-state/reservation-state.component';
import { UsersListComponent } from './components/main/users-list/users-list.component';
import { ModalComponent } from './components/modal/modal.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { ConsultChairsComponent } from './components/main/consult-chairs/consult-chairs.component';
import { AddChairComponent } from './components/main/add-chair/add-chair.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MenuComponent,
    DragComponent,
    ModalComponent,
    DateComponent,
    AdministrationComponent,
    LayoutComponent,
    ReservationStateComponent,
    ConfirmationModalComponent,
    AlertComponent,
    ChairsListComponent,
    UsersListComponent,
    EditReservationComponent,
    AddUserComponent,
    ConsultChairsComponent,
    AddChairComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireAuthGuardModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
    MatToolbarModule,
    MatIconModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    DragDropModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule
  ],
  providers: [],
  entryComponents: [
    ConfirmationModalComponent,
    EditReservationComponent,
    AddUserComponent,
    AddChairComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

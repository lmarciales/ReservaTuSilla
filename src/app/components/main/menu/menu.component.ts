import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public enableAdminOpts: boolean;
  private collectionUser: string;

  constructor(private authService: AuthService, private crudService: CrudService, private router: Router) {
    this.collectionUser = 'users';
    this.enableAdminOpts = true;
  }

  ngOnInit() {
    this.getRoleUser();
  }

  logout() {
    this.router.navigate(['login']);
  }

  getRoleUser() {
    if (this.authService.authenticated) {
      this.authService.currentUser.subscribe(res => {
        this.crudService.getDocument(this.collectionUser, res.uid).then(user => {
          if (user && user.data()) {
            this.enableAdminOpts = user.data().role === 'admin';
          }
        });
      });
    }
  }

}

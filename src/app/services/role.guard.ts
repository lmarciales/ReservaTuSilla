import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  private collectionUser: string;

  constructor(private authService: AuthService, private crudService: CrudService, private router: Router) {
    this.collectionUser = 'users';
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.authenticated) {
      this.authService.currentUser.subscribe(res => {
        this.crudService.getDocument(this.collectionUser, res.uid).then(user => {
          if (user.data().role === 'admin') {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        });
      });
    }

    return true;
  }

}

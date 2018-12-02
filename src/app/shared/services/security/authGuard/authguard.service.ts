import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../../storage/storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(
    private storage: StorageService,
    private router: Router
  ) { }

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    if (this.storage.isTokenPresent()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

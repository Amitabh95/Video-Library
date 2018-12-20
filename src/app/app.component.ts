import { Component } from '@angular/core';
// import { StorageService } from './shared/services/storage/storage.service';
// import { Router } from '@angular/router';
// import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  template: '<app-material-loader-comp></app-material-loader-comp><router-outlet></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngVideoLibrary';
  constructor(
    // private storage: StorageService,
    // private router: Router,
    // private authService: AuthService
  ) {
      // this.storage.getToken().then((response: any) => {
      //   if (!response.error) {
      //     this.router.navigate(['/']);
      //   } else {
      //     this.router.navigate(['/login']);
      //   }
      // });
  }
}

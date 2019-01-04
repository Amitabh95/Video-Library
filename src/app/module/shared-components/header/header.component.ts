import { Component, OnInit, Input } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() pageName: string;
  constructor(
    private authService: FirebaseAuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.signOut().then((logoutValue) => {
      this.authService.checkLoginStatus()
        .then((value) => {
          this.router.navigateByUrl('/login');
        });
    }).catch((error) => {
      console.log('Logout error--> ', error);
    });
  }

  navigateTo(path) {
    this.router.navigateByUrl(path);
  }
}

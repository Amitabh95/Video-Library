import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-landing-main',
  templateUrl: './video-landing-main.component.html',
  styleUrls: ['./video-landing-main.component.css']
})
export class VideoLandingMainComponent implements OnInit {

  constructor(
    private authService: FirebaseAuthenticationService,
    private router: Router) { }

  ngOnInit() {
  }

  signOut() {
    this.authService.signOut().then((logoutValue) => {
      console.log('Logout Value--->', logoutValue);
      this.authService.checkLoginStatus()
        .then((value) => {
          this.router.navigateByUrl('/login');
          console.log('Login status after logout---> ', value);
        });
    }).catch((error) => {
      console.log('Logout error--> ', error);
    });
  }
}

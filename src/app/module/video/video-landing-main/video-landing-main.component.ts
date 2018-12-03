import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';

@Component({
  selector: 'app-video-landing-main',
  templateUrl: './video-landing-main.component.html',
  styleUrls: ['./video-landing-main.component.css']
})
export class VideoLandingMainComponent implements OnInit {
  allVideoPlaylist: any;

  constructor(
    private authService: FirebaseAuthenticationService,
    private firestoreDB: FirestoreDatabaseService,
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

  getAllVideos() {
    this.firestoreDB.getAllVideoPlaylist().then((response: any) => {
      this.allVideoPlaylist = response.response;
      console.log('Response---> ', response);
    }).catch((error) => {
      console.log('Error---> ', error);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';
import { MaterialLoaderModule, MaterialLoaderServeService } from 'src/app/common-custom-modules/material-loader/material-loader.module';

@Component({
  selector: 'app-video-landing-main',
  templateUrl: './video-landing-main.component.html',
  styleUrls: ['./video-landing-main.component.css']
})
export class VideoLandingMainComponent implements OnInit {
  allVideoPlaylist: any[] = [];

  // remove this
  materialBoolean: boolean;
  withoutMaterialBoolean: boolean;

  constructor
    (
    private authService: FirebaseAuthenticationService,
    private firestoreDB: FirestoreDatabaseService,
    private router: Router,
    private loaderService: MaterialLoaderServeService
    ) {
    // Remove this
    this.materialBoolean = true;
    this.withoutMaterialBoolean = true;
  }

  ngOnInit() {
    this.getAllVideos();
  }

  withoutMaterial() {
    this.withoutMaterialBoolean = !this.withoutMaterialBoolean;
  }

  material() {
    this.materialBoolean = !this.materialBoolean;
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
    this.loaderService.show();
    // const cachedData = JSON.parse(localStorage.getItem('cachedPlaylist'));
    // if (cachedData) {
    //   this.allVideoPlaylist = cachedData;
    //   this.loaderService.hide();
    // } else {
      this.firestoreDB.getAllVideoPlaylist().then((response: any) => {
        this.loaderService.hide();
        this.allVideoPlaylist = response.response;
        this.allVideoPlaylist = this.sortSeries();
        // localStorage.setItem('cachedPlaylist', JSON.stringify(this.allVideoPlaylist));
      }).catch((error) => {
        console.log('Error---> ', error);
      });
    // }
  }

  timeDifference(timestamp) {
    let finalTime: string;
    let difference = Date.now() - timestamp;

    const month = Math.floor(difference / 1000 / 60 / 60 / 24 / 30);
    difference -= month * 1000 * 60 * 60 * 24 * 30;

    const days = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(difference / 1000 / 60 / 60);
    difference -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(difference / 1000 / 60);
    difference -= minutes * 1000 * 60;

    const seconds = Math.floor(difference / 1000);

    if (month === 0 && days === 0 && hours === 0) {
      if (minutes === 0) {
        finalTime = 1 + ' minute';
      } else {
        finalTime = minutes + ' minutes';
      }
    } else if (month === 0 && days === 0 && hours > 0) {
      if (hours === 1) {
        finalTime = hours + ' hour';
      } else {
        finalTime = hours + ' hours';
      }
    } else if (month === 0 && days > 0) {
      if (days === 1) {
        finalTime = days + ' day';
      } else {
        finalTime = days + ' days';
      }
    } else if (month > 0) {
      if (month === 1) {
        finalTime = month + ' month';
      } else {
        finalTime = month + ' months';
      }
    }
    return finalTime;
  }

  calculateEpisodes(dataArray) {
    let final = dataArray.length;
    if (final === 0) {
      final = 0;
    } else if (final === 1) {
      final = 1 + ' episode';
    } else if (final > 1) {
      final = final + ' episodes';
    }
    return final;
  }

  sortSeries() {
    let tempArray = JSON.parse(JSON.stringify(this.allVideoPlaylist));
    return tempArray.sort(this.compare);
  }

  compare(a, b) {
    if (a.sortOrder > b.sortOrder) {
      return -1;
    }
    if (a.sortOrder < b.sortOrder) {
      return 1;
    }
    return 0;
  }

  playVideo(data) {
    this.loaderService.show();
    this.router.navigate(['/player'], { queryParams: { videoID: data.videoID } });
  }
}

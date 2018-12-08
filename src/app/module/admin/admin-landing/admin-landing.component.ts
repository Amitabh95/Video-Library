import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {
  allVideo: any[] = [];

  constructor(
    private router: Router,
    private firestoreDB: FirestoreDatabaseService,
    private toasterAlert: ToastrService) {
  }

  ngOnInit() {
    this.getAllVideo();
  }

  addNewVideo() {
    this.router.navigate(['/admin/video'], { queryParams: { newVideo: true }});
  }

  editVideo(videoID) {
    this.router.navigate(['/admin/video'], { queryParams: { newVideo: false, videoID: videoID }});
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

  getAllVideo() {
    this.firestoreDB.getAllVideoPlaylist().then((result: any) => {
      if (!result.error) {
        this.allVideo = result.response;
      }
    }).catch((error) => {
      this.toasterAlert.error(error);
    });
  }
}

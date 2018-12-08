import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
  selector: 'app-video-player-main',
  templateUrl: './video-player-main.component.html',
  styleUrls: ['./video-player-main.component.css']
})
export class VideoPlayerMainComponent implements OnInit, OnDestroy {
  videoID: string;
  uid: string;
  videoPlaylist: any;
  routeSubscription: any;
  youtubePlayer: any;
  videoLiked: boolean;
  videoLikes: number;
  seriesID: string;
  isEpisode: boolean;
  episodeID: number;
  episodeVideoList: any[] = [];
  videoViews: number;
  episodeVideoData: any;
  otherEpisodeList: any[] = [];
  videoURL: any;
  isVideoPlayedFirstTime: boolean;
  videoContainer: any;
  player: YT.Player;
  playerVideoID: string;
  loadPlayer: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreDB: FirestoreDatabaseService,
    private embedVideo: EmbedVideoService
  ) {
    this.isEpisode = false;
    this.isVideoPlayedFirstTime = true;
  }

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    this.routeSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.videoID = params['videoID'] || 0;
        this.getPlaylist(this.videoID);
      });
  }

  getPlaylist(videoID) {
    const containDashAt = videoID.indexOf('-');
    if (containDashAt === -1) {
      this.isEpisode = false;
      this.firestoreDB.getVideoPlaylist(videoID).then((result: any) => {
        if (!result.error) {
          this.videoPlaylist = result.response;
          this.videoLikes = this.videoPlaylist.likes.likes;
          this.videoLiked = false;
          this.videoViews = this.videoPlaylist.views;
          this.videoURL = this.videoPlaylist.URL;
          this.episodeVideoList = this.videoPlaylist.episode;
          this.videoPlaylist.likes.likedBy.forEach(element => {
            if (element === this.uid) {
              this.videoLiked = true;
              return false;
            }
          });
          this.initiatePlayer(this.videoPlaylist.URL.video);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.isEpisode = true;
      this.seriesID = videoID.substring(0, containDashAt);
      this.episodeID = Number(videoID.substring(containDashAt + 1));
      this.firestoreDB.getVideoPlaylist(this.seriesID).then((result: any) => {
        if (!result.error) {
          this.videoPlaylist = result.response;
          this.episodeVideoData = result.response.episode[this.episodeID];
          this.videoLikes = this.episodeVideoData.likes.likes;
          this.videoViews = this.episodeVideoData.views;
          this.episodeVideoList = this.videoPlaylist.episode;
          this.otherEpisodeList = [];
          this.episodeVideoList.forEach(element => {
            if (element.sortOrder !== this.episodeID) {
              this.otherEpisodeList.push(element);
            }
          });
          this.videoURL = this.episodeVideoData.URL;
          this.videoLiked = false;
          this.episodeVideoData.likes.likedBy.forEach(element => {
            if (element === this.uid) {
              this.videoLiked = true;
              return false;
            }
          });
          this.initiatePlayer(this.episodeVideoData.URL.video);
        }
      });
    }
  }

  playVideo(data) {
    this.router.navigate(['/player'], { queryParams: { videoID: data.videoID} });
    this.initiatePlayer(data.URL.video);
  }

  playerEvent(event) {
    console.log('Player event---> ', event);
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

  getYoutubeVideoID(videoURL) {
    const videoid = videoURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoid != null) {
      return videoid[1];
    }
  }

  initiatePlayer(videoURL) {
    this.loadPlayer = false;
      this.videoContainer = this.embedVideo.embed(videoURL,
                              { query: { autoplay: 1, rel: 0, origin: 'localhost:4200' },
                                attr: { width: 800, height: 500, id: 'iframe-video-tag' }
                              });
      this.loadPlayer = true;
      this.getIframTag();
  }

  getIframTag() {
    // setTimeout( function() {
      const tag = document.getElementById('iframe-video-tag');
      // const that = this;
      // tag.oncanplay = that.clickIframe();
      console.log('iframe tag--> ', tag);
    // }, 500);
  }

  consoleValue() {
    console.log('clicked iframe');
  }

/*
  onPlayerStateChange(event) {
    console.log('Hello..', event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
      if (this.isVideoPlayedFirstTime === true) {
        this.increamentView();
        this.isVideoPlayedFirstTime = false;
      }
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
          localStorage.setItem('pause-time', this.cleanTime().toString());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }
*/

  increamentView() {
    if (!this.isEpisode) {
      this.firestoreDB.increamentViews(this.videoPlaylist, null);
    } else {
      this.firestoreDB.increamentViews(this.videoPlaylist, this.episodeID);
    }
  }

  likeIncreament() {
    if (!this.isEpisode) {
      if (this.videoLiked === false) {
        this.firestoreDB.incrementSeriesVideoLike(this.videoPlaylist, null, this.uid)
          .then((result: any) => {
            if (!result.error) {
              this.videoLikes++;
              this.videoLiked = true;
            }
          }).catch((error) => {
            console.log('Error--> ', error);
          });
      }
    } else {
      if (this.videoLiked === false) {
        this.firestoreDB.incrementSeriesVideoLike(this.videoPlaylist, this.episodeID, this.uid)
          .then((result: any) => {
            if (!result.error) {
              this.videoLikes++;
              this.videoLiked = true;
            }
          }).catch((error) => {
            console.log('Error--> ', error);
          });
      }
    }
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';


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
  episodeVideoData: any;
  videoObject: any;
  YT: any;
  player: any;
  reframed: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestoreDB: FirestoreDatabaseService
  ) {
    this.isEpisode = false;
  }

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    this.routeSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.videoID = params['videoID'] || 0;
        const containDashAt = this.videoID.indexOf('-');
        // if ( containDashAt === -1) {
        this.getPlaylist(this.videoID);
        // } else {
        //   this.getEpisodeVideo(this.videoID);
        //   console.log('dash at---> ', containDashAt);
        // }
      });
  }

  getEpisodeVideo(videoID) {
    const containDashAt = videoID.indexOf('-');
    const videoid = videoID.substring(0, containDashAt);
    console.log('videoid-->', Number(videoid));
    console.log('episode--> ', Number(videoID.substring(containDashAt + 1)));
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
          this.videoObject = this.videoPlaylist.URL;
          this.videoPlaylist.likes.likedBy.forEach(element => {
            if (element === this.uid) {
              this.videoLiked = true;
              return false;
            }
          });
          this.initiatePlayer();
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
          this.videoObject = this.episodeVideoData.URL;
          this.videoLiked = false;
          this.episodeVideoData.likes.likedBy.forEach(element => {
            if (element === this.uid) {
              this.videoLiked = true;
              return false;
            }
          });
          this.initiatePlayer();
        }
      });
    }
  }

  getYoutubeVideoID(videoURL) {
    const videoid = videoURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    if (videoid != null) {
      console.log('video id = ', videoid[1]);
      return videoid[1];
    }
  }

  initiatePlayer() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.reframed = false;
      this.player = new window['YT'].Player('video-container', {
        videoId: this.getYoutubeVideoID(this.videoObject.video),
        playerVars: {
          showinfo: 0,
          modestbranding: 1,
          start: localStorage.getItem('pause-time')
        },
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onReady': (e) => {
            if (!this.reframed) {
              this.reframed = true;
            }
          }
        }
      });
    };
  }
  onPlayerStateChange(event) {
    console.log('Hello..', event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
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

  likeIncreament() {
    if (!this.isEpisode) {
      console.log('like series');
      this.videoPlaylist.likes.likedBy.forEach(element => {
        if (element !== this.uid) {
          this.firestoreDB.incrementSeriesVideoLike(this.videoPlaylist, null, this.uid);
        }
      });
    } else {
      console.log('like episode');
      this.episodeVideoData.likes.likedBy.forEach(element => {
        if (element !== this.uid) {
          this.firestoreDB.incrementSeriesVideoLike(this.videoPlaylist, this.episodeID, this.uid);
          console.log('videoData--> ', this.videoPlaylist);
          console.log('episodeID--> ', this.episodeID);
          console.log('uid--> ', this.uid);
        }
      });
    }
  }

  ngOnDestroy() {

  }

}

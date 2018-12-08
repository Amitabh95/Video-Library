import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDatabaseService implements OnDestroy {
  observeValueChange: any;
  videoPlaylistArray: any[] = [];
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage
  ) { }

  createUser(uid, userData) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`users/`).doc(uid).set(userData).then(() => {
        const successResponse = {
          error: false,
          response: {
            message: 'New user created succcessfully'
          }
        };
        resolve(successResponse);
      }).catch((error) => {
        const errorResponse = {
          error: true,
          errorDetails: error
        };
        reject(errorResponse);
      });
    });
    return promise;
  }

  isUserPresent(uid) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`users/`).doc(uid).get().toPromise().then((value) => {
        resolve(value.exists);
      }).catch((error) => {
        reject(error);
      });
    });
    return promise;
  }

  updateUserData(uid, data) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`users/`).doc(uid).set(data, { merge: true }).then(() => {
        const successResponse = {
          error: false
        };
        resolve(successResponse);
      }).catch((error) => {
        const errorResponse = {
          error: true,
          errorDetails: error
        };
        reject(errorResponse);
      });
    });
    return promise;
  }

  getUserData(uid) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`users`).doc(uid).get().toPromise().then((value) => {
        if (value.exists) {
          const successResponse = {
            error: false,
            response: value.data()
          };
          resolve(successResponse);
        }
      }).catch((error) => {
        const errorResponse = {
          error: true,
          errorDetails: error
        };
        reject(errorResponse);
      });
    });
    return promise;
  }

  createNewVideoPlaylist(videoData) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`videos/`).doc(videoData.videoID).set(videoData)
        .then(() => {
          const successResponse = {
            error: false,
            response: {
              message: 'Successfully added new playlst'
            }
          };
          resolve(successResponse);
        })
        .catch((error) => {
          const errorResponse = {
            error: true,
            errorDetails: error
          };
          reject(errorResponse);
        });
    });
    return promise;
  }

  getAllVideoPlaylist() {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`videos/`).get().toPromise().then((response: any) => {
        let i = 1;
        this.videoPlaylistArray = [];
        response.forEach((doc) => {
          this.videoPlaylistArray.push(doc.data());
          if (i === response.size) {
            const successResponse = {
              error: false,
              response: this.videoPlaylistArray
            };
            resolve(successResponse);
          } else {
            i++;
          }
        });
      }).catch((error) => {
        const errorResponse = {
          error: true,
          errorDetails: error
        };
        reject(errorResponse);
      });
    });
    return promise;
  }

  getVideoPlaylist(videoID) {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`videos/`).doc(videoID)
        .get().toPromise().then((result) => {
          if (result.exists) {
            const successResponse = {
              error: false,
              response: result.data()
            };
            resolve(successResponse);
          }
        }).catch((error) => {
          const errorResponse = {
            error: true,
            errorDetails: error
          };
          reject(errorResponse);
        });
    });
    return promise;
  }

  incrementSeriesVideoLike(videoData, episodeID, uid) {
    const promise = new Promise((resolve, reject) => {
      if (episodeID === null) {
        let likes = videoData.likes.likes;
        let likedBy = videoData.likes.likedBy;
        likes++;
        likedBy.push(uid);
        const dataForUpdating = {
          likes: {
            likes: likes,
            likedBy: likedBy
          }
        };
        this.angularFirestore.collection(`videos/`).doc(videoData.videoID)
          .set(dataForUpdating, { merge: true }).then(() => {
            const successResponse = {
              error: false,
              response: {
                message: 'Like updated'
              }
            };
            resolve(successResponse);
          }).catch((error) => {
            const errorResponse = {
              error: true,
              errorDetails: error
            };
            reject(errorResponse);
          });
      } else {
        let episode = videoData.episode;
        let episodeLikes = videoData.episode[episodeID].likes.likes;
        const episodeLikedBy = videoData.episode[episodeID].likes.likedBy;
        episodeLikes++;
        episodeLikedBy.push(uid);
        const dataForUpdating = {
          likes: episodeLikes,
          likedBy: episodeLikedBy
        };
        episode[episodeID].likes = dataForUpdating;
        this.angularFirestore.collection(`videos/`).doc(videoData.videoID)
          .set({ episode: episode }, { merge: true }).then(() => {
            const successResponse = {
              error: false,
              response: {
                message: 'Like updated'
              }
            };
            resolve(successResponse);
          }).catch((error) => {
            const errorResponse = {
              error: true,
              errorDetails: error
            };
            reject(errorResponse);
          });
      }
    });
    return promise;
  }

  increamentViews(videoData, episodeID) {
    if (episodeID === null) {
      let videoViews = videoData.views;
      videoViews++;
      this.angularFirestore.collection(`videos/`).doc(videoData.videoID)
        .set({ views: videoViews }, { merge: true }).then(() => {
          console.log('Main video view increased');
         });
    } else {
      // episodeID = Number(episodeID);
      let episode = videoData.episode;
      console.log('videoData--> ', videoData);
      let episodeView = videoData.episode[episodeID].views;
      episodeView++;
      episode[episodeID].views = episodeView;
      this.angularFirestore.collection(`videos/`).doc(videoData.videoID)
        .set({ episode: episode }, { merge: true }).then(() => { 
          console.log('episode video view increased');
        });

    }
  }

  ngOnDestroy() {

  }
}

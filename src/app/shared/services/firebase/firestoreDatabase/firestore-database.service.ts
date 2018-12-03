import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
// import 'rxjs/add/operator/mergeMap';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDatabaseService implements OnDestroy {
  observeValueChange: any;
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
    const promise = new Promise ((resolve, reject) => {
      this.angularFirestore.collection(`users`).doc(uid).get().toPromise().then((value) => {
        const successResponse = {
          error: false,
          response: value.data()
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

  createNewVideoPlaylist(videoData) {
    const reff = this.angularFirestore.collection(`videos/`).add(videoData)
    .then((res) => {
      console.log('res---> ', res);
    })
    .catch((error) => {
      console.log('res---> ', error);
    });
    // .doc(videoData.videoID)
    // .set(videoData).then((successResponse) => {
    //   console.log('Video Data added---> ', successResponse);
    // }).catch((error) => {
    //   console.log('Error while creating new video data---> ', error);
    // });
  }

  getAllVideoPlaylist() {
    const promise = new Promise((resolve, reject) => {
      this.angularFirestore.collection(`videos/`).get().toPromise().then((response) => {
        console.log('size---> ', response.size);
        let videoPlaylistArray: any[] = [];
        response.forEach((doc) => {
          videoPlaylistArray.push(doc.data());
        });
        const successResponse = {
          error: false,
          response: videoPlaylistArray
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

  pushDocInArray(data: firebase.firestore.QuerySnapshot) {
    const promise = new Promise ((resolve, reject) => {
      let dataInArray: any[] = [];
      data.forEach(doc => {
        dataInArray.push(doc.data());
      });
    });
  }

  ngOnDestroy() {

  }
}

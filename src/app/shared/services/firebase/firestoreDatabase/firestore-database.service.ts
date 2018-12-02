import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';

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

  ngOnDestroy() {

  }
}

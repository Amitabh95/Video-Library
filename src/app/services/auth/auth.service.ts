import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  userAuthState: any;

  constructor(private angularFireAuth: AngularFireAuth) { }

  googleLogin() {
      this.login(new firebase.auth.GoogleAuthProvider(), 'Google');
  }

  facebookLogin() {
    this.login(new firebase.auth.FacebookAuthProvider(), 'Facebook');
  }

  emailSignUp(email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((signupData) => {
          const successResponse = {
            error: false,
            response: signupData.user
          };
          resolve(successResponse);
        })
        .catch(error => {
          const errorResponse = {
            error: true,
            errorDetails: error
          };
          reject(errorResponse);
        });
    });
    return promise;
  }

  forgotPassword(email) {
    const promise = new Promise ((resolve, reject) => {
      this.angularFireAuth.auth.sendPasswordResetEmail(email)
      .then(() => {
        const forgetSuccessPasswordResponse = {
          error: false,
          message: 'Successfully sent reset email'
        };
        resolve(forgetSuccessPasswordResponse);
      })
      .catch((error) => {
        const forgetErrorPasswordResponse = {
          error: true,
          errorDetails: error
        };
        reject(forgetErrorPasswordResponse);
      });
    });
    return promise;
  }

  loginWithEmail(email: string, password: string) {
    const promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
            .then((loginData) => {
              const successResponse = {
                error: false,
                response: loginData.user
              };
              resolve(successResponse);
            });
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

  login(provider: AuthProvider, providerName) {
    this.angularFireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        this.angularFireAuth.auth.signInWithRedirect(provider);
      });
  }

  checkLoginStatus() {
    const promise = new Promise((resolve, reject) => {
      this.userAuthState = this.angularFireAuth.authState.subscribe((loginStatus) => {
        const successResponse = {
          error: false,
          response: loginStatus
        };
        resolve(successResponse);
      }, (error) => {
        const errorResponse = {
          error: true,
          errorDetails: error
        };
        reject(errorResponse);
      });
    });
    return promise;
  }

  signOut() {
    const promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signOut().then(() => {
        localStorage.clear();
        const successResponse = {
          error: false,
          logoutStatus: true
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
    this.userAuthState.unsubscribe();
  }
}

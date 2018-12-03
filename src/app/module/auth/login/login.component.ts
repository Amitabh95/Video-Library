import { Component, OnInit } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginEmail: string;
  loginPassword: string;
  signupEmail: string;
  signupPassword: string;
  forgotPasswordEmail: string;
  constructor(
    private authService: FirebaseAuthenticationService,
    private router: Router,
    private angularFirestore: FirestoreDatabaseService
  ) { }

  ngOnInit() {
    this.authService.checkLoginStatus()
      .then((statusValue) => {
        console.log('Auth Status-> ', statusValue);
      })
      .catch((error) => {
        console.log('Error--> ', error);
      });
  }

  loginWithGoogle() {
    this.authService.googleLogin().then((response: any) => {
      console.log('Success response---> ', response);
      if (!response.error) {
        this.saveUserData(response);
      }
    }).catch((error3) => {
      console.log('Error---> ', error3);
    });
  }

  loginWithFacebook() {
    this.authService.facebookLogin().then((response: any) => {
      console.log('Success response---> ', response);
      if (!response.error) {
        this.saveUserData(response);
      }
    }).catch((error) => {
      console.log('Error---> ', error);
    });
  }

  signupWithEmail() {
    this.authService.emailSignUp(this.signupEmail, this.signupPassword)
      .then((signupData) => {
        console.log('Signup Success---> ', signupData);
        this.authService.loginWithEmail(this.signupEmail, this.signupPassword).then((loginData: any) => {
          console.log('Login Successful after signup---> ', loginData);
          if (!loginData.error) {
            this.saveUserData(loginData);
          }
        });
      }).catch((error) => {
        console.log('Signup failed--> ', error);
      });
  }

  loginWithEmail() {
    this.authService.loginWithEmail(this.loginEmail, this.loginPassword).then((loginData: any) => {
      console.log('Login Success---> ', loginData);
      if (!loginData.error) {
        this.saveUserData(loginData);
      }
    }).catch((error) => {
      console.log('Error while login---> ', error);
    });
  }

  sendResetEmail() {
    this.authService.forgotPassword(this.forgotPasswordEmail)
      .then((successResponse) => {
        console.log('Success --->', successResponse);
      }).catch((errorResponse) => {
        console.log('Error ---> ', errorResponse);
      });
  }

  signOut() {
    this.authService.signOut().then((logoutValue) => {
      console.log('Logout Value--->', logoutValue);
      this.authService.checkLoginStatus()
        .then((value) => {
          console.log('Login status after logout---> ', value);
        });
    }).catch((error) => {
      console.log('Logout error--> ', error);
    });
  }

  saveUserData(response) {
    if (response) {
      this.angularFirestore.isUserPresent(response.response.uid).then((value) => {
        if (!value) {
          const newMemberData = {
            uid: response.response.uid,
            profile: {
              name: response.response.displayName,
              phone: response.response.phoneNumber,
              location: '',
              email: response.response.email,
              photoURL: response.response.photoURL
            },
            accountCreatedOn: Date.now(),
            lastSignin: {
              lastSigninTime: '',
              currentSigninTime: Date.now(),
            },
            isAdmin: false,
            isFirstLogin: true,
            watchedSeries: [],
            liked: {
              seriesID: [],
              videoID: []
            }
          };
          this.angularFirestore.createUser(response.response.uid, newMemberData).then((res: any) => {
            if (!res.error) {
              this.router.navigate(['/']);
            } else {
              console.log('Error in creation of new user ---> ', res);
            }
          }).catch((err) => {
            console.log('error---> ', err);
          });
        } else {
          this.angularFirestore.getUserData(response.response.uid).then((userData: any) => {
            console.log('Get user---> ', userData);
            if (!userData.error) {
              const existingMemberData = {
                isFirstLogin: false,
                lastSignin: {
                  lastSigninTime: userData.response.lastSignin.currentSigninTime,
                  currentSigninTime: Date.now(),
                }
              };
              this.angularFirestore.updateUserData(response.response.uid, existingMemberData).then((res: any) => {
                if (!res.error) {
                  this.router.navigate(['/']);
                } else {
                  console.log('Error---> ', res.errorDetails);
                }
              }).catch((error1) => {
                console.log('Error---> ', error1);
              });
            }
          }).catch((error) => {
            console.log('Error---> ', error);
          });
        }
      }).catch((error2) => {
        console.log(error2);
      });
    } else {
      console.log('Getting empty reponse');
    }
  }

}

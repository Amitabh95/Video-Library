import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirebaseAuthenticationService } from 'src/app/shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { Router } from '@angular/router';
import { FirestoreDatabaseService } from 'src/app/shared/services/firebase/firestoreDatabase/firestore-database.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { MaterialDialogComponent } from '../../shared-components/material-dialog/material-dialog.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  loginEmail: string;
  loginPassword: string;
  signupEmail: string;
  signupPassword: string;
  forgotPasswordEmail: string;
  loginPasswordType: string;
  loginPasswordHideShow: string;
  signupPasswordType: string;
  signupPasswordHideShow: string;
  enableEmailLoginButton: boolean;
  enableSignupButton: boolean;
  enableGoogleLoginButton: boolean;
  enableFacebookLoginButton: boolean;
  constructor(
    private authService: FirebaseAuthenticationService,
    private router: Router,
    private angularFirestore: FirestoreDatabaseService,
    private toastrAlert: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.loginPasswordType = 'password';
    this.loginPasswordHideShow = 'Show';
    this.signupPasswordType = 'password';
    this.signupPasswordHideShow = 'Show';
    this.enableEmailLoginButton = true;
    this.enableSignupButton = true;
    this.enableGoogleLoginButton = true;
    this.enableFacebookLoginButton = true;
  }

  ngOnInit() {
    this.initForm();
    this.authService.checkLoginStatus()
      .then((successResponse: any) => {
        if (!successResponse.error) {
          this.router.navigate(['/']);
        }
      })
      .catch((error: any) => {
        this.toastrAlert.error(error.errorResponse.message);
      });
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      loginEmail: new FormControl('', [Validators.required, Validators.email]),
      loginPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.signupForm = this.formBuilder.group({
      signupEmail: new FormControl('', [Validators.required, Validators.email]),
      signupPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  showPasswordDialog() {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      height: '200px',
      width: '400px',
      data: {
        purpose: 'forgotPassword',
        email: ''
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.sendResetEmail(result.email);
      }
    });
  }

  toggleLoginPasswordType() {
    if (this.loginPasswordType === 'password') {
      this.loginPasswordHideShow = 'Hide';
      this.loginPasswordType = 'text';
    } else if (this.loginPasswordType === 'text') {
      this.loginPasswordHideShow = 'Show';
      this.loginPasswordType = 'password';
    }
  }

  toggleSignupPasswordType() {
    if (this.signupPasswordType === 'password') {
      this.signupPasswordHideShow = 'Hide';
      this.signupPasswordType = 'text';
    } else if (this.signupPasswordType === 'text') {
      this.signupPasswordHideShow = 'Show';
      this.signupPasswordType = 'password';
    }
  }

  loginWithGoogle() {
    this.enableGoogleLoginButton = false;
    this.authService.googleLogin().then((response: any) => {
      if (!response.error) {
        this.toastrAlert.success('Login Successful!!');
        this.saveUserData(response);
      }
    }).catch((error: any) => {
      this.enableGoogleLoginButton = true;
      this.toastrAlert.error(error.errorDetails.message);
    });
  }

  loginWithFacebook() {
    this.enableFacebookLoginButton = false;
    this.authService.facebookLogin().then((response: any) => {
      if (!response.error) {
        this.toastrAlert.success('Login Successful!!');
        this.saveUserData(response);
      }
    }).catch((error) => {
      this.enableFacebookLoginButton = true;
      this.toastrAlert.error(error.errorDetails.message);
    });
  }

  signupWithEmail() {
    this.enableSignupButton = false;
    this.authService.emailSignUp(this.signupEmail, this.signupPassword)
      .then((signupData: any) => {
        if (!signupData.error) {
          this.toastrAlert.success('Confirmation mail has been sent to your email. Please confirm your email');
        }
      }).catch((error: any) => {
        this.enableSignupButton = true;
        this.toastrAlert.error(error.errorDetails.message);
      });
  }

  loginWithEmail() {
    this.enableEmailLoginButton = false;
    this.authService.loginWithEmail(this.loginEmail, this.loginPassword).then((loginData: any) => {
      if (!loginData.error) {
        this.toastrAlert.success('Sign in successful.');
        this.saveUserData(loginData);
      }
    }).catch((error: any) => {
      this.enableEmailLoginButton = true;
      this.toastrAlert.error(error.errorDetails.message);
    });
  }

  sendResetEmail(email) {
    this.authService.forgotPassword(email)
      .then((successResponse: any) => {
        if (!successResponse.error) {
          this.toastrAlert.success(successResponse.message);
        }
      }).catch((errorResponse: any) => {
        this.toastrAlert.error(errorResponse.errorDetails.message);
      });
  }

  signOut() {
    this.authService.signOut().then((logoutValue) => {
      this.authService.checkLoginStatus()
        .then((value) => {
        });
    }).catch((error) => {
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
            this.toastrAlert.error(err.errorDetails.message);
          });
        } else {
          this.angularFirestore.getUserData(response.response.uid).then((userData: any) => {
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

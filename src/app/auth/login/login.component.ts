import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';


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
    private authService: AuthService
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
    this.authService.googleLogin();
  }

  loginWithFacebook() {
    this.authService.facebookLogin();
  }

  signupWithEmail() {
    this.authService.emailSignUp(this.signupEmail, this.signupPassword)
    .then((signupData) => {
      console.log('Signup Success---> ', signupData);
    }).catch((error) => {
      console.log('Signup failed--> ', error);
    });
  }

  loginWithEmail() {
    this.authService.loginWithEmail(this.loginEmail, this.loginPassword).then((loginData) => {
      console.log('Login Success---> ', loginData);
    })
    .catch((error) => {
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

}

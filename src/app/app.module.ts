import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { FirebaseAuthenticationService } from './shared/services/firebase/firebaseAuthentication/firebase-authentication.service';
import { FirestoreDatabaseService } from './shared/services/firebase/firestoreDatabase/firestore-database.service';
import { EmbedVideo } from 'ngx-embed-video';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { MaterialDialogComponent } from './module/shared-components/material-dialog/material-dialog.component';
import { MaterialCoreModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    MaterialDialogComponent
  ],

  entryComponents: [MaterialDialogComponent],

  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'videoLibrary'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    EmbedVideo.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialCoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FirebaseAuthenticationService,
    FirestoreDatabaseService,
    HttpClient,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

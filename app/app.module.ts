import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HomeMPage } from "../pages/home-m/home-m";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ClinicaServiceProvider } from '../providers/clinica-service/clinica-service';
import { MessageServiceProvider } from '../providers/message-service/message-service';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyAqgZ2ahuD-_A8Fg9cQM2TddaJjB6Cr3yQ",
  authDomain: "qomtec-college.firebaseapp.com",
  databaseURL: "https://qomtec-college.firebaseio.com",
  projectId: "qomtec-college",
  storageBucket: "qomtec-college.appspot.com",
  messagingSenderId: "92306874555"

};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    HomeMPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    HomeMPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    UserServiceProvider,
    ClinicaServiceProvider,
    MessageServiceProvider
  ]
})
export class AppModule { }

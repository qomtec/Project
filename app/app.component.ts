import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from "../pages/login/login";
import { HomeMPage } from '../pages/home-m/home-m';

import { AuthServiceProvider } from "../providers/auth-service/auth-service";

import * as firebase from 'firebase'

import { UserServiceProvider } from '../providers/user-service/user-service';
import { User } from '../models/user.model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  currentUser: User;
  constructor(
    public alertCtrl: AlertController,
    authService: AuthServiceProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public userService: UserServiceProvider
  ) {
    authService
    .afAuth
    .authState
    .subscribe((userData: firebase.User)=> {
      if (userData){
        /*if (userData.emailVerified == true){
          
        } else {
        
          this.showAlert("Aún no se ha confirmado la cuenta");
          this.rootPage = LoginPage;
        }*/
        try {
            
          this.userService.currentUser
          .valueChanges()
          .subscribe( (user: User) => {
            console.log(user.tipo);
            
            if (user.tipo == "d") {
              this.rootPage = HomeMPage;
              console.log("Hola")
            } else if (user.tipo == "p"){
              this.rootPage = HomePage;
            }
            
            
          }); 
        } catch (error) {
          
        }
      } else {
        this.rootPage = LoginPage;
        console.log("Aqui LoginPage");
        
      }
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}


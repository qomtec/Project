import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import 'rxjs/add/operator/first';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from './../home/home';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import * as firebase from 'firebase/app';
import { User } from '../../models/user.model';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  signupForm: FormGroup;
  codigo_clinica: string = "0";
  constructor(
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,

    public userService: UserServiceProvider
  ) {

    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      clinica: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipo: ['', [Validators.required, Validators.minLength(1)]],
      codigo_clinica: [' ', [Validators.required, Validators.minLength(1)]],
    });

  }
  buscar() {
    let formUser = this.signupForm.value;
    console.log(formUser.clinica);
    this.userService.getClinica(formUser.clinica).then((data) => {
      let cadena: any = data.child("nombre").val();
      this.codigo_clinica = User.GenerateKey(formUser.clinica);
      console.log(cadena);
      if (cadena == null) {
        this.showAlert("No existe clinica registrada con ese correo");
        this.codigo_clinica = "";
      }
    }).catch((error) => {
      console.log(error);
      this.codigo_clinica = "";
    });
  }
  onSubmit(): void {


    if (this.codigo_clinica != "") {
      let loading: Loading = this.showLoading();
      let formUser = this.signupForm.value;
      let username: string = formUser.username;
      formUser.codigo_clinica = this.codigo_clinica;
      console.log(formUser.name + " -- " + formUser.clinica + " -- " + formUser.email + " -- " + formUser.tipo);
      this.authService.createAuthUser({
        email: formUser.email,
        password: formUser.password
      }).then((authUser: firebase.User) => {

        delete formUser.password;
        let uuid: string = authUser.uid;
        console.log("Hola... "+ this.codigo_clinica);
        this.userService.create(formUser, uuid, formUser.codigo_clinica )
          .then(() => {
            console.log('Usuario registrado!');
            this.authService.sendverificationEmail();
            this.showAlert("Se ha enviado una correo para verificar la cuenta");
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });

      }).catch((error: any) => {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
      });
    }

  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor espera...'
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

}

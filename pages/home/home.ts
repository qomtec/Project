import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ClinicaServiceProvider } from '../../providers/clinica-service/clinica-service';

import { User } from '../../models/user.model';
import { Clinica } from "../../models/clinica.model";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  clinica: string = "";
  nombre_usuario: string = "";
  nombre_clinica: string = "";
  codigo_clinica: string = "";
  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public clinicaService: ClinicaServiceProvider) { }
    ionViewCanEnter(): Promise<boolean> {
      return this.authService.authenticated;
    }
  ionViewDidLoad() {
    this.userService.mapObjectKey<User>(this.userService.currentUser)
      .first()
      .subscribe((user: User) => {
        this.nombre_usuario = user.name;
        this.codigo_clinica = user.codigo_clinica;
        this.clinicaService.getClinica(user.codigo_clinica)
        .then((cl: Clinica) => {
          this.nombre_clinica = cl.nombre;

        }).catch ((error)=> {
          console.log(error);
        });
      });
      
  }
  logout() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}

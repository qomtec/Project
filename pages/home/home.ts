import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ClinicaServiceProvider } from '../../providers/clinica-service/clinica-service';

import { User } from '../../models/user.model';
import { Clinica } from "../../models/clinica.model";
import { MessageServiceProvider } from '../../providers/message-service/message-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  clinica: string = "";
  nombre_usuario: string = "";
  nombre_clinica: string = "";
  codigo_clinica: string = "";
  codigo_usuario: string = "";
  listado: any;
  constructor(
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public clinicaService: ClinicaServiceProvider,
    public mensajeService: MessageServiceProvider) { }
  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }
  ionViewDidLoad() {
    console.clear();
    this.userService.mapObjectKey<User>(this.userService.currentUser)
      .first()
      .subscribe((user: User) => {
        this.nombre_usuario = user.name;
        this.codigo_usuario = user.codigo;
        this.codigo_clinica = user.codigo_clinica;
        this.clinicaService.getClinica(user.codigo_clinica)
          .then((cl: Clinica) => {
            this.nombre_clinica = cl.nombre;
            this.mensajeService.listCitasPaciente(this.codigo_usuario).then(data => {
              this.listado = data;
              
            });
          }).catch((error) => {
            console.log(error);
          });
      });
  }
  logout() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}

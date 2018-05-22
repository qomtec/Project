import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ClinicaServiceProvider } from '../../providers/clinica-service/clinica-service';
import { MessageServiceProvider } from '../../providers/message-service/message-service';

import { LoginPage } from '../login/login';
import { User } from '../../models/user.model';
import { Clinica } from "../../models/clinica.model";
import { Mensaje } from '../../models/mensaje.model';
import { AngularFireList } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-home-m',
  templateUrl: 'home-m.html',
})
export class HomeMPage {
  nombre_usuario: string = "";
  nombre_clinica: string = "";
  codigo_clinica: string = "";
  listaUsuario: any;
  listaCitas: AngularFireList<Mensaje>;
  //listaCitasUsuario: any;
  myDate: String = new Date().toISOString();
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider,
    public userService: UserServiceProvider,
    public clinicaService: ClinicaServiceProvider,
    public mensajeService: MessageServiceProvider) { }

  ionViewDidLoad() {
    console.clear();    
    this.userService.mapObjectKey<User>(this.userService.currentUser)
      .first()
      .subscribe((user: User) => {
        this.nombre_usuario = user.name;
        this.codigo_clinica = user.codigo_clinica;
        this.clinicaService.getClinica(user.codigo_clinica)
          .then((cl: Clinica) => {
            this.nombre_clinica = cl.nombre;
            this.userService.getUsers(this.codigo_clinica).then(user => {
              this.listaUsuario = user;
            });
          }).catch((error) => {
            //console.log(error);
          });
      });

  }
  filterItems(event: any): void {

  }
  cont: number = 0;
  dateChange(myDate) {
    //console.log(this.myDate.toString());
    this.mensajeService.listCitas(this.authService.afAuth.auth.currentUser.uid,
      this.myDate.split('T')[0]).then(data => {
        this.mensajeService.listaCitasUsuario; 
        console.log(this.mensajeService.listaCitasUsuario);
      });
  }
  onUserOpen(item) {
    //console.log(item)
    let mensaje = new Mensaje("", "", "", "", "", "", "", 0);
    mensaje.medico = this.userService.afAuth.auth.currentUser.uid;
    mensaje.paciente = item.codigo;
    mensaje.nombre_paciente = item.name;
    this.presentPrompt(mensaje);
  }
  checkCita(lcu) {
    let alert = this.alertCtrl.create({
      title: 'Checkear cita',
      subTitle: 'Deseas dar por cumplida la cita',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          role: 'ok',
          handler: data => {
            this.mensajeService.checarCita(lcu).then(() => {
            });
          }
        }
      ]
    });
    alert.present();
  }
  salir() {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage)
  }
  presentPrompt(msj: Mensaje) {
    let alert = this.alertCtrl.create({
      title: 'Nueva cita',
      inputs: [
        {
          name: 'fecha',
          placeholder: 'Fecha',
          type: 'date'
        },
        {
          name: 'hora',
          placeholder: 'Hora',
          type: 'time'
        },
        {
          name: 'mensaje',
          placeholder: 'Mensaje',
          type: 'Text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },

        {
          text: 'Guardar',
          handler: data => {
            if ((data.fecha != null) && (data.mensaje != "") && (data.hora != null)) {
              msj.fecha = data.fecha;
              msj.hora = data.hora;
              msj.mensaje = data.mensaje;
              //this.listaCitas = this.mensajeService.listMessages(msj);
              this.mensajeService.createMessage(msj).then(() => {
               this.mensajeService.createMessagePaciente(msj).then(()=>{

               });
              });
            } else {
              this.presentAlert();
            }
          }
        }
      ]
    });
    alert.present();
  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Citas',
      subTitle: 'Falta información',
      buttons: ['Ok']
    });
    alert.present();
  }
}

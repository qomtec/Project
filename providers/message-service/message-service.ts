import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { Mensaje } from '../../models/mensaje.model';

import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class MessageServiceProvider {
  public listaCitasUsuario: any;
  constructor(public db: AngularFireDatabase,
              public localNotifications: LocalNotifications) { }
  
  public createMessage(mensaje: Mensaje): Promise<any> {
    mensaje.timestamp = firebase.database.ServerValue.TIMESTAMP;
    return Promise.resolve(this.db.object('/citas/' + mensaje.medico + '/' + mensaje.fecha + '/' + mensaje.paciente).set(mensaje));
  }
  public createMessagePaciente(mensaje: Mensaje): Promise<any>{
    mensaje.timestamp = firebase.database.ServerValue.TIMESTAMP;
    return Promise.resolve(this.db.object('/citasp/' + mensaje.paciente + '/' + mensaje.fecha).set(mensaje));
  }
  
  public listMessages(mensaje: Mensaje): AngularFireList<Mensaje> {
    return this.db.list('/citas/' + mensaje.medico + '/' + mensaje.fecha + '/' + mensaje.paciente,
      ref => ref.orderByChild('timestamp'));
  }
  public listMessagesPaciente(mensaje: Mensaje): AngularFireList<Mensaje> {
    return this.db.list('/citasp/' + mensaje.paciente + '/' + mensaje.fecha,ref => ref.orderByKey());
  }

  public listCitas(codigo: string, fecha: string): Promise<Mensaje> {
    return new Promise((resolve, reject) => {
      let obj: any;
      let itemsRef: AngularFireList<Mensaje>;
      let path: string = '/citas/' + codigo + '/' + fecha + '/';
      itemsRef = this.db.list(path, ref => ref.orderByChild('estado').equalTo(0));
      itemsRef.valueChanges().subscribe(data => {
        obj = data;
        this.listaCitasUsuario = data;
        resolve(obj);
      });
    });
  }
  public listCitasPaciente(codigo: string): Promise<any>{
    return new Promise((resolve, reject)=>{
      
      let obj = [new Mensaje("", "", "", "", "", "", "", 0)];
      let itemsRef: AngularFireList<Mensaje>;
      let path: string ='/citasp/' + codigo + '/';
      obj.pop();
      itemsRef = this.db.list(path, ref=> ref.orderByKey());
      itemsRef.valueChanges().subscribe(data=>{
        
        //this.listaCitasUsuario = null;
        try{
          obj = [new Mensaje("", "", "", "", "", "", "", 0)];
          obj.pop();
        } catch(err ){

        }
        data.forEach(valor =>{
        
          obj.push(valor);
        });
        this.localNotifications.schedule({
          id: 1,
          text: 'Single ILocalNotification',
          data: 'chema'
        });
        this.listaCitasUsuario = obj;
        resolve("")
      });
      
    });
  }
  public checarCita(item: any): Promise<any>{
    item.estado = 1;
    this.db.object('/citasp/' + item.paciente + '/' + item.fecha).set(item);
    return Promise.resolve(this.db.object('/citas/' + item.medico + '/' + item.fecha + '/' + item.paciente).set(item));
  }

}

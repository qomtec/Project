import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { Mensaje } from '../../models/mensaje.model';

@Injectable()
export class MessageServiceProvider {
  public listaCitasUsuario: any;
  constructor(public db: AngularFireDatabase) { }
  public createMessage(mensaje: Mensaje, lista: AngularFireList<Mensaje>): Promise<any> {

    mensaje.timestamp = firebase.database.ServerValue.TIMESTAMP;
    //console.log(mensaje);
    return Promise.resolve(this.db.object('/citas/' + mensaje.medico + '/' + mensaje.fecha + '/' + mensaje.paciente).set(mensaje));
  }
  public listMessajes(mensaje: Mensaje): AngularFireList<Mensaje> {
    return this.db.list('/citas/' + mensaje.fecha + '/' + mensaje.medico + '/' + mensaje.paciente,
      ref => ref.limitToLast(10).orderByChild('timestamp'));
  }
  /*private extraer(keys: any = [], codigo: string, fecha: string): Promise<Mensaje> {
    return new Promise((resolve, reject) => {
      let obj: any = [];
      keys.forEach(i => {
        let itemsRef: AngularFireList<Mensaje>;
        let items: Observable<Mensaje[]>;
        let ref = firebase.database().ref('/citas');
        let iref = ref.child(i.key).orderByChild('fecha').equalTo(fecha);

        itemsRef = this.db.list('/citas/' + i.key + '/', ref => ref.orderByChild('de').equalTo(codigo));
        items = itemsRef.valueChanges();
        items.forEach(i => {
          console.log(fecha);
          i.forEach(c => {
            if (c.estado == 0) {
              obj.push({
                de: c.medico,
                para: c.paciente,
                mensaje: c.mensaje,
                fecha: c.fecha,
                hora: c.hora,
                timestamp: c.timestamp,
                estado: c.estado
              });
            }
          });
          resolve(obj);
        })
          .catch((err: any) => {
            reject(err)
          });
      });
    });
  }*/
  public listCitas(codigo: string, fecha: string): Promise<Mensaje> {
    return new Promise((resolve, reject) => {
      let obj: any;
      let itemsRef: AngularFireList<Mensaje>;
      let items: Observable<Mensaje[]>;
      let path: string = '/citas/' + codigo + '/' + fecha + '/';
      itemsRef = this.db.list(path, ref=> ref.orderByChild('estado').equalTo(0));
      itemsRef.valueChanges().subscribe(data => {
        obj = data;
        this.listaCitasUsuario = data;
        resolve(obj);
      });
      /*items = itemsRef.valueChanges().subscribe();
      items.forEach(data => {
        obj = data;
        console.log(obj);
        resolve(obj);
      }).then(data => {
        
        
      }).catch((err) =>{
        reject(err)
      });*/
    });
    /*
    let query = firebase.database().ref('/citas').orderByKey();
    query.once("value")
    .then(data =>{
      data.forEach( d=> {
        let key = d.key;
        let child = d.val();
        console.log(child);
  
      });
    }).catch();
    --------------------------
    return new Promise((resolve, reject) =>{
      let itemsRef: AngularFireList<Mensaje>;
      let items: Observable<Mensaje[]>;
      itemsRef = this.db.list('/citas', ref => ref.orderByChild('de').equalTo(codigo));
      items = itemsRef.valueChanges();
      items.forEach(i => {
        let obj: any = [];
        console.log(i);
        i.forEach(c => {
          if (c.estado == 0) {
            obj.push({
              para: c.para,
              mensaje: c.mensaje,
              fecha: c.fecha,
              hora: c.hora,
              timestamp: c.timestamp,
              de: c.de
            });
          }
        });
        resolve(obj);
      })
      .catch ((err: any) => {
        reject(err);
      })
    });*/
  }

}

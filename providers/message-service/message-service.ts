import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

import { Mensaje } from '../../models/mensaje.model';

@Injectable()
export class MessageServiceProvider {

  constructor(public db: AngularFireDatabase) {  }
  public createMessage(mensaje: Mensaje,lista: AngularFireList<Mensaje>): Promise<any>{
    
    mensaje.timestamp = firebase.database.ServerValue.TIMESTAMP;
    console.log(mensaje);
    return Promise.resolve(lista.push(mensaje));
  }
  public listMessajes(mensaje: Mensaje): AngularFireList<Mensaje>{
    return this.db.list('/citas/'+ mensaje.para + "-"+ mensaje.de,
    ref => ref.limitToLast(10).orderByChild('timestamp'));
  }
  public listCitas(codigo: string): Promise<Mensaje>{
    return new Promise((resolve, reject) =>{
      let itemsRef: AngularFireList<Mensaje>;
      let items: Observable<Mensaje[]>;
      itemsRef = this.db.list('/citas', ref => ref.orderByKey().orderByChild('de').equalTo(codigo));
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
    });
  }

}

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators/map';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject, AngularFireList } from "angularfire2/database";
//import * as firebase from 'firebase/app';
import 'firebase/storage';

import { Clinica } from "../../models/clinica.model";

@Injectable()
export class ClinicaServiceProvider {

  constructor(public afAuth: AngularFireAuth,
    public db: AngularFireDatabase) {

  }
  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list
      .snapshotChanges()
      .map(actions => actions.map(action => ({ $key: action.key, ...action.payload.val() })));
  }
  mapObjectKey<T>(object: AngularFireObject<T>): Observable<T> {
    return object
      .snapshotChanges()
      .map(action => ({ $key: action.key, ...action.payload.val() }));
  }
  get(clinicaId: string): AngularFireObject<Clinica> {
    return this.db.object<Clinica>(`/clinica/${clinicaId}`);
  }
  getClinica(clinicaId: string): Promise<any>{
    return new Promise((resolve,reject) => {
      this.db.database.ref('/clinica/')
      .child(clinicaId).once('value',(data) => {
        resolve(data.val());
      }).catch((error: any) => {
        reject(error);
      });
    });
  }
  listenFirstState(clinicaId: string): void {
    this.currentClinica = this.db.object(`/clinica/${clinicaId}`);
    //this.setClinicas(authUser.uid);
  }
  /*private setClinicas(uidToExclude: string): void {
  }*/
  clinica: Observable<Clinica[]>;
  currentClinica: AngularFireObject<Clinica>;
  idClinica: string = "";
}

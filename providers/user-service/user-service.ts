import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';

import { Observable } from 'rxjs';
//import { map } from 'rxjs/operators/map';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireObject, AngularFireList } from "angularfire2/database";

import * as firebase from 'firebase/app';
import 'firebase/storage';

import { User } from '../../models/user.model';
//import { Query } from '@firebase/database';
//import { ArrayObservable } from 'rxjs/observable/ArrayObservable';



@Injectable()
export class UserServiceProvider {

  users: Observable<User[]>;
  currentUser: AngularFireObject<User>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {

    this.listenAuthState();
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
  private setUsers(uidToExclude: string): void {
    this.users = this.mapListKeys<User>(
      this.db.list<User>(`/users`,
        (ref: firebase.database.Reference) => ref.orderByChild('name')
      )
    )
      .map((users: User[]) => {

        return users.filter((user: User) => user.$key !== uidToExclude);
      });
  }

  private listenAuthState(): void {
    this.afAuth
      .authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          this.currentUser = this.db.object(`/users/${authUser.uid}`);
          this.setUsers(authUser.uid);
        }
      });
  }

  create(user: User, uuid: string, codigo: string): Promise<void> {

    return this.db.object("/users/" + uuid)
      .set(user)
      .catch();
  }

  edit(user: { name: string, username: string, photo: string }): Promise<void> {
    return this.currentUser
      .update(user)
      .catch();
  }


  getClinica(email: string): Promise<any> {
    let ref = firebase.database().ref("/clinica/" + User.GenerateKey(email));
    return ref.once("value");
  }

  public getUsers(clinica: string): Promise<User> {
    return new Promise((resolve, reject) => {
      let itemsRef: AngularFireList<User>;
      let items: Observable<User[]>;
      //let userRef = ref.child("users").orderByChild("codigo_clinica").equalTo(clinica).once('value');
      itemsRef = this.db.list('/users', ref => ref.orderByChild('codigo_clinica').equalTo(clinica));
      items = itemsRef.valueChanges();
      items.forEach(i => {
        let obj: any = [];
        console.log(i);
        i.forEach(c => {
          
          if (c.tipo == 'p') {
            obj.push({
              codigo: c.codigo,
              codigo_clinica: c.codigo_clinica,
              email: c.email,
              name: c.name,
              photo: c.photo,
              tipo: c.tipo,
              username: c.username
            });
          }
        });
        resolve(obj);
      })
        .catch((err: any) => {
          reject(err);
        });
    })

  }

}

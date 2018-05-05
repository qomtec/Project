import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireList, AngularFireObject } from 'angularfire2/database';
//import { BaseService } from "./base.service";

import * as firebase from 'firebase/app';

@Injectable()
export class AuthServiceProvider {

  constructor(
              public afAuth: AngularFireAuth
              ) {}

  createAuthUser(user: { email: string, password: string }): Promise<firebase.User> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch();
  }

  signinWithEmail(user: { email: string, password: string }): Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authUser: firebase.User) => {
        return authUser != null;
      }).catch();
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
  sendverificationEmail() {
    firebase.auth().onAuthStateChanged(user => {
      user.sendEmailVerification();
    });
  }
  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
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
}

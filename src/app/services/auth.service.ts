import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../model/user";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  signUp(user: User, password: string, onSignedUp: () => void) {
    this.http.post<User>('https://brainyclub-eu.backendless.app/api/users/register', {
      'email': user.getEmail(),
      'password': password,
      'firstName': user.getFirstName(),
      'lastName': user.getLastName(),
      'sex': user.getSex()
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe((result) => {
      if (result !== null) {
        onSignedUp();
      }
    });
  }

  login(email: string, password: string, onLoggedIn: (email: string, userToken: string, objectId: string) => void) {
    this.http.post<{
      email: string;
      'user-token': string;
      objectId: string
    }>('https://brainyclub-eu.backendless.app/api/users/login', {
      'login': email,
      'password': password
    },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }).subscribe((result) => {
        if (result['user-token'] !== null) {
          onLoggedIn(result.email, result['user-token'], result.objectId);
        }
      });
  }

  loginWithProvider(credential: { credential: string }) {
    this.http.post('https://brainyclub-eu.backendless.app/api/users/oauth/googleplus/login', {
      'accessToken': credential.credential
    },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }).subscribe((result) => {
        console.log(result);

      });

  }

  logout() {
    this.http.get('https://brainyclub-eu.backendless.app/api/users/logout', {
      headers: new HttpHeaders({
        'user-token': localStorage.getItem('userToken')!
      })
    });
  }

  findUsers(name: string, userToken: string, onFind: (users: Array<User>) => void) {
    this.http.get<Array<User>>(`https://brainyclub-eu.backendless.app/api/data/Users?where=firstName%20%3D%20'${name}'`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user-token': localStorage.getItem('userToken')!
        }),
      }
    ).subscribe((result) => {
      onFind(result);
    });
  }

  getFullName(objectId: string, onGet: (user: User) => void) {
    this.http.get<User>(`https://brainyclub-eu.backendless.app/api/data/Users/${objectId}?property=%60firstName%60&property=%60lastName%60`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user-token': localStorage.getItem('userToken')!
        }),
      }
    ).subscribe((result) => {
      onGet(result);
    });
  }
}

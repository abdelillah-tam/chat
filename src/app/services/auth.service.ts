import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../model/user";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  signUp(user: User, password: string, provider: string, onSignedUp: () => void) {
    this.http.post<User>('https://brainyclub-eu.backendless.app/api/users/register', {
      'email': user.getEmail(),
      'password': password,
      'firstName': user.getFirstName(),
      'lastName': user.getLastName(),
      'sex': user.getSex(),
      'provider': provider
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe((result) => {
      console.log(result);
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

  logout() {
    this.http.get('https://brainyclub-eu.backendless.app/api/users/logout', {
      headers: new HttpHeaders({
        'user-token': localStorage.getItem('userToken')!
      })
    });
  }

  findUsersByName(name: string, userToken: string, onFind: (users: Array<User>) => void) {
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

  findUserByEmail(email: string, onFind: (user: User | undefined) => void){
    this.http.get<Array<User>>(`https://eu-api.backendless.com/EC90E79D-4443-4858-8D5E-02E90D0C63B1/58C3266A-8C33-4D5C-854B-66704F41CFB6/data/Users?where=email%3D'${email}'&property=%60provider%60&property=%60email%60&property=%60firstName%60&property=%60lastName%60`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      }
    ).subscribe((result) => {
      onFind(result[0]);
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

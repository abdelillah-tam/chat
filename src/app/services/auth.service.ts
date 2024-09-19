import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../model/user";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

  }

  signUp(user: User, password: string, provider: string) {
    return this.http.post<User>('https://brainyclub-eu.backendless.app/api/users/register', {
      'email': user.getEmail(),
      'password': password,
      'firstName': user.getFirstName(),
      'lastName': user.getLastName(),
      'sex': user.getSex(),
      'provider': provider
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  login(email: string, password: string) {
    return this.http.post<{
      email: string;
      'user-token': string;
      objectId: string
    }>('https://brainyclub-eu.backendless.app/api/users/login', {
      'login': email,
      'password': password
    },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });
  }

  verifyIfTokenValid(userToken: string) {
    return this
      .http
      .get<boolean>(`https://brainyclub-eu.backendless.app/api/users/isvalidusertoken/${userToken}`);
  }

  logout() {
    this.http.get('https://brainyclub-eu.backendless.app/api/users/logout', {
      headers: new HttpHeaders({
        'user-token': localStorage.getItem('userToken')!
      })
    });
  }

  findUsersByName(name: string) {
    return this.http.get<Array<User>>(`https://brainyclub-eu.backendless.app/api/data/Users?where=firstName%20%3D%20'${name}'`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user-token': localStorage.getItem('userToken')!
        }),
      }
    );
  }

  findUserByEmail(email: string, onFind: (user: User | undefined) => void) {
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
  findUserByObjectId(objectId: string) {
    return this.http.get<User>(`https://brainyclub-eu.backendless.app/api/data/Users/${objectId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user-token': localStorage.getItem('userToken')!
        }),
      }
    );
  }

  findUsersByObjectId(objectsId: string[]) {
    let items: string = '('
    objectsId.forEach((item, index) => {
      if (index !== (objectsId.length - 1)) {
        items += `'` + item + `',`
      } else {
        items += `'` + item + `')`
      }

    })
    return this.http
      .get<User[]>(`https://eu-api.backendless.com/EC90E79D-4443-4858-8D5E-02E90D0C63B1/58C3266A-8C33-4D5C-854B-66704F41CFB6/data/Users?where=objectId%20IN%20${items}`)
  }

  updateInfos(
    objectId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    onSuccess: ((user: User) => void)) {

    this.http.put<User>(`https://brainyclub-eu.backendless.app/api/data/users/${objectId}`,
      {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'user-token': localStorage.getItem('userToken')!
        }),
      }
    ).subscribe((result) => {
      onSuccess(result);
    });
  }
}

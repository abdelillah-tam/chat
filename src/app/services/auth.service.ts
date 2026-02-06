import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  requestCsrfToken() {
    return this.httpClient.get(`${environment.API_CSRF}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  signup(user: User, password: string, confirmationPassword: string) {
    return this.httpClient.post<User>(
      `${environment.API}/signup`,
      {
        email: user.email,
        password: password,
        first_name: user.firstName,
        last_name: user.lastName,
        provider: user.provider,
        confirmationPassword: confirmationPassword,
      },
      {
       withCredentials: true
      },
    );
  }

  login(email: string, password: string, provider: string) {
    return this.httpClient.post<
      | {
          success: true;
          email: string;
          id: number;
        }
      | { success: false; message: string }
    >(
      `${environment.API}/login`,
      {
        email: email,
        password: password,
        provider: provider,
      },
      {
        withCredentials: true,
      },
    );
  }

  logout() {
    this.httpClient.delete(`${environment.API}/logout`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  findUsersByName(name: string) {
    return this.httpClient.post<Array<any> | { code: number; error: string }>(
      `${environment.API}/findByName`,
      {
        name: name,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      },
    );
  }

  findUserByEmail(email: string) {
    return this.httpClient.post<
      | User
      | {
          code: number;
          error: string;
        }
    >(
      `${environment.API}/findByEmail`,
      {
        email: email,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      },
    );
  }
  findUserById(id: string) {
    return this.httpClient.get<User | { code: number; error: string }>(
      `${environment.API}/find/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      },
    );
  }

  findUsersByIds(ids: number[]) {
    return this.httpClient.post<
      { user: User; profilePictureLink: string | null }[]
    >(
      `${environment.API}/findUsersByIds`,
      {
        ids: ids,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      },
    );
  }

  getUsersInContact() {
    return this.httpClient.get<
      { user: User; channel: string; lastMessageTimestamp: number }[]
    >(`${environment.API}/getInContact`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true
    });
  }
  updateInfos(
    objectId: string,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    password: string | undefined,
    provider: string,
  ) {
    if (provider !== 'google') {
      return this.httpClient.patch<boolean>(
        `${environment.API}/update/${objectId}`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true
        },
      );
    } else {
      return this.httpClient.patch<boolean>(
        `${environment.API}/updateGoogle/${objectId}`,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true
        },
      );
    }
  }

  validateToken() {
    return this.httpClient.get<boolean>(`${environment.API}/validate`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  updateProfilePicture(link: string) {
    return this.httpClient.post<string>(
      `${environment.API}/profileImageLink`,
      {
        link: link,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        withCredentials: true
      },
    );
  }

  getProfilePictureLink(id: string) {
    return this.httpClient.get<string>(
      `${environment.API}/profileImageLink/${id}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  async uploadImage(file: File, sender: string) {
    const storage = getStorage();
    let downloadUrl: string;

    const storageRef = ref(storage, `profilePicture/${sender}/${file.name}`);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    downloadUrl = url;

    return downloadUrl;
  }
}

export class MockAuthService {}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { LOGIN, loginAction, loginResultAction } from './login.actions';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { errorAction, SIGNUP } from '../auth/auth.actions';
import { User } from '../../model/user';

@Injectable()
export class LoginEffect {
  login$;
  signup$;

  constructor(private action$: Actions, private authService: AuthService) {
    this.login$ = createEffect(() =>
      this.action$.pipe(
        ofType(LOGIN),
        exhaustMap((value: { email: string; password: string }) =>
          this.authService.login(value.email, value.password).pipe(
            map((data) =>
              loginResultAction({
                email: data.email,
                objectId: data.id,
                userToken: data.token,
              })
            ),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.signup$ = createEffect(() =>
      this.action$.pipe(
        ofType(SIGNUP),
        exhaustMap(
          (value: { user: User; password: string; provider: string }) =>
            this.authService
              .signUp(value.user, value.password, value.provider)
              .pipe(
                map(() =>
                  loginAction({
                    email: value.user.email,
                    password: value.password,
                  })
                ),
                catchError(() => of(errorAction()))
              )
        )
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { LOGIN, loginAction, loginResultAction, LOGOUT } from './login.actions';
import { exhaustMap, map, catchError, of } from 'rxjs';
import { errorAction, SIGNUP } from '../auth/auth.actions';
import { User } from '../../model/user';
import { MessagingService } from '../../services/messaging.service';

@Injectable()
export class LoginEffect {
  login$;
  signup$;
  logout$;

  constructor(
    private action$: Actions,
    private authService: AuthService,
    private messagingService: MessagingService
  ) {
    this.login$ = createEffect(() =>
      this.action$.pipe(
        ofType(LOGIN),
        exhaustMap(
          (value: { email: string; password: string; provider: string }) =>
            this.authService
              .login(value.email, value.password, value.provider)
              .pipe(
                map((data) => {
                  return loginResultAction({
                    email: data.email,
                    objectId: data.id,
                    userToken: data.token,
                  });
                })
              )
        )
      )
    );

    this.signup$ = createEffect(() =>
      this.action$.pipe(
        ofType(SIGNUP),
        exhaustMap(
          (value: {
            user: User;
            password: string;
            confirmationPassword: string;
          }) =>
            this.authService
              .signUp(value.user, value.password, value.confirmationPassword)
              .pipe(
                map(() =>
                  loginAction({
                    email: value.user.email,
                    password: value.password ?? '',
                    provider: value.user.provider,
                  })
                )
              )
        )
      )
    );

    this.logout$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(LOGOUT),
          map(() => {
            this.messagingService.unsubscribeFromChannels();
            this.authService.logout();
          })
        ),
      {
        dispatch: false,
      }
    );
  }
}

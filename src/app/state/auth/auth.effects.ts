import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  CHECKTOKENIFVALID,
  errorAction,
  FINDUSERS,
  GETALLUSERSINCONTACT,
  GETCURRENTLOGGEDINUSER,
  GETUSERBYOBJECTID,
  gottenCurrentLoggedInUserAction,
  gottenProfilePictureUrlAction,
  GOTTENUSER,
  gottenUserAction,
  gottenUsersAction,
  loginAction,
  LOGINACTION,
  loginResultAction,
  resultOfTokenCheckingAction,
  SIGNUPACTION,
  UPDATE_USER_INFO,
  UPLOAD_PROFILE_PICTURE,
} from './auth.actions';
import {
  catchError,
  debounce,
  debounceTime,
  exhaustMap,
  firstValueFrom,
  from,
  map,
  of,
  pipe,
} from 'rxjs';
import { User } from '../../model/user';
import { UPLOAD_IMG_MSG } from '../messaging/messaging.actions';

@Injectable()
export class AuthEffects {
  login$;
  signup$;
  tokenValid$;
  getCurrentLoggedInUser$;
  getUserByObjectId$;
  getAllUsers$;
  findUsers$;
  uploadProfilePicture$;
  updateUserInfo$;

  constructor(private action$: Actions, private authService: AuthService) {
    this.login$ = createEffect(() =>
      this.action$.pipe(
        ofType(LOGINACTION),
        exhaustMap((value: { email: string; password: string }) =>
          this.authService.login(value.email, value.password).pipe(
            map((data) =>
              loginResultAction({
                email: data.email,
                objectId: data.objectId,
                'user-token': data['user-token'],
              })
            ),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.signup$ = createEffect(() =>
      this.action$.pipe(
        ofType(SIGNUPACTION),
        exhaustMap(
          (value: { user: User; password: string; provider: string }) =>
            this.authService
              .signUp(value.user, value.password, value.provider)
              .pipe(
                map((data) =>
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

    this.tokenValid$ = createEffect(() =>
      this.action$.pipe(
        ofType(CHECKTOKENIFVALID),
        exhaustMap((value: { token: string }) =>
          this.authService.verifyIfTokenValid(value.token).pipe(
            map((valid) => resultOfTokenCheckingAction({ valid: valid })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getCurrentLoggedInUser$ = createEffect(() =>
      this.action$.pipe(
        ofType(GETCURRENTLOGGEDINUSER),
        exhaustMap((value: { objectId: string }) =>
          this.authService.findUserByObjectId(value.objectId).pipe(
            map((data) =>
              gottenCurrentLoggedInUserAction({
                currentUserLoggedIn: data,
              })
            ),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getUserByObjectId$ = createEffect(() =>
      this.action$.pipe(
        ofType(GETUSERBYOBJECTID),
        exhaustMap((value: { objectId: string }) =>
          this.authService.findUserByObjectId(value.objectId).pipe(
            map((data) => gottenUserAction({ user: data })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.getAllUsers$ = createEffect(() =>
      this.action$.pipe(
        ofType(GETALLUSERSINCONTACT),
        exhaustMap((value: { objectsId: string[] }) =>
          this.authService.findUsersByObjectId(value.objectsId).pipe(
            map((data) => gottenUsersAction({ users: data })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.findUsers$ = createEffect(() =>
      this.action$.pipe(
        debounceTime(500),
        ofType(FINDUSERS),
        exhaustMap((value: { name: string }) =>
          this.authService.findUsersByName(value.name).pipe(
            map((data) => gottenUsersAction({ users: data })),
            catchError(() => of(errorAction()))
          )
        )
      )
    );

    this.uploadProfilePicture$ = createEffect(() =>
      this.action$.pipe(
        ofType(UPLOAD_PROFILE_PICTURE),
        exhaustMap((value: { file: File; user: string }) =>
          from(
            this.authService.uploadImageProfile(value.file, value.user)
          ).pipe(
            map((result) => gottenProfilePictureUrlAction({ url: result }))
          )
        )
      )
    );

    this.updateUserInfo$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(UPDATE_USER_INFO),
          exhaustMap(
            (value: {
              objectId: string;
              firstName: string | undefined;
              lastName: string | undefined;
              email: string | undefined;
              password: string | undefined;
              profileImageLink: string;
            }) =>
              this.authService.updateInfos(
                value.objectId,
                value.firstName,
                value.lastName,
                value.email,
                value.password,
                value.profileImageLink
              )
          )
        ),
      {
        dispatch: false,
      }
    );
  }
}

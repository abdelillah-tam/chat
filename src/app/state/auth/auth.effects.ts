import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  errorAction,
  FIND_USERS,
  GET_ALL_USERS_IN_CONTACT,
  UPDATE_USER_INFO,
  UPLOAD_PROFILE_PICTURE,
  GET_CURRENT_LOGGEDIN_USER,
  retrievedCurrentLoggedInUserAction,
  GET_USER_BY_OBJECT_ID,
  retrievedUsersAction,
  retrievedUserAction,
  updatedInfosAction,
  CHECK_TOKEN_IF_VALID,
  retrievedTokenCheckingAction,
  GET_PROFILE_PICTURE_LINK,
  retrievedProfilePictureLinkAction,
  FIND_BY_EMAIL,
  retrievedFoundUserByEmailAction,
  RETRIEVED_PROFILE_PICTURE_LINK,
  retrievedProfilePictureAction,
} from './auth.actions';
import { catchError, debounceTime, exhaustMap, from, map, of, switchAll, switchMap } from 'rxjs';

@Injectable()
export class AuthEffects {
  getCurrentLoggedInUser$;
  getUserByObjectId$;
  getAllUsers$;
  findUsers$;
  uploadProfilePicture$;
  updateProfilePictureLink$;
  updateUserInfo$;
  tokenValidation$;
  getProfilePictureLink$;
  findUserByEmail$;

  constructor(private action$: Actions, private authService: AuthService) {
    this.getCurrentLoggedInUser$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_CURRENT_LOGGEDIN_USER),
        exhaustMap((value: { objectId: string }) =>
          this.authService.findUserById(value.objectId).pipe(
            map((data) => {
              return retrievedCurrentLoggedInUserAction({
                currentUserLoggedInOrError: data,
              });
            })
          )
        )
      )
    );

    this.getUserByObjectId$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_USER_BY_OBJECT_ID),
        map((value: { objectId: string }) =>
          this.authService.findUserById(value.objectId).pipe(
            map((data) => {
              return retrievedUserAction({ user: data });
            })
          )
        ),
        switchAll()
      )
    );

    this.getAllUsers$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_ALL_USERS_IN_CONTACT),
        exhaustMap(() =>
          this.authService.getUsersInContact().pipe(
            map((data) => {
              return retrievedUsersAction({
                users: data,
              });
            })
          )
        )
      )
    );

    this.findUsers$ = createEffect(() =>
      this.action$.pipe(
        debounceTime(500),
        ofType(FIND_USERS),
        exhaustMap((value: { name: string }) =>
          this.authService.findUsersByName(value.name).pipe(
            map((data) => {
              if ('error' in data) {
                return errorAction({
                  code: data.code,
                  error: data.error,
                });
              } else {
                return retrievedUsersAction({ users: data });
              }
            })
          )
        )
      )
    );

    this.uploadProfilePicture$ = createEffect(() =>
      this.action$.pipe(
        ofType(UPLOAD_PROFILE_PICTURE),
        exhaustMap((value: { file: File; userId: string }) =>
          from(this.authService.uploadImage(value.file, value.userId)).pipe(
            map((data) => {
              return retrievedProfilePictureLinkAction({ link: data });
            })
          )
        )
      )
    );

    this.updateProfilePictureLink$ = createEffect(() =>
      this.action$.pipe(
        ofType(RETRIEVED_PROFILE_PICTURE_LINK),
        exhaustMap((value: { link: string }) => {
          return this.authService.updateProfilePicture(value.link).pipe(
            map((data) => {
              return retrievedProfilePictureAction({link: data});
            })
          );
        })
      )
    );

    this.updateUserInfo$ = createEffect(() =>
      this.action$.pipe(
        ofType(UPDATE_USER_INFO),
        exhaustMap(
          (value: {
            objectId: string;
            firstName: string | undefined;
            lastName: string | undefined;
            email: string | undefined;
            password: string | undefined;
            provider: string;
          }) => {
            return this.authService
              .updateInfos(
                value.objectId,
                value.firstName,
                value.lastName,
                value.email,
                value.password,
                value.provider
              )
              .pipe(
                map((data) => {
                  return updatedInfosAction({ result: data });
                })
              );
          }
        )
      )
    );

    this.tokenValidation$ = createEffect(() =>
      this.action$.pipe(
        ofType(CHECK_TOKEN_IF_VALID),
        exhaustMap(() =>
          this.authService.validateToken().pipe(
            map((data) => {
              return retrievedTokenCheckingAction({ valid: data });
            })
          )
        )
      )
    );

    this.getProfilePictureLink$ = createEffect(() =>
      this.action$.pipe(
        ofType(GET_PROFILE_PICTURE_LINK),
        exhaustMap((value: { objectId: string }) =>
          this.authService.getProfilePictureLink(value.objectId).pipe(
            map((response) => {
              return retrievedProfilePictureAction({ link: response});
            })
          )
        )
      )
    );

    this.findUserByEmail$ = createEffect(() =>
      this.action$.pipe(
        ofType(FIND_BY_EMAIL),
        exhaustMap((value: { email: string }) =>
          this.authService
            .findUserByEmail(value.email)
            .pipe(
              map((data) => retrievedFoundUserByEmailAction({ data: data }))
            )
        )
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import {
  errorAction,
  loadLoggedInUserSuccess,
  loadUsersInContactSuccess,
  loadUserSuccess,
  updateUserInfoSuccess,
  requestCsrfTokenSuccess,
  loadLoggedInUser,
  loadUsersInContact,
  loadUserById,
  findUsers,
  uploadProfilePicAction,
  updateUserInfo,
  requestCsrfTokenAction,
  updatePassword,
  updatePasswordSuccess,
} from './auth.actions';
import {
  catchError,
  debounceTime,
  exhaustMap,
  from,
  map,
  of,
  switchAll,
} from 'rxjs';

@Injectable()
export class AuthEffects {
  getLoggedInUser$;
  getUserByObjectId$;
  getAllUsers$;
  findUsers$;
  uploadProfilePicture$;
  updateUserInfo$;
  updatePassword$;
  requestCsrfToken$;

  constructor(
    private action$: Actions,
    private authService: AuthService,
  ) {
    this.getLoggedInUser$ = createEffect(() =>
      this.action$.pipe(
        ofType(loadLoggedInUser),
        exhaustMap((value: { objectId: string }) => {
          return this.authService.findUserById(value.objectId).pipe(
            map((data) => {
              return loadLoggedInUserSuccess({
                currentUserLoggedInOrError: data,
              });
            }),
          );
        }),
      ),
    );

    this.getUserByObjectId$ = createEffect(() =>
      this.action$.pipe(
        ofType(loadUserById),
        map((value: { id: string }) =>
          this.authService.findUserById(value.id).pipe(
            map((data) => {
              return loadUserSuccess({ user: data });
            }),
          ),
        ),
        switchAll(),
      ),
    );

    this.getAllUsers$ = createEffect(() =>
      this.action$.pipe(
        ofType(loadUsersInContact),
        exhaustMap(() =>
          this.authService.getUsersInContact().pipe(
            map((data) => {
              return loadUsersInContactSuccess({
                users: data,
              });
            }),
          ),
        ),
      ),
    );

    this.findUsers$ = createEffect(() =>
      this.action$.pipe(
        debounceTime(500),
        ofType(findUsers),
        map((value: { name: string }) => {
          return this.authService.findUsersByName(value.name).pipe(
            map((data) => loadUsersInContactSuccess({ users: data })),
            catchError((error) =>
              of(errorAction({ code: error.status, error: error.message })),
            ),
          );
        }),
        switchAll(),
      ),
    );

    this.uploadProfilePicture$ = createEffect(() =>
      this.action$.pipe(
        ofType(uploadProfilePicAction),
        exhaustMap((value: { formData: FormData }) =>
          from(this.authService.uploadImage(value.formData)).pipe(
            map((data) => {
              if (typeof data != 'string') {
                return errorAction({
                  code: data.code,
                  error: data.message,
                });
              } else {
                return loadLoggedInUser({
                  objectId: localStorage.getItem('id')!,
                });
              }
            }),
          ),
        ),
      ),
    );

    this.updateUserInfo$ = createEffect(() =>
      this.action$.pipe(
        ofType(updateUserInfo),
        exhaustMap(
          (value: {
            firstName: string | undefined;
            lastName: string | undefined;
            email: string | undefined;
          }) => {
            return this.authService
              .updateInfos(value.firstName, value.lastName, value.email)
              .pipe(
                map((data) => {
                  return updateUserInfoSuccess({ result: data });
                }),
              );
          },
        ),
      ),
    );

    this.updatePassword$ = createEffect(() =>
      this.action$.pipe(
        ofType(updatePassword),
        exhaustMap(
          (value: {
            currentPassword: string;
            newPassword: string;
            passwordConfirmation: string;
          }) => {
            return this.authService
              .updatePassword(
                value.currentPassword,
                value.newPassword,
                value.passwordConfirmation,
              )
              .pipe(
                map((data) => {
                  return updatePasswordSuccess({ result: data });
                }),
              );
          },
        ),
      ),
    );

    this.requestCsrfToken$ = createEffect(() =>
      this.action$.pipe(
        ofType(requestCsrfTokenAction),
        exhaustMap(() => {
          return this.authService.requestCsrfToken().pipe(
            map((data) => {
              return requestCsrfTokenSuccess();
            }),
          );
        }),
      ),
    );
  }
}

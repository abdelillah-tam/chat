import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { CHECKTOKENIFVALID, errorAction, FINDUSERS, GETALLUSERSINCONTACT, GETCURRENTLOGGEDINUSER, GETUSERBYOBJECTID, gottenCurrentLoggedInUserAction, GOTTENUSER, gottenUserAction, gottenUsersAction, loginAction, LOGINACTION, loginResultAction, resultOfTokenCheckingAction, SIGNUPACTION } from "./auth.actions";
import { catchError, debounce, debounceTime, exhaustMap, firstValueFrom, map, of, pipe } from "rxjs";
import { User } from "../../model/user";

@Injectable()
export class AuthEffects {


    login$;
    signup$;
    tokenValid$;
    getCurrentLoggedInUser$;
    getUserByObjectId$;
    getAllUsers$;
    findUsers$;

    constructor(private action$: Actions, private authService: AuthService) {
        this.login$ = createEffect(() => this.action$.pipe(
            ofType(LOGINACTION),
            exhaustMap((value: { email: string; password: string; }) => {
                return this.authService.login(value.email, value.password).pipe(
                    map(data => {
                        return loginResultAction({
                            email: data.email,
                            objectId: data.objectId,
                            'user-token': data["user-token"]
                        });
                    }),
                    catchError(() => of(errorAction()))
                )
            })
        ));

        this.signup$ = createEffect(() => this.action$.pipe(
            ofType(SIGNUPACTION),
            exhaustMap((value: { user: User; password: string; provider: string }) => {
                return this.authService.signUp(value.user,
                    value.password,
                    value.provider).pipe(
                        map(data => {
                            return loginAction({ email: value.user.email, password: value.password });
                        }),
                        catchError(() => of(errorAction())));
                ;
            })
        ));

        this.tokenValid$ = createEffect(() => this.action$.pipe(
            ofType(CHECKTOKENIFVALID),
            exhaustMap((value: { token: string }) => {
                return this.authService.verifyIfTokenValid(value.token).pipe(
                    map((valid) => {
                        return resultOfTokenCheckingAction({ valid: valid });
                    }),
                    catchError(() => of(errorAction()))
                )
            })
        ))

        this.getCurrentLoggedInUser$ = createEffect(() => this.action$.pipe(
            ofType(GETCURRENTLOGGEDINUSER),
            exhaustMap((value: { objectId: string }) => {
                return this.authService.findUserByObjectId(value.objectId)
                    .pipe(
                        map(data => {
                            return gottenCurrentLoggedInUserAction({ currentUserLoggedIn: data });
                        }),
                        catchError(() => of(errorAction()))
                    )
            })
        ));

        this.getUserByObjectId$ = createEffect(() => this.action$.pipe(
            ofType(GETUSERBYOBJECTID),
            exhaustMap((value: { objectId: string }) => {
                return this.authService.findUserByObjectId(value.objectId)
                    .pipe(
                        map((data) => {
                            return gottenUserAction({ user: data });
                        }),
                        catchError(() => of(errorAction()))
                    )
            })
        ));

        this.getAllUsers$ = createEffect(() => this.action$.pipe(
            ofType(GETALLUSERSINCONTACT),
            exhaustMap((value: { objectsId: string[] }) => {
                return this.authService
                    .findUsersByObjectId(value.objectsId)
                    .pipe(
                        map(data => {
                            return gottenUsersAction({ users: data });
                        }),
                        catchError(() => of(errorAction()))
                    )
            })
        ));

        this.findUsers$ = createEffect(() => this.action$.pipe(
            debounceTime(500),
            ofType(FINDUSERS),
            exhaustMap((value: { name: string }) => {
                return this.authService.findUsersByName(value.name)
                    .pipe(
                        map(data => {
                            return gottenUsersAction({ users: data });
                        }),
                        catchError(() => of(errorAction()))
                    )
            })
        ))
    }

}
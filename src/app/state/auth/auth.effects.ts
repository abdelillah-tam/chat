import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/auth.service";
import { AUTHAPI, ERRORAPI, errorLogin, LOGINACTION, loginResult } from "./auth.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { createAction } from "@ngrx/store";

@Injectable()
export class AuthEffects {


    login$

    constructor(private action$: Actions, private authService: AuthService) {
        this.login$ = createEffect(() => this.action$.pipe(
            ofType(LOGINACTION),
            exhaustMap((value: { email: string; password: string }) => {
                return this.authService.login(value.email, value.password).pipe(
                    map(data => {
                        return loginResult({
                            email: data.email,
                            objectId: data.objectId,
                            'user-token': data["user-token"]
                        });
                    }),
                    catchError(() => of(errorLogin()))
                )
            })
        ))
    }

}
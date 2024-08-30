import { createReducer, on } from "@ngrx/store";
import { errorLogin, login, loginResult } from "./auth.actions";
import { AuthState } from "./auth-state";

const initialState: AuthState = { state: 'none', objectId: '', email: '', userToken: '' };

export const authReducer = createReducer(
    initialState,
    on(login, (state) => {
        return state;
    }),
    on(loginResult, (state, data) => {
        return {
            ...state,
            state: 'success',
            email: data.email,
            userToken: data["user-token"],
            objectId: data.objectId
        };
    }),
    on(errorLogin, (state) => {
        return { ...state, state: 'failed' };
    })
);